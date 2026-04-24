import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

const HTML_TAG_REGEX = /<[^>]*>/g;

const COINS = ['bitcoin', 'ethereum', 'solana'];

type Props = {
  params: Promise<{ id: string }>;
};

interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  description: { en: string };
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
  };
}

const getCoin = cache(async function getCoin(id: string): Promise<CoinDetail | null> {
  try {
    const base = process.env.COINGECKO_BASE_URL;
    const res = await fetch(
      `${base}/coins/${id}`,
      { cache: 'force-cache', signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  return COINS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!COINS.includes(id)) return { title: 'Not Found' };
  const coin = await getCoin(id);
  if (!coin) return { title: 'Not Found' };

  return {
    title: `${coin.name} (${coin.symbol.toUpperCase()}) | Crypto Dashboard`,
    description: coin.description.en.replace(HTML_TAG_REGEX, '').slice(0, 160),
  };
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params;
  if (!COINS.includes(id)) notFound();
  const coin = await getCoin(id);

  if (!coin) notFound();

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={64}
          height={64}
          className="rounded-full"
          unoptimized
          priority
        />
        <div>
          <h1 className="text-2xl font-bold">{coin.name}</h1>
          <span className="text-gray-500 uppercase text-sm">{coin.symbol}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500 mb-1">Current Price</p>
          <p className="text-xl font-semibold">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500 mb-1">24h Change</p>
          <p className={`text-xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 col-span-2">
          <p className="text-xs text-gray-500 mb-1">Market Cap</p>
          <p className="text-xl font-semibold">
            ${coin.market_data.market_cap.usd.toLocaleString()}
          </p>
        </div>
      </div>

      {coin.description.en ? (
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-semibold mb-2">About {coin.name}</h2>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
            {coin.description.en.replace(HTML_TAG_REGEX, '')}
          </p>
        </div>
      ) : null}

      <p className="text-xs text-gray-400 mt-4">
        Rendered with SSG (force-cache) — data fetched at build time
      </p>
    </div>
  );
}
