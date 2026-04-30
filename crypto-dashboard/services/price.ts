import { PriceResponseSchema, type PriceResponse } from '@/schemas/price'
import { logger } from '@/lib/logger'

export async function fetchCoinPrice(coinId: string): Promise<PriceResponse> {
  try {
    const res = await fetch(`/api/price/${coinId}`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      logger.warn('client.price', 'Price API request failed', {
        coinId,
        status: res.status,
        statusText: res.statusText,
      })
      return { price: null }
    }

    const raw = await res.json()
    const parsed = PriceResponseSchema.safeParse(raw)
    if (!parsed.success) {
      logger.warn('client.price', 'Invalid price API response', {
        coinId,
        issues: parsed.error.issues,
      })
      return { price: null }
    }

    return parsed.data
  } catch (error) {
    logger.warn('client.price', 'Price API request threw', { coinId, error })
    return { price: null }
  }
}
