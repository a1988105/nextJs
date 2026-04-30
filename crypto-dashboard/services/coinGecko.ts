import { cache } from 'react'
import { CoinDetailSchema, type CoinDetail } from '@/schemas/coin'
import { MarketCoinsSchema, type CoinMarket } from '@/schemas/market'
import { CoinGeckoPriceSchema } from '@/schemas/price'
import { logger } from '@/lib/logger'

const BASE_URL = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'

export const getCoin = cache(async function getCoin(id: string): Promise<CoinDetail | null> {
  const coinUrl = `${BASE_URL}/coins/${encodeURIComponent(id)}`

  try {
    const res = await fetch(coinUrl, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      logger.error('coingecko', 'Failed to fetch coin detail', {
        coinId: id,
        status: res.status,
        statusText: res.statusText,
      })
      return null
    }

    const raw = await res.json()
    const parsed = CoinDetailSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error('coingecko', 'Invalid coin detail response', {
        coinId: id,
        issues: parsed.error.issues,
      })
      return null
    }

    return parsed.data
  } catch (error) {
    logger.error('coingecko', 'Coin detail request threw', { coinId: id, error })
    return null
  }
})

export async function getMarket(): Promise<CoinMarket[]> {
  const marketUrl = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10`

  try {
    const res = await fetch(marketUrl, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      logger.error('coingecko', 'Failed to fetch market data', {
        status: res.status,
        statusText: res.statusText,
      })
      return []
    }

    const raw = await res.json()
    const parsed = MarketCoinsSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error('coingecko', 'Invalid market data response', {
        issues: parsed.error.issues,
      })
      return []
    }

    return parsed.data
  } catch (error) {
    logger.error('coingecko', 'Market data request threw', { error })
    return []
  }
}

export async function getCoinPrice(coinId: string): Promise<number | null> {
  const priceUrl = `${BASE_URL}/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=usd`

  try {
    const res = await fetch(priceUrl, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      logger.error('coingecko', 'Failed to fetch price', {
        coinId,
        status: res.status,
        statusText: res.statusText,
      })
      return null
    }

    const raw = await res.json()
    const parsed = CoinGeckoPriceSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error('coingecko', 'Invalid price response', {
        coinId,
        issues: parsed.error.issues,
      })
      return null
    }

    return parsed.data[coinId]?.usd ?? null
  } catch (error) {
    logger.error('coingecko', 'Price request threw', { coinId, error })
    return null
  }
}
