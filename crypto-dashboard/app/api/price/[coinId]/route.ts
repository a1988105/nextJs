import { CoinGeckoPriceSchema } from '@/schemas/price'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return Response.json({ price: null })
    const raw = await res.json()
    const parsed = CoinGeckoPriceSchema.safeParse(raw)
    if (!parsed.success) return Response.json({ price: null })
    return Response.json({ price: parsed.data[coinId]?.usd ?? null })
  } catch {
    return Response.json({ price: null })
  }
}
