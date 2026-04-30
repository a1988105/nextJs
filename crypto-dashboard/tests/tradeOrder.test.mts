import assert from 'node:assert/strict'
import test from 'node:test'
import {
  executeBuyOrder,
  InsufficientBalanceError,
  InvalidOrderInputError,
  type TradeOrderPrisma,
  UnsupportedCoinError,
} from '../lib/tradeOrder.ts'

type TradeTransaction = Parameters<Parameters<TradeOrderPrisma['$transaction']>[0]>[0]
type UpdateManyArgs = Parameters<TradeTransaction['user']['updateMany']>[0]

function createPrismaMock(initialBalance: number) {
  const calls = {
    upserts: 0,
    trades: 0,
  }
  const state = {
    balance: initialBalance,
  }

  const tx = {
    user: {
      async updateMany(args: UpdateManyArgs) {
        assert.deepEqual(args.where, { id: 1, balance: { gte: args.data.balance.decrement } })

        if (state.balance < args.where.balance.gte) {
          return { count: 0 }
        }

        state.balance -= args.data.balance.decrement
        return { count: 1 }
      },
    },
    holding: {
      async upsert() {
        calls.upserts += 1
      },
    },
    trade: {
      async create() {
        calls.trades += 1
      },
    },
  }
  const prisma = {
    async $transaction(fn: Parameters<TradeOrderPrisma['$transaction']>[0]) {
      return fn(tx)
    },
  } satisfies TradeOrderPrisma

  return {
    calls,
    state,
    prisma,
  }
}

test('rejects unsupported coins before writing anything', async () => {
  const mock = createPrismaMock(1000)

  await assert.rejects(
    () =>
      executeBuyOrder(mock.prisma, {
        userId: 1,
        coin: 'dogecoin',
        usdAmount: 100,
        price: 10,
      }),
    UnsupportedCoinError
  )

  assert.equal(mock.state.balance, 1000)
  assert.equal(mock.calls.upserts, 0)
  assert.equal(mock.calls.trades, 0)
})

test('rejects invalid amounts before writing anything', async () => {
  const mock = createPrismaMock(1000)

  await assert.rejects(
    () =>
      executeBuyOrder(mock.prisma, {
        userId: 1,
        coin: 'bitcoin',
        usdAmount: Infinity,
        price: 10,
      }),
    InvalidOrderInputError
  )

  assert.equal(mock.state.balance, 1000)
  assert.equal(mock.calls.upserts, 0)
  assert.equal(mock.calls.trades, 0)
})

test('updates balance conditionally before creating holdings and trade records', async () => {
  const mock = createPrismaMock(150)

  const result = await executeBuyOrder(mock.prisma, {
    userId: 1,
    coin: 'bitcoin',
    usdAmount: 100,
    price: 25,
  })

  assert.equal(result.qty, 4)
  assert.equal(mock.state.balance, 50)
  assert.equal(mock.calls.upserts, 1)
  assert.equal(mock.calls.trades, 1)
})

test('does not create holdings or trades when the conditional balance update fails', async () => {
  const mock = createPrismaMock(50)

  await assert.rejects(
    () =>
      executeBuyOrder(mock.prisma, {
        userId: 1,
        coin: 'bitcoin',
        usdAmount: 100,
        price: 25,
      }),
    InsufficientBalanceError
  )

  assert.equal(mock.state.balance, 50)
  assert.equal(mock.calls.upserts, 0)
  assert.equal(mock.calls.trades, 0)
})

test('prevents overspending when two orders race the same balance', async () => {
  const mock = createPrismaMock(100)

  const firstOrder = executeBuyOrder(mock.prisma, {
    userId: 1,
    coin: 'bitcoin',
    usdAmount: 80,
    price: 20,
  })
  const secondOrder = executeBuyOrder(mock.prisma, {
    userId: 1,
    coin: 'ethereum',
    usdAmount: 80,
    price: 20,
  })

  const results = await Promise.allSettled([firstOrder, secondOrder])
  const successes = results.filter((result) => result.status === 'fulfilled')
  const failures = results.filter((result) => result.status === 'rejected')

  assert.equal(successes.length, 1)
  assert.equal(failures.length, 1)
  assert.equal(failures[0].reason instanceof InsufficientBalanceError, true)
  assert.equal(mock.state.balance, 20)
  assert.equal(mock.calls.upserts, 1)
  assert.equal(mock.calls.trades, 1)
})
