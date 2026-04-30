import { CoinGeckoPriceSchema } from '@/schemas/price'
import { logger } from '@/lib/logger'

const BASE_URL = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  const priceUrl = `${BASE_URL}/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=usd`

  try {
    const res = await fetch(priceUrl, { next: { revalidate: 30 } })
    if (!res.ok) {
      logger.error('api.price', 'Failed to fetch price', {
        coinId,
        status: res.status,
        statusText: res.statusText,
      })
      return Response.json({ price: null })
    }

    const raw = await res.json()
    const parsed = CoinGeckoPriceSchema.safeParse(raw)
    if (!parsed.success) {
      logger.error('api.price', 'Invalid price response', {
        coinId,
        issues: parsed.error.issues,
      })
      return Response.json({ price: null })
    }

    return Response.json({ price: parsed.data[coinId]?.usd ?? null })
  } catch (error) {
    logger.error('api.price', 'Price route threw', { coinId, error })
    return Response.json({ price: null })
  }
}
