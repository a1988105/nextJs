'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { useHasHydrated } from '@/hooks/useHasHydrated'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle() {
  const hasHydrated = useHasHydrated()
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  // Apply persisted theme to document after localStorage is read
  useEffect(() => {
    if (hasHydrated) {
      document.documentElement.dataset.theme = theme
    }
  }, [hasHydrated, theme])

  // Prevent hydration mismatch: render placeholder until localStorage is read
  if (!hasHydrated) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card-hover)] transition-all duration-150"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
