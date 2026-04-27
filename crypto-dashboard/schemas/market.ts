import { z } from 'zod'

export const CoinMarketSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  market_cap: z.number(),
  price_change_percentage_24h: z.number(),
  market_cap_rank: z.number(),
})

export const MarketCoinsSchema = z.array(CoinMarketSchema)

export type CoinMarket = z.infer<typeof CoinMarketSchema>
