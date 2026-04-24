import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageReveal } from '@/components/PageReveal';

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

// 先預先建立hotpath，讓Next.js知道有哪些動態路由需要預先渲染
export async function generateStaticParams() {
  return COINS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const coin = await getCoin(id);
  if (!coin) return { title: 'Not Found' };

  return {
    title: `${coin.name} (${coin.symbol.toUpperCase()}) | Crypto Dashboard`,
    description: coin.description.en.replace(HTML_TAG_REGEX, '').slice(0, 160),
  };
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params;

  const coin = await getCoin(id);

  if (!coin) notFound();

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  const description = coin.description.en.replace(HTML_TAG_REGEX, '');

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Back */}
      <PageReveal delay={1} className="mb-9">
        <Link
          href="/market/news"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-amber-400 transition-colors duration-150"
        >
          ← Market Overview
        </Link>
      </PageReveal>

      {/* Hero */}
      <PageReveal delay={1} className="flex items-center gap-5 mb-10">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl scale-150 pointer-events-none" />
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={72}
            height={72}
            className="relative rounded-full"
            unoptimized
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            {coin.name}
          </h1>
          <span className="num text-gray-500 uppercase text-sm tracking-widest mt-1 block">
            {coin.symbol}
          </span>
        </div>
      </PageReveal>

      {/* Metrics grid */}
      <PageReveal delay={2} className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-150 p-5">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Current Price</p>
          <p className="num text-2xl font-bold text-white">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-150 p-5">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">24h Change</p>
          <p className={`num text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-150 p-5 col-span-2">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Market Cap</p>
          <p className="num text-2xl font-bold text-white">
            ${coin.market_data.market_cap.usd.toLocaleString()}
          </p>
        </div>
      </PageReveal>

      {/* Description */}
      {description ? (
        <PageReveal delay={3} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="font-bold text-white mb-3">About {coin.name}</h2>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-6">
            {description}
          </p>
        </PageReveal>
      ) : null}

      <p className="num text-xs text-gray-700 mt-5">
        ⚡ SSG — 在建置時預先渲染
      </p>
    </div>
  );
}
