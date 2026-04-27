import { cache } from 'react'

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

export const getUserBalance = cache(function getUserBalance(): UserBalance {
  return {
    balance: 10000,
    holdings: [
      { coin: 'bitcoin', amount: 0.5, value: 45000 },
      { coin: 'ethereum', amount: 3.2, value: 9600 },
    ],
  }
})

export function getPortfolioTotal({ balance, holdings }: UserBalance) {
  return balance + holdings.reduce((sum, holding) => sum + holding.value, 0)
}
