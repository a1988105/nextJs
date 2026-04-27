import { z } from 'zod'

export const CoinDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  description: z.object({ en: z.string() }),
  image: z.object({ large: z.string().url() }),
  market_data: z.object({
    current_price: z.object({ usd: z.number() }),
    market_cap: z.object({ usd: z.number() }),
    price_change_percentage_24h: z.number(),
  }),
})

export type CoinDetail = z.infer<typeof CoinDetailSchema>
