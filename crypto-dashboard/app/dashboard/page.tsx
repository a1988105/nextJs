import { signOut } from '@/auth'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { PageReveal } from '@/components/PageReveal'
import { COIN_SYMBOLS, getPortfolioTotal, getUserBalance } from '@/lib/dashboard'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const data = getUserBalance()
  const totalValue = getPortfolioTotal(data)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <PageReveal delay={1} className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-1">
            個人儀表板
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight">
            嗨，{session.user?.name}
          </h1>
        </div>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-white border border-white/[0.08] hover:border-white/[0.2] px-4 py-2 rounded-lg transition-all duration-150"
          >
            登出
          </button>
        </form>
      </PageReveal>

      {/* Balance card */}
      <PageReveal
        delay={2}
        className="rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/8 via-amber-400/4 to-transparent p-8 mb-5"
      >
        <p className="text-xs text-amber-400/60 uppercase tracking-widest font-medium mb-3">
          帳戶餘額 (USD)
        </p>
        <p className="num text-5xl font-bold text-white tracking-tight leading-none">
          ${data.balance.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="num text-xs text-gray-500">
            含持倉總值&nbsp;&nbsp;${totalValue.toLocaleString()}
          </p>
        </div>
      </PageReveal>

      {/* Holdings */}
      <PageReveal
        delay={3}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
      >
        <h2 className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-5">
          持倉
        </h2>
        <div className="flex flex-col gap-3">
          {data.holdings.map((h) => {
            const pct = ((h.value / totalValue) * 100).toFixed(1)
            return (
              <div
                key={h.coin}
                className="flex justify-between items-center rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] px-5 py-4 transition-all duration-150"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-amber-400 font-bold text-xl select-none">
                    {COIN_SYMBOLS[h.coin] ?? h.coin[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white capitalize">{h.coin}</p>
                    <p className="num text-xs text-gray-500 mt-0.5">{h.amount} 枚</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="num text-emerald-400 font-semibold">
                    ${h.value.toLocaleString()}
                  </p>
                  <p className="num text-xs text-gray-600 mt-0.5">{pct}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </PageReveal>
    </div>
  )
}
