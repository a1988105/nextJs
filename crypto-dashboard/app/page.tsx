import Link from 'next/link';
import { PageReveal } from '@/components/PageReveal';

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
      <PageReveal delay={1} className="mb-20">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
            Next.js 15 Learning Project
          </span>
        </div>

        <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black tracking-tight leading-none mb-6">
          <span className="gradient-text">Crypto</span>
          <br />
          <span className="text-[var(--text)]">Dashboard</span>
        </h1>

        <p className="text-[var(--muted)] text-lg max-w-lg leading-relaxed">
          Exploring SSG, ISR, and SSR rendering strategies with real crypto data,
          authentication, and server actions.
        </p>
      </PageReveal>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {features.map((f, i) => (
          <PageReveal key={f.href} delay={(i + 2) as 2 | 3 | 4}>
            <Link
              href={f.href}
              className="group themed-card block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 hover:bg-[var(--card-hover)] hover:border-[var(--border-strong)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-mono font-medium px-2 py-0.5 rounded-md"
                  style={{ color: f.color, background: `${f.color}18` }}
                >
                  {f.tag}
                </span>
                <span className="text-[var(--muted)] group-hover:text-[var(--text)] group-hover:translate-x-0.5 transition-all duration-150">
                  →
                </span>
              </div>
              <h2 className="font-bold text-[var(--text)] text-lg mb-2">{f.label}</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </Link>
          </PageReveal>
        ))}
      </div>

      {/* Coin quick-links */}
      <PageReveal delay={5} className="flex items-center gap-3">
        <span className="text-xs text-[var(--muted)]">Pre-rendered coins:</span>
        {['bitcoin', 'ethereum', 'solana'].map((id) => (
          <Link
            key={id}
            href={`/coins/${id}`}
            className="text-xs text-[var(--muted)] hover:text-amber-400 capitalize transition-colors duration-150 border border-[var(--border)] hover:border-amber-400/30 px-2.5 py-1 rounded-md"
          >
            {id}
          </Link>
        ))}
      </PageReveal>
    </div>
  );
}
