import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTrades } from '@/services/user'
import type { TradeRecord } from '@/services/user'

export const metadata: Metadata = {
  title: 'Trade History | Crypto Dashboard',
  description: 'Your complete cryptocurrency trading history.',
}

function TradeSide({ record }: { record: TradeRecord }) {
  const isBuy = record.qty > 0
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
        isBuy ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
      }`}
    >
      {isBuy ? '買入' : '賣出'}
    </span>
  )
}

function TradeRow({ record }: { record: TradeRecord }) {
  const absQty = Math.abs(record.qty)
  const absUsd = Math.abs(record.usdAmount)
  const dateStr = record.createdAt.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors duration-100">
      <td className="px-5 py-4">
        <TradeSide record={record} />
      </td>
      <td className="px-5 py-4 font-semibold text-[var(--text)] capitalize">{record.coin}</td>
      <td className="px-5 py-4 num text-right text-[var(--text)]">
        {absQty.toFixed(6)}
      </td>
      <td className="px-5 py-4 num text-right text-[var(--muted)]">
        ${record.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-5 py-4 num text-right font-medium text-[var(--text)]">
        ${absUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-5 py-4 num text-right text-[var(--muted)] text-xs hidden md:table-cell">
        {dateStr}
      </td>
    </tr>
  )
}

export default async function TradeHistoryPage() {
  const session = await getSession()
  const userId = Number(session?.user?.id)
  if (!session || !Number.isInteger(userId)) redirect('/login')

  const trades = await getUserTrades(userId)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">Trade History</h1>
            <span className="num text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
              SSR + Auth
            </span>
          </div>
          <p className="text-sm text-[var(--muted)]">最近 50 筆交易記錄（最新在前）</p>
        </div>
        <Link
          href="/trade"
          className="text-xs text-[var(--muted)] hover:text-amber-400 transition-colors border border-[var(--border)] hover:border-amber-400/30 px-3 py-1.5 rounded-lg"
        >
          ← 返回交易
        </Link>
      </div>

      {trades.length === 0 ? (
        <div className="themed-card flex flex-col items-center justify-center py-24 text-center rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <p className="text-2xl mb-3">📭</p>
          <p className="text-[var(--muted)] text-sm">尚無交易記錄</p>
          <Link href="/trade" className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors">
            前往交易 →
          </Link>
        </div>
      ) : (
        <div className="themed-card rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">方向</th>
                <th className="text-left px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">幣種</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">數量</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">成交價</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider">金額 (USD)</th>
                <th className="text-right px-5 py-3.5 text-[var(--muted)] font-medium text-xs uppercase tracking-wider hidden md:table-cell">時間</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((record) => (
                <TradeRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="num text-xs text-[var(--muted)] mt-5">⚡ SSR — 每次請求從資料庫即時讀取</p>
    </div>
  )
}
