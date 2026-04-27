import { create } from 'zustand'
import { fetchCoinPrice } from '@/services/price'

interface TradeState {
  selectedCoin: string
  currentPrice: number | null
  buyAmount: string
  estimatedQty: number
  isLoadingPrice: boolean
  priceError: string | null
  setSelectedCoin: (coin: string) => void
  setBuyAmount: (amount: string) => void
  fetchPrice: (coinId: string) => Promise<void>
}

export const useTradeStore = create<TradeState>((set, get) => ({
  selectedCoin: 'bitcoin',
  currentPrice: null,
  buyAmount: '',
  estimatedQty: 0,
  isLoadingPrice: false,
  priceError: null,

  setSelectedCoin: (coin) => set({ selectedCoin: coin }),

  setBuyAmount: (amount) => {
    const price = get().currentPrice
    const qty = price && Number(amount) > 0 ? Number(amount) / price : 0
    set({ buyAmount: amount, estimatedQty: qty })
  },

  fetchPrice: async (coinId) => {
    set({ isLoadingPrice: true, priceError: null })
    const { price } = await fetchCoinPrice(coinId)
    if (price === null) {
      set({ isLoadingPrice: false, priceError: 'Failed to fetch price' })
      return
    }
    const amount = get().buyAmount
    const qty = Number(amount) > 0 ? Number(amount) / price : 0
    set({ currentPrice: price, estimatedQty: qty, isLoadingPrice: false })
  },
}))
