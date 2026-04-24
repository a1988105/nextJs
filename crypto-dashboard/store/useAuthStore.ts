import { create } from 'zustand'
import type { Holding } from '@/lib/dashboard'

interface AuthState {
  language: 'zh' | 'en'
  notificationsEnabled: boolean
  // 從 Server Component 橋接過來的儀表板資料
  balance: number | null
  holdings: Holding[]
  setLanguage: (lang: 'zh' | 'en') => void
  toggleNotifications: () => void
  setDashboardData: (balance: number, holdings: Holding[]) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  language: 'zh',
  notificationsEnabled: true,
  balance: null,
  holdings: [],
  setLanguage: (lang) => set({ language: lang }),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  setDashboardData: (balance, holdings) => set({ balance, holdings }),
}))
