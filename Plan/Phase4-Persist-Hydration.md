# Phase 4：持久化與 Hydration 魔王關

## 目標
解決 SSR 專案中最常見的「刷新頁面後狀態遺失」與「水合錯誤（Hydration Mismatch）」問題

---

## 4.1 狀態持久化 (Persist Middleware)

### 目標
主題設定（深色/淺色）在刷新頁面後不應該消失

### 套用 persist 到 useUIStore
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',        // localStorage key 名稱
      partialize: (state) => ({ theme: state.theme }),  // 只持久化 theme，不存 sidebar 狀態
    }
  )
)
```

### 學習重點
- `partialize`：選擇性持久化部分狀態，避免把不必要的資料存進 localStorage
- `name`：localStorage 的 key，同個 App 中要唯一

---

## 4.2 解決 Hydration Mismatch

### 問題說明
```
Server 渲染：theme = 'light'（預設值）
瀏覽器讀取 localStorage：theme = 'dark'（用戶之前設定的）
→ React 比對不一致 → Hydration Error
```

### 解法：useHasHydrated Hook

```ts
// hooks/useHasHydrated.ts
import { useState, useEffect } from 'react'

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
```

### 使用方式
```tsx
'use client'
import { useHasHydrated } from '@/hooks/useHasHydrated'
import { useUIStore } from '@/store/useUIStore'

export default function ThemeToggle() {
  const hasHydrated = useHasHydrated()
  const theme = useUIStore((state) => state.theme)

  // 尚未 hydrate 前顯示預設值，避免閃爍
  if (!hasHydrated) return <div>...</div>

  return <button>{theme === 'dark' ? '切換淺色' : '切換深色'}</button>
}
```

### 學習重點
- `useEffect` 只在 Client 端執行，所以 `hasHydrated` 從 `false` 變 `true` 代表已在瀏覽器中
- 確保元件掛載後才讀取 localStorage 的值，避免與 Server 渲染結果不一致

---

## 4.3 跨元件狀態同步

### 情境
- `Navbar`（Client Component）要顯示用戶名
- `DashboardPage`（Server Component）是資料來源

### 架構
```
DashboardPage (Server)
    ↓ session.user.name via props
Navbar (Client)
    ↓ 直接用 props 顯示（不需要 Zustand）
```

### 何時需要 Zustand，何時用 props？
| 情境 | 建議 |
|------|------|
| 資料只在父→子單向流動 | 直接用 props |
| 多個不相關的元件都需要這份資料 | 放進 Zustand Store |
| 資料需要在 Client 端被修改 | 放進 Zustand Store |

---

## 完成條件
- [ ] 刷新頁面後主題設定不消失（persist 正常運作）
- [ ] 切換深色主題後刷新，不出現 Hydration Error
- [ ] `useHasHydrated` Hook 建立並套用於 ThemeToggle 元件
- [ ] Navbar 正確顯示登入用戶名
