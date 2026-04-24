import { create } from 'zustand'

interface AuthState {
  language: 'zh' | 'en'
  notificationsEnabled: boolean
  setLanguage: (lang: 'zh' | 'en') => void
  toggleNotifications: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  language: 'zh',
  notificationsEnabled: true,
  setLanguage: (lang) => set({ language: lang }),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
}))
