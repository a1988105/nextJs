import { create } from 'zustand'
import { fetchCoinPrice } from '@/services/price'

interface TradeState {
  selectedCoin: string
  currentPrice: number | null
  buyAmount: string
  sellCoinAmount: string
  isLoadingPrice: boolean
  priceError: string | null
  setSelectedCoin: (coin: string) => void
  setBuyAmount: (amount: string) => void
  setSellCoinAmount: (amount: string) => void
  fetchPrice: (coinId: string) => Promise<void>
}

export const useTradeStore = create<TradeState>((set) => ({
  selectedCoin: 'bitcoin',
  currentPrice: null,
  buyAmount: '',
  sellCoinAmount: '',
  isLoadingPrice: false,
  priceError: null,

  setSelectedCoin: (coin) => set({ selectedCoin: coin }),

  setBuyAmount: (amount) => set({ buyAmount: amount }),

  setSellCoinAmount: (amount) => set({ sellCoinAmount: amount }),

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
