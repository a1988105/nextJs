import { z } from 'zod'

const CoinMarketSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  market_cap: z.number(),
  price_change_percentage_24h: z.number(),
  market_cap_rank: z.number(),
})

const RawCoinMarketSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  current_price: z.number().nullable(),
  market_cap: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
  market_cap_rank: z.number().nullable(),
})

export const MarketCoinsSchema = z.array(RawCoinMarketSchema).transform((coins) =>
  coins.flatMap((coin) => {
    if (
      coin.current_price === null ||
      coin.market_cap === null ||
      coin.price_change_percentage_24h === null ||
      coin.market_cap_rank === null
    ) {
      return []
    }

    return [
      CoinMarketSchema.parse({
        ...coin,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap_rank: coin.market_cap_rank,
      }),
    ]
  })
)

export type CoinMarket = z.output<typeof MarketCoinsSchema>[number]
