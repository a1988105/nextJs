import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageReveal } from '@/components/PageReveal'
import { getMarket } from '@/services/coinGecko'

export const metadata: Metadata = {
  title: 'Market Overview | Crypto Dashboard',
  description: 'Top 10 cryptocurrencies by market cap, refreshed every 60 seconds.',
}

export default async function MarketNewsPage() {
  const coins = await getMarket()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageReveal delay={1} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">Market Overview</h1>
          <span className="num text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            ISR · 60s
          </span>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Top 10 cryptocurrencies by market capitalization
        </p>
      </PageReveal>

      {coins.length === 0 && (
        <PageReveal
          delay={2}
          className="themed-card flex flex-col items-center justify-center py-24 text-center rounded-xl border border-[var(--border)] bg-[var(--card)]"
        >
          <p className="text-2xl mb-3">⚠</p>
          <p className="text-[var(--muted)] text-sm">Market data temporarily unavailable</p>
          <p className="text-[var(--muted)] text-xs mt-1">Please try again shortly</p>
        </PageReveal>
      )}

      {coins.length > 0 && (
        <PageReveal
          delay={2}
          className="themed-card rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">Coin</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">24h</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => {
                const isPos = coin.price_change_percentage_24h >= 0
                return (
                  <tr
                    key={coin.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors duration-100 group"
                  >
                    <td className="px-5 py-4 num text-[var(--muted)] text-xs">{coin.market_cap_rank}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/coins/${coin.id}`}
                        className="flex items-center gap-3 hover:text-amber-400 transition-colors duration-150"
                      >
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={28}
                          height={28}
                          className="rounded-full"
                          unoptimized
                        />
                        <span className="font-semibold text-[var(--text)] group-hover:text-amber-400 transition-colors duration-150">
                          {coin.name}
                        </span>
                        <span className="num text-[var(--muted)] uppercase text-xs">{coin.symbol}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-right num font-medium text-[var(--text)]">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-block num text-xs px-2 py-0.5 rounded font-medium ${
                          isPos ? 'text-[var(--green)] bg-emerald-400/10' : 'text-[var(--red)] bg-red-400/10'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right num text-[var(--muted)] text-xs hidden md:table-cell">
                      ${(coin.market_cap / 1e9).toFixed(1)}B
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </PageReveal>
      )}

      <p className="num text-xs text-[var(--muted)] mt-5">↻ Revalidates every 60 seconds via ISR</p>
    </div>
  )
}
