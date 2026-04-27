import { cache } from 'react'
import { CoinDetailSchema, type CoinDetail } from '@/schemas/coin'
import { MarketCoinsSchema, type CoinMarket } from '@/schemas/market'
import { CoinGeckoPriceSchema } from '@/schemas/price'

const BASE_URL = process.env.COINGECKO_BASE_URL

export const getCoin = cache(async function getCoin(id: string): Promise<CoinDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/coins/${id}`, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const raw = await res.json()
    return CoinDetailSchema.parse(raw)
  } catch {
    return null
  }
})

export async function getMarket(): Promise<CoinMarket[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return []
    const raw = await res.json()
    return MarketCoinsSchema.parse(raw)
  } catch {
    return []
  }
}

export async function getCoinPrice(coinId: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return null
    const raw = await res.json()
    const parsed = CoinGeckoPriceSchema.parse(raw)
    return parsed[coinId]?.usd ?? null
  } catch {
    return null
  }
}
