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

export function getPortfolioTotal({ balance, holdings }: UserBalance) {
  return balance + holdings.reduce((sum, h) => sum + h.value, 0)
}
