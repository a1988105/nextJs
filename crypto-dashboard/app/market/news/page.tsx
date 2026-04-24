import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Market Overview | Crypto Dashboard',
  description: 'Top 10 cryptocurrencies by market cap, refreshed every 60 seconds.',
};

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

async function getMarket(): Promise<Coin[]> {
  try {
    const base = process.env.COINGECKO_BASE_URL;
    const res = await fetch(
      `${base}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function MarketNewsPage() {
  const coins = await getMarket();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 fade-up delay-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black text-white tracking-tight">Market Overview</h1>
          <span className="num text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            ISR · 60s
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Top 10 cryptocurrencies by market capitalization
        </p>
      </div>

      {coins.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-white/[0.07] bg-white/[0.02] fade-up delay-2">
          <p className="text-2xl mb-3">⚠</p>
          <p className="text-gray-400 text-sm">Market data temporarily unavailable</p>
          <p className="text-gray-600 text-xs mt-1">Please try again shortly</p>
        </div>
      )}

      {coins.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden fade-up delay-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wider">
                  Coin
                </th>
                <th className="text-right px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="text-right px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wider">
                  24h
                </th>
                <th className="text-right px-5 py-3.5 text-gray-600 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => {
                const isPos = coin.price_change_percentage_24h >= 0;
                return (
                  <tr
                    key={coin.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-colors duration-100 group"
                  >
                    <td className="px-5 py-4 num text-gray-600 text-xs">
                      {coin.market_cap_rank}
                    </td>
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
                        <span className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-150">
                          {coin.name}
                        </span>
                        <span className="num text-gray-600 uppercase text-xs">
                          {coin.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-right num font-medium text-white">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-block num text-xs px-2 py-0.5 rounded font-medium ${
                          isPos
                            ? 'text-emerald-400 bg-emerald-400/10'
                            : 'text-red-400 bg-red-400/10'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right num text-gray-500 text-xs hidden md:table-cell">
                      ${(coin.market_cap / 1e9).toFixed(1)}B
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="num text-xs text-gray-700 mt-5">
        ↻ Revalidates every 60 seconds via ISR
      </p>
    </div>
  );
}
