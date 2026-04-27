import { z } from 'zod'

export const CoinGeckoPriceSchema = z.record(
  z.string(),
  z.object({ usd: z.number() })
)

export const PriceResponseSchema = z.object({
  price: z.number().nullable(),
})

export type PriceResponse = z.infer<typeof PriceResponseSchema>
