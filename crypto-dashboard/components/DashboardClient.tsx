'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { COIN_SYMBOLS, getPortfolioTotal } from '@/lib/dashboard'
import type { UserBalance } from '@/lib/dashboard'

type Props = {
  username: string
  initialData: UserBalance
}

export default function DashboardClient({ username, initialData }: Props) {
  const { balance, holdings, setDashboardData } = useAuthStore()

  // 橋接：Server 傳來的初始資料 → 寫入 Store
  useEffect(() => {
    setDashboardData(initialData.balance, initialData.holdings)
  }, [initialData, setDashboardData])

  // Store 還沒初始化時，fallback 到 props
  const displayBalance = balance ?? initialData.balance
  const displayHoldings = holdings.length > 0 ? holdings : initialData.holdings
  const totalValue = getPortfolioTotal({ balance: displayBalance, holdings: displayHoldings })

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="fade-up delay-1 flex items-start justify-between mb-10">
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-1">
            個人儀表板
          </p>
          <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">
            嗨，{username}
          </h1>
        </div>

        {/* Store 狀態展示區（學習用） */}
        <div className="text-right">
          <p className="text-xs text-[var(--muted)] mb-1">Store 狀態</p>
          <p className="text-xs text-amber-400/70 font-mono">
            balance: {balance === null ? 'null（未初始化）' : `$${balance.toLocaleString()}`}
          </p>
          <p className="text-xs text-[var(--muted)] font-mono">
            holdings: {holdings.length} 筆
          </p>
        </div>
      </div>

      {/* Balance card */}
      <div className="fade-up delay-2 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/8 via-amber-400/4 to-transparent p-8 mb-5">
        <p className="text-xs text-amber-400/60 uppercase tracking-widest font-medium mb-3">
          帳戶餘額 (USD)
        </p>
        <p className="num text-5xl font-bold text-[var(--text)] tracking-tight leading-none">
          ${displayBalance.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="num text-xs text-[var(--muted)]">
            含持倉總值&nbsp;&nbsp;${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Holdings */}
      <div className="fade-up delay-3 themed-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-5">
          持倉
        </h2>
        <div className="flex flex-col gap-3">
          {displayHoldings.map((h) => {
            const pct = ((h.value / totalValue) * 100).toFixed(1)
            return (
              <div
                key={h.coin}
                className="flex justify-between items-center rounded-xl border border-[var(--border)] bg-[var(--card-hover)] hover:bg-[var(--card)] hover:border-[var(--border-strong)] px-5 py-4 transition-all duration-150"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-amber-400 font-bold text-xl select-none">
                    {COIN_SYMBOLS[h.coin] ?? h.coin[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text)] capitalize">{h.coin}</p>
                    <p className="num text-xs text-[var(--muted)] mt-0.5">{h.amount} 枚</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="num text-[var(--green)] font-semibold">
                    ${h.value.toLocaleString()}
                  </p>
                  <p className="num text-xs text-[var(--muted)] mt-0.5">{pct}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Architecture note */}
      <div className="fade-up delay-4 mt-6 themed-card rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-2">架構說明</p>
        <ul className="text-xs text-[var(--muted)] space-y-1 list-disc list-inside">
          <li>Server Component fetch 資料 → 透過 <code className="text-amber-400/70">props</code> 傳入此元件</li>
          <li><code className="text-amber-400/70">useEffect</code> 在 mount 後呼叫 <code className="text-amber-400/70">setDashboardData</code> 寫入 Store</li>
          <li>右上角「Store 狀態」可觀察從 null → 有值的過程</li>
        </ul>
      </div>
    </div>
  )
}
