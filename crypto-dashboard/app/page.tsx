import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
      <p className="text-gray-500 mb-10">Next.js 15 learning project — SSG, ISR, SSR, Zustand</p>

      <div className="grid gap-4">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-1">Market Overview</h2>
          <p className="text-sm text-gray-500 mb-3">
            Top 10 coins by market cap · ISR (revalidate: 60s)
          </p>
          <Link href="/market/news" className="text-sm text-blue-600 hover:underline">
            View market →
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-1">Coin Detail Pages</h2>
          <p className="text-sm text-gray-500 mb-3">
            Static pages pre-rendered at build time · SSG (force-cache)
          </p>
          <div className="flex gap-3">
            {['bitcoin', 'ethereum', 'solana'].map((id) => (
              <Link key={id} href={`/coins/${id}`} className="text-sm text-blue-600 hover:underline capitalize">
                {id} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
