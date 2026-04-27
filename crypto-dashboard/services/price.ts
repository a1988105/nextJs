import { PriceResponseSchema, type PriceResponse } from '@/schemas/price'

export async function fetchCoinPrice(coinId: string): Promise<PriceResponse> {
  try {
    const res = await fetch(`/api/price/${coinId}`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return { price: null }
    const raw = await res.json()
    return PriceResponseSchema.parse(raw)
  } catch {
    return { price: null }
  }
}
