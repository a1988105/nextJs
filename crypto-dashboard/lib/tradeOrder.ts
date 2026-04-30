export const SUPPORTED_COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin'] as const

export type SupportedCoin = (typeof SUPPORTED_COINS)[number]

export type TradeOrderInput = {
  userId: number
  coin: string
  usdAmount: number
  price: number
}

type TradeTransaction = {
  user: {
    updateMany: (args: {
      where: { id: number; balance: { gte: number } }
      data: { balance: { decrement: number } }
    }) => Promise<{ count: number }>
  }
  holding: {
    upsert: (args: {
      where: { userId_coin: { userId: number; coin: string } }
      create: { userId: number; coin: string; amount: number; value: number }
      update: { amount: { increment: number }; value: { increment: number } }
    }) => Promise<unknown>
  }
  trade: {
    create: (args: {
      data: { userId: number; coin: string; usdAmount: number; price: number; qty: number }
    }) => Promise<unknown>
  }
}

export type TradeOrderPrisma = {
  $transaction: (fn: (tx: TradeTransaction) => Promise<void>) => Promise<void>
}

export class InvalidOrderInputError extends Error {
  constructor(message = 'Invalid order input') {
    super(message)
    this.name = 'InvalidOrderInputError'
  }
}

export class UnsupportedCoinError extends Error {
  constructor(coin: string) {
    super(`Unsupported coin: ${coin}`)
    this.name = 'UnsupportedCoinError'
  }
}

export class InsufficientBalanceError extends Error {
  constructor() {
    super('Insufficient balance')
    this.name = 'InsufficientBalanceError'
  }
}

export function isSupportedCoin(coin: string): coin is SupportedCoin {
  return SUPPORTED_COINS.includes(coin as SupportedCoin)
}

export function validateTradeOrderInput(input: TradeOrderInput) {
  if (!Number.isInteger(input.userId) || input.userId <= 0) {
    throw new InvalidOrderInputError('Invalid user id')
  }

  if (!isSupportedCoin(input.coin)) {
    throw new UnsupportedCoinError(input.coin)
  }

  if (!Number.isFinite(input.usdAmount) || input.usdAmount <= 0) {
    throw new InvalidOrderInputError('Invalid USD amount')
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new InvalidOrderInputError('Invalid price')
  }
}

export async function executeBuyOrder(prisma: TradeOrderPrisma, input: TradeOrderInput) {
  validateTradeOrderInput(input)

  const { userId, coin, usdAmount, price } = input
  const qty = usdAmount / price

  await prisma.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: {
        id: userId,
        balance: { gte: usdAmount },
      },
      data: {
        balance: { decrement: usdAmount },
      },
    })

    if (updated.count !== 1) {
      throw new InsufficientBalanceError()
    }

    await tx.holding.upsert({
      where: { userId_coin: { userId, coin } },
      create: { userId, coin, amount: qty, value: usdAmount },
      update: { amount: { increment: qty }, value: { increment: usdAmount } },
    })

    await tx.trade.create({
      data: { userId, coin, usdAmount, price, qty },
    })
  })

  return { qty }
}

// --- Sell Order ---

export class InsufficientHoldingError extends Error {
  constructor() {
    super('Insufficient holding')
    this.name = 'InsufficientHoldingError'
  }
}

type HoldingRow = { amount: number; value: number }

type SellTransaction = {
  user: {
    update: (args: {
      where: { id: number }
      data: { balance: { increment: number } }
    }) => Promise<unknown>
  }
  holding: {
    findUnique: (args: {
      where: { userId_coin: { userId: number; coin: string } }
    }) => Promise<HoldingRow | null>
    update: (args: {
      where: { userId_coin: { userId: number; coin: string } }
      data: { amount: { decrement: number }; value: { decrement: number } }
    }) => Promise<unknown>
    delete: (args: {
      where: { userId_coin: { userId: number; coin: string } }
    }) => Promise<unknown>
  }
  trade: {
    create: (args: {
      data: { userId: number; coin: string; usdAmount: number; price: number; qty: number }
    }) => Promise<unknown>
  }
}

export type SellOrderPrisma = {
  $transaction: (fn: (tx: SellTransaction) => Promise<void>) => Promise<void>
}

export type SellOrderInput = {
  userId: number
  coin: string
  coinAmount: number
  price: number
}

export function validateSellOrderInput(input: SellOrderInput) {
  if (!Number.isInteger(input.userId) || input.userId <= 0) {
    throw new InvalidOrderInputError('Invalid user id')
  }
  if (!isSupportedCoin(input.coin)) {
    throw new UnsupportedCoinError(input.coin)
  }
  if (!Number.isFinite(input.coinAmount) || input.coinAmount <= 0) {
    throw new InvalidOrderInputError('Invalid coin amount')
  }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new InvalidOrderInputError('Invalid price')
  }
}

export async function executeSellOrder(prisma: SellOrderPrisma, input: SellOrderInput) {
  validateSellOrderInput(input)

  const { userId, coin, coinAmount, price } = input
  const usdReceived = coinAmount * price

  await prisma.$transaction(async (tx) => {
    const holding = await tx.holding.findUnique({
      where: { userId_coin: { userId, coin } },
    })

    if (!holding || holding.amount + 1e-9 < coinAmount) {
      throw new InsufficientHoldingError()
    }

    const valueDecrement = (coinAmount / holding.amount) * holding.value
    const remainingAmount = holding.amount - coinAmount

    if (remainingAmount < 1e-9) {
      await tx.holding.delete({ where: { userId_coin: { userId, coin } } })
    } else {
      await tx.holding.update({
        where: { userId_coin: { userId, coin } },
        data: { amount: { decrement: coinAmount }, value: { decrement: valueDecrement } },
      })
    }

    await tx.user.update({
      where: { id: userId },
      data: { balance: { increment: usdReceived } },
    })

    await tx.trade.create({
      data: { userId, coin, usdAmount: -usdReceived, price, qty: -coinAmount },
    })
  })

  return { usdReceived }
}
