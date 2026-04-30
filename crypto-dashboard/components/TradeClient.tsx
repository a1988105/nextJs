'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
import { useTradeStore } from '@/store/useTradeStore'
import { placeOrder } from '@/app/actions/trade'
import { placeSellOrder } from '@/app/actions/sell'
import type { Holding } from '@/lib/dashboard'

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', label: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', label: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', label: 'BNB', symbol: 'BNB' },
]

type TradeMode = 'buy' | 'sell'
type Notification = { type: 'success' | 'error'; message: string }

function CoinGrid({
  availableCoins,
  selectedCoin,
  holdings,
  onChange,
}: {
  availableCoins: typeof COINS
  selectedCoin: string
  holdings: Holding[]
  onChange: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {availableCoins.map((c) => {
        const holding = holdings.find((h) => h.coin === c.id)
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
              selectedCoin === c.id
                ? 'border-amber-400/50 bg-amber-400/10 text-[var(--text)]'
                : 'border-[var(--border)] bg-[var(--card-hover)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
            }`}
          >
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-bold">
              {c.symbol.slice(0, 2)}
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">{c.symbol}</p>
              {holding ? (
                <p className="num text-xs text-[var(--muted)] mt-0.5">{holding.amount.toFixed(4)}</p>
              ) : (
                <p className="text-xs text-[var(--muted)] mt-0.5">{c.label}</p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function PriceBox({ price, loading }: { price: number | null; loading: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-hover)] px-5 py-4">
      <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-1">
        當前幣價 (USD)
      </p>
      {loading ? (
        <div className="h-8 w-32 rounded-md bg-[var(--card)] animate-pulse" />
      ) : price !== null ? (
        <p className="num text-2xl font-bold text-amber-400">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">無法取得價格</p>
      )}
    </div>
  )
}

function BuyPanel({
  buyAmount,
  currentPrice,
  estimatedQty,
  coinSymbol,
  onChange,
}: {
  buyAmount: string
  currentPrice: number | null
  estimatedQty: number
  coinSymbol: string
  onChange: (v: string) => void
}) {
  return (
    <>
      <div>
        <label className="block text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-3">
          買入金額 (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] font-semibold">$</span>
          <input
            type="number"
            min="0"
            value={buyAmount}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] focus:border-amber-400/50 focus:outline-none rounded-xl pl-8 pr-4 py-3.5 text-[var(--text)] num text-lg placeholder-[var(--muted)] transition-colors duration-150"
          />
        </div>
      </div>
      <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-5 py-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-1">預計獲得數量</p>
        <p className="num text-2xl font-bold text-[var(--green)]">
          {estimatedQty > 0 ? `${estimatedQty.toFixed(8)} ${coinSymbol}` : `— ${coinSymbol}`}
        </p>
        {buyAmount && currentPrice && estimatedQty > 0 && (
          <p className="text-xs text-[var(--muted)] mt-1.5">
            ${Number(buyAmount).toLocaleString()} ÷ ${currentPrice.toLocaleString()} = {estimatedQty.toFixed(8)} {coinSymbol}
          </p>
        )}
      </div>
    </>
  )
}

function SellPanel({
  sellCoinAmount,
  currentPrice,
  holding,
  coinSymbol,
  onChange,
}: {
  sellCoinAmount: string
  currentPrice: number | null
  holding: Holding | undefined
  coinSymbol: string
  onChange: (v: string) => void
}) {
  const estimatedUsd = currentPrice !== null && Number(sellCoinAmount) > 0
    ? Number(sellCoinAmount) * currentPrice
    : 0

  if (!holding) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-hover)] px-5 py-8 text-center">
        <p className="text-[var(--muted)] text-sm">你沒有持有 {coinSymbol}</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-hover)] px-5 py-3.5 flex justify-between items-center">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium">持倉數量</p>
        <p className="num text-sm font-semibold text-[var(--text)]">
          {holding.amount.toFixed(8)} {coinSymbol}
        </p>
      </div>
      <div>
        <label className="block text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-3">
          賣出數量 ({coinSymbol})
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max={holding.amount}
            step="any"
            value={sellCoinAmount}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00000000"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] focus:border-amber-400/50 focus:outline-none rounded-xl px-4 py-3.5 text-[var(--text)] num text-lg placeholder-[var(--muted)] transition-colors duration-150"
          />
          <button
            type="button"
            onClick={() => onChange(String(holding.amount))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-0.5 rounded"
          >
            全部
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-red-400/15 bg-red-400/5 px-5 py-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-1">預計獲得 (USD)</p>
        <p className="num text-2xl font-bold text-[var(--red)]">
          {estimatedUsd > 0
            ? `$${estimatedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '—'}
        </p>
        {sellCoinAmount && currentPrice && estimatedUsd > 0 && (
          <p className="text-xs text-[var(--muted)] mt-1.5">
            {Number(sellCoinAmount).toFixed(8)} × ${currentPrice.toLocaleString()} = ${estimatedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </>
  )
}

function TradeNotification({ item }: { item: Notification | null }) {
  if (!item) return null
  return (
    <div
      className={`rounded-xl px-5 py-3.5 text-sm font-medium flex items-center gap-2 ${
        item.type === 'success'
          ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-400'
          : 'bg-red-400/10 border border-red-400/30 text-red-400'
      }`}
    >
      <span>{item.type === 'success' ? '✓' : '✕'}</span>
      {item.message}
    </div>
  )
}

export default function TradeClient({
  initialBalance,
  initialHoldings,
}: {
  initialBalance: number
  initialHoldings: Holding[]
}) {
  const router = useRouter()
  const [holdings, setHoldings] = useState(initialHoldings)
  const [tradeMode, setTradeMode] = useState<TradeMode>('buy')
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    selectedCoin, currentPrice, buyAmount, sellCoinAmount, isLoadingPrice,
    setSelectedCoin, setBuyAmount, setSellCoinAmount, fetchPrice,
  } = useTradeStore(useShallow((s) => ({
    selectedCoin: s.selectedCoin,
    currentPrice: s.currentPrice,
    buyAmount: s.buyAmount,
    sellCoinAmount: s.sellCoinAmount,
    isLoadingPrice: s.isLoadingPrice,
    setSelectedCoin: s.setSelectedCoin,
    setBuyAmount: s.setBuyAmount,
    setSellCoinAmount: s.setSellCoinAmount,
    fetchPrice: s.fetchPrice,
  })))

  const coin = COINS.find((c) => c.id === selectedCoin)
  const holding = holdings.find((h) => h.coin === selectedCoin)
  const sellableCoins = COINS.filter((c) => holdings.some((h) => h.coin === c.id && h.amount > 1e-9))

  const estimatedQty = currentPrice !== null && Number(buyAmount) > 0
    ? Number(buyAmount) / currentPrice : 0

  // Sync server-refreshed holdings into local state (after router.refresh())
  useEffect(() => setHoldings(initialHoldings), [initialHoldings])

  useEffect(() => { fetchPrice(selectedCoin) }, [selectedCoin, fetchPrice])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(t)
  }, [notification])

  // Switch to a held coin when entering sell mode
  useEffect(() => {
    if (tradeMode !== 'sell') return
    const held = holdings.find((h) => h.coin === selectedCoin && h.amount > 1e-9)
    if (!held && holdings[0]) setSelectedCoin(holdings[0].coin)
  }, [tradeMode, holdings, selectedCoin, setSelectedCoin])

  const handleBuy = useCallback(async () => {
    if (!buyAmount || !currentPrice || Number(buyAmount) <= 0) return
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('coin', selectedCoin)
      fd.append('amount', buyAmount)
      const result = await placeOrder(fd)
      setNotification({ type: result.success ? 'success' : 'error', message: result.message })
      if (result.success) { setBuyAmount(''); router.refresh() }
    } catch {
      setNotification({ type: 'error', message: '下單失敗，請稍後再試' })
    } finally {
      setIsSubmitting(false)
    }
  }, [buyAmount, currentPrice, selectedCoin, setBuyAmount, router])

  const handleSell = useCallback(async () => {
    if (!sellCoinAmount || !currentPrice || Number(sellCoinAmount) <= 0) return
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('coin', selectedCoin)
      fd.append('coinAmount', sellCoinAmount)
      const result = await placeSellOrder(fd)
      setNotification({ type: result.success ? 'success' : 'error', message: result.message })
      if (result.success) { setSellCoinAmount(''); router.refresh() }
    } catch {
      setNotification({ type: 'error', message: '賣出失敗，請稍後再試' })
    } finally {
      setIsSubmitting(false)
    }
  }, [sellCoinAmount, currentPrice, selectedCoin, setSellCoinAmount, router])

  const isBuy = tradeMode === 'buy'
  const canSubmit = isBuy
    ? Boolean(buyAmount) && currentPrice !== null && Number(buyAmount) > 0
    : Boolean(sellCoinAmount) && currentPrice !== null && Number(sellCoinAmount) > 0 && Boolean(holding)

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-1">即時下單</p>
          <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">Trade</h1>
          <p className="text-sm text-[var(--muted)] mt-2">餘額：
            <span className="num text-amber-400 font-semibold">
              ${initialBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <Link
          href="/trade/history"
          className="text-xs text-[var(--muted)] hover:text-amber-400 transition-colors border border-[var(--border)] hover:border-amber-400/30 px-3 py-1.5 rounded-lg"
        >
          交易記錄 →
        </Link>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        {(['buy', 'sell'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTradeMode(mode)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              tradeMode === mode
                ? mode === 'buy'
                  ? 'bg-amber-400 text-black'
                  : 'bg-red-400/20 text-red-400 border border-red-400/30'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {mode === 'buy' ? '買入' : '賣出'}
          </button>
        ))}
      </div>

      <div className="themed-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-6">
        <div>
          <label className="block text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-3">
            選擇幣種
          </label>
          <CoinGrid
            availableCoins={isBuy ? COINS : sellableCoins.length > 0 ? sellableCoins : COINS}
            selectedCoin={selectedCoin}
            holdings={holdings}
            onChange={setSelectedCoin}
          />
        </div>

        <PriceBox price={currentPrice} loading={isLoadingPrice} />

        {isBuy ? (
          <BuyPanel
            buyAmount={buyAmount}
            currentPrice={currentPrice}
            estimatedQty={estimatedQty}
            coinSymbol={coin?.symbol ?? ''}
            onChange={setBuyAmount}
          />
        ) : (
          <SellPanel
            sellCoinAmount={sellCoinAmount}
            currentPrice={currentPrice}
            holding={holding}
            coinSymbol={coin?.symbol ?? ''}
            onChange={setSellCoinAmount}
          />
        )}

        <TradeNotification item={notification} />

        <button
          onClick={isBuy ? handleBuy : handleSell}
          disabled={isSubmitting || !canSubmit}
          className={`w-full py-3.5 rounded-xl font-bold text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 ${
            isBuy ? 'bg-amber-400 hover:bg-amber-300' : 'bg-red-400 hover:bg-red-300'
          }`}
        >
          {isSubmitting && (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          )}
          {isSubmitting ? '處理中...' : isBuy ? '確認買入' : '確認賣出'}
        </button>
      </div>

      <div className="mt-6 themed-card rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium mb-2">架構說明</p>
        <ul className="text-xs text-[var(--muted)] space-y-1 list-disc list-inside">
          <li>Server Component SSR fetch 持倉 → <code className="text-amber-400/70">props</code> 傳入此元件</li>
          <li>下單後呼叫 <code className="text-amber-400/70">router.refresh()</code> 觸發 Server Component 重新 fetch</li>
          <li>幣價透過 <code className="text-amber-400/70">/api/price/[coinId]</code> 取得，30 秒快取</li>
          <li>買入透過 <code className="text-amber-400/70">placeOrder</code>，賣出透過 <code className="text-amber-400/70">placeSellOrder</code> Server Action</li>
        </ul>
      </div>
    </div>
  )
}
