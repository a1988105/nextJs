import type { Metadata } from 'next';

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
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10',
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch market data');
  return res.json();
}

export default async function MarketNewsPage() {
  const coins = await getMarket();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Market Overview</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Coin</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Price</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">24h %</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const isPositive = coin.price_change_percentage_24h >= 0;
              return (
                <tr key={coin.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{coin.market_cap_rank}</td>
                  <td className="px-4 py-3">
                    <a href={`/coins/${coin.id}`} className="flex items-center gap-2 hover:underline">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-gray-400 uppercase text-xs">{coin.symbol}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${(coin.market_cap / 1e9).toFixed(1)}B
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Rendered with ISR — revalidates every 60 seconds in the background
      </p>
    </div>
  );
}
