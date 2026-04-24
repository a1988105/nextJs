import Link from 'next/link';

const features = [
  {
    href: '/market/news',
    label: 'Market Overview',
    tag: 'ISR · 60s',
    desc: 'Live-refreshing top 10 coins by market cap, updated every 60 seconds via Incremental Static Regeneration.',
    color: '#FBBF24',
  },
  {
    href: '/coins/bitcoin',
    label: 'Coin Detail',
    tag: 'SSG',
    desc: 'Static pages pre-rendered at build time for Bitcoin, Ethereum, and Solana.',
    color: '#22D3EE',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    tag: 'SSR + Auth',
    desc: 'Server-rendered portfolio view protected by NextAuth session-based authentication.',
    color: '#34D399',
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      {/* Hero */}
      <div className="mb-20 fade-up delay-1">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
            Next.js 15 Learning Project
          </span>
        </div>

        <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black tracking-tight leading-none mb-6">
          <span className="gradient-text">Crypto</span>
          <br />
          <span className="text-white/90">Dashboard</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
          Exploring SSG, ISR, and SSR rendering strategies with real crypto data,
          authentication, and server actions.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {features.map((f, i) => (
          <Link
            key={f.href}
            href={f.href}
            className={`group block rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200 fade-up delay-${i + 2}`}
          >
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-xs font-mono font-medium px-2 py-0.5 rounded-md"
                style={{ color: f.color, background: `${f.color}18` }}
              >
                {f.tag}
              </span>
              <span className="text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150">
                →
              </span>
            </div>
            <h2 className="font-bold text-white text-lg mb-2">{f.label}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Coin quick-links */}
      <div className="flex items-center gap-3 fade-up delay-5">
        <span className="text-xs text-gray-700">Pre-rendered coins:</span>
        {['bitcoin', 'ethereum', 'solana'].map((id) => (
          <Link
            key={id}
            href={`/coins/${id}`}
            className="text-xs text-gray-500 hover:text-amber-400 capitalize transition-colors duration-150 border border-white/[0.07] hover:border-amber-400/30 px-2.5 py-1 rounded-md"
          >
            {id}
          </Link>
        ))}
      </div>
    </div>
  );
}
