import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export type Holding = {
  coin: string
  amount: number
  value: number
}

export type UserBalance = {
  balance: number
  holdings: Holding[]
}

export const COIN_SYMBOLS: Record<string, string> = {
  bitcoin: '₿',
  ethereum: 'Ξ',
  solana: '◎',
}

export const getUserBalance = cache(async function getUserBalance(userId: number): Promise<UserBalance> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { holdings: true },
  })

  return {
    balance: user?.balance ?? 0,
    holdings: (user?.holdings ?? []).map((h) => ({
      coin: h.coin,
      amount: h.amount,
      value: h.value,
    })),
  }
})

export function getPortfolioTotal({ balance, holdings }: UserBalance) {
  return balance + holdings.reduce((sum, h) => sum + h.value, 0)
}
