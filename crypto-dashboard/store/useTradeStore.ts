import { create } from 'zustand'
import axios from 'axios'

interface TradeState {
  selectedCoin: string
  currentPrice: number | null
  buyAmount: string
  estimatedQty: number
  isLoadingPrice: boolean
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

  setSelectedCoin: (coin) => set({ selectedCoin: coin }),

  setBuyAmount: (amount) => {
    const price = get().currentPrice
    const qty = price && Number(amount) > 0 ? Number(amount) / price : 0
    set({ buyAmount: amount, estimatedQty: qty })
  },

  fetchPrice: async (coinId) => {
    set({ isLoadingPrice: true })
    try {
      const { data } = await axios.get<{ price: number | null }>(`/api/price/${coinId}`)
      set({ currentPrice: data.price, isLoadingPrice: false })
      const amount = get().buyAmount
      const qty = data.price && Number(amount) > 0 ? Number(amount) / data.price : 0
      set({ estimatedQty: qty })
    } catch {
      set({ isLoadingPrice: false })
    }
  },
}))
