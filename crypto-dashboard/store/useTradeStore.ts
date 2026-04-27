import { create } from 'zustand'
import { fetchCoinPrice } from '@/services/price'

interface TradeState {
  selectedCoin: string
  currentPrice: number | null
  buyAmount: string
  isLoadingPrice: boolean
  priceError: string | null
  setSelectedCoin: (coin: string) => void
  setBuyAmount: (amount: string) => void
  fetchPrice: (coinId: string) => Promise<void>
}

export const useTradeStore = create<TradeState>((set) => ({
  selectedCoin: 'bitcoin',
  currentPrice: null,
  buyAmount: '',
  isLoadingPrice: false,
  priceError: null,

  setSelectedCoin: (coin) => set({ selectedCoin: coin }),

  setBuyAmount: (amount) => set({ buyAmount: amount }),

  fetchPrice: async (coinId) => {
    set({ isLoadingPrice: true, priceError: null })
    const { price } = await fetchCoinPrice(coinId)
    if (price === null) {
      set({ isLoadingPrice: false, priceError: 'Failed to fetch price' })
      return
    }
    set({ currentPrice: price, isLoadingPrice: false })
  },
}))
