'use client'

import { useEffect, useState } from 'react'
import { useUIStore } from '@/store/useUIStore'

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const unsub = useUIStore.persist.onFinishHydration(() => setHasHydrated(true))

    // Store may already be hydrated before this effect runs
    if (useUIStore.persist.hasHydrated()) setHasHydrated(true)

    return unsub
  }, [])

  return hasHydrated
}
