import {
    create
} from 'zustand'
import {
    persist
} from 'zustand/middleware'

interface UIState {
    isSidebarOpen: boolean
    theme: 'light' | 'dark'
    toggleSidebar: () => void
    setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create < UIState > ()(
    persist(
        (set) => ({
            isSidebarOpen: true,
            theme: 'dark',
            toggleSidebar: () => set((state) => ({
                isSidebarOpen: !state.isSidebarOpen
            })),
            setTheme: (theme) => set({
                theme
            }),
        }), 
        // Persist only the theme to localStorage 指定屬性持久化到 localStorage
        {
            name: 'ui-store',
            partialize: (state) => ({
                theme: state.theme,
            }),
        }
    )
)