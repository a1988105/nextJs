'use client'

import { useEffect } from 'react'
import { useTradeStore } from '@/store/useTradeStore'

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', label: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', label: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', label: 'BNB', symbol: 'BNB' },
]

export default function TradePage() {
  const {
    selectedCoin,
    currentPrice,
    buyAmount,
    estimatedQty,
    isLoadingPrice,
    setSelectedCoin,
    setBuyAmount,
    fetchPrice,
  } = useTradeStore()

  useEffect(() => {
    fetchPrice(selectedCoin)
  }, [selectedCoin, fetchPrice])

  const handleCoinChange = (coinId: string) => {
    setSelectedCoin(coinId)
  }

  const coin = COINS.find((c) => c.id === selectedCoin)

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-1">
          即時下單
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Trade
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          輸入金額，即時計算預計獲得數量
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col gap-6">
        {/* Coin Selector */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-widest font-medium mb-3">
            選擇幣種
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COINS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCoinChange(c.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                  selectedCoin === c.id
                    ? 'border-amber-400/50 bg-amber-400/10 text-white'
                    : 'border-white/[0.07] bg-white/[0.02] text-gray-400 hover:border-white/[0.15] hover:text-white'
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {c.symbol.slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none">{c.symbol}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{c.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-1">
            當前幣價 (USD)
          </p>
          {isLoadingPrice ? (
            <div className="h-8 w-32 rounded-md bg-white/[0.06] animate-pulse" />
          ) : currentPrice !== null ? (
            <p className="num text-2xl font-bold text-amber-400">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ) : (
            <p className="text-sm text-gray-600">無法取得價格</p>
          )}
        </div>

        {/* Buy Amount Input */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-widest font-medium mb-3">
            買入金額 (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              min="0"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-amber-400/50 focus:outline-none rounded-xl pl-8 pr-4 py-3.5 text-white num text-lg placeholder-gray-700 transition-colors duration-150"
            />
          </div>
        </div>

        {/* Estimated Quantity */}
        <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
            預計獲得數量
          </p>
          <p className="num text-2xl font-bold text-emerald-400">
            {estimatedQty > 0
              ? `${estimatedQty.toFixed(8)} ${coin?.symbol ?? ''}`
              : `— ${coin?.symbol ?? ''}`}
          </p>
          {buyAmount && currentPrice && estimatedQty > 0 && (
            <p className="text-xs text-gray-600 mt-1.5">
              ${Number(buyAmount).toLocaleString()} ÷ ${currentPrice.toLocaleString()} = {estimatedQty.toFixed(8)} {coin?.symbol}
            </p>
          )}
        </div>

        {/* Submit button (UI only — Server Action would handle real submission) */}
        <button
          disabled={!buyAmount || !currentPrice || Number(buyAmount) <= 0}
          className="w-full py-3.5 rounded-xl font-bold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          確認買入
        </button>
      </div>

      {/* Architecture note for learning */}
      <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.01] px-5 py-4">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-2">架構說明</p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>此頁面為純 CSR（Client Component）</li>
          <li>幣價透過 <code className="text-amber-400/70">/api/price/[coinId]</code> 取得，30 秒快取</li>
          <li>狀態由 <code className="text-amber-400/70">useTradeStore</code> 管理</li>
          <li>下單送出應交由 Server Action 處理</li>
        </ul>
      </div>
    </div>
  )
}
