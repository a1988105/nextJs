export async function GET(
  _request: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
    { next: { revalidate: 30 } }
  )
  const data = await res.json()
  return Response.json({ price: data[coinId]?.usd ?? null })
}
