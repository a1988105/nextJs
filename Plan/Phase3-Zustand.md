# Phase 3：Zustand 實戰 — Small Stores 模組化

## 目標
拒絕巨型 Store，學習生產環境中的「職責分離」架構，並實作 CSR 下單介面

---

## 3.1 Store 拆分架構

### 資料夾結構
```
store/
├── useAuthStore.ts    # UI 層用戶偏好
├── useUIStore.ts      # 介面狀態
└── useTradeStore.ts   # 下單狀態 + 幣價
```

### 職責說明

| Store | 管理的狀態 | 不管的事 |
|-------|-----------|---------|
| useAuthStore | 語言偏好、通知設定 | session / JWT（由 NextAuth 管） |
| useUIStore | 側邊欄開關、彈窗、主題（深/淺色） | 任何伺服器資料 |
| useTradeStore | 買賣輸入值、當前幣價、計算結果 | 下單送出（由 Server Action 處理） |

### useAuthStore.ts
```ts
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
```

### useUIStore.ts
```ts
import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (theme) => set({ theme }),
}))
```

### useTradeStore.ts
```ts
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
    const qty = price ? Number(amount) / price : 0
    set({ buyAmount: amount, estimatedQty: qty })
  },

  fetchPrice: async (coinId) => {
    set({ isLoadingPrice: true })
    const { data } = await axios.get(`/api/price/${coinId}`)
    set({ currentPrice: data.price, isLoadingPrice: false })
    // 重新計算預計數量
    const amount = get().buyAmount
    const qty = data.price ? Number(amount) / data.price : 0
    set({ estimatedQty: qty })
  },
}))
```

---

## 3.2 Server → Client 資料橋接

### 重要觀念
- **Server Component 不能呼叫 `useStore()`**（Hook 只能在 Client Component 用）
- Server 資料要傳給 Client，只能透過 **props**

### 正確架構
```
Server Component (async)
    ↓ fetch 資料
    ↓ 傳入 props
Client Component ('use client')
    ↓ 接收 props
    ↓ 呼叫 Zustand action 寫入 Store
```

### 範例
```tsx
// app/dashboard/page.tsx（Server Component）
export default async function DashboardPage() {
  const session = await auth()
  const res = await fetch('/api/user/balance', { cache: 'no-store' })
  const { balance } = await res.json()

  return <DashboardClient initialBalance={balance} username={session.user.name} />
}

// components/DashboardClient.tsx（Client Component）
'use client'
export default function DashboardClient({ initialBalance, username }) {
  // 可以在這裡用 useEffect 初始化 Store
  // 但如果只是顯示，直接用 props 就好，不一定要放進 Store
}
```

---

## 3.3 CSR 頁面：即時下單介面 `/trade`

### 檔案路徑
```
app/trade/page.tsx   # 'use client'
```

### 計算機邏輯
1. 用戶選擇幣種 → `fetchPrice(coinId)` 用 axios 呼叫 `/api/price/:id`
2. 用戶輸入買入金額（USD）→ `setBuyAmount(amount)`
3. Store 自動計算：`estimatedQty = buyAmount / currentPrice`
4. 畫面即時顯示預計獲得數量

### API Route：幣價查詢
```
app/api/price/[coinId]/route.ts
```
```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
    { next: { revalidate: 30 } }  // 30 秒快取，避免 rate limit
  )
  const data = await res.json()
  return Response.json({ price: data[coinId]?.usd ?? null })
}
```

---

## 完成條件
- [x] 三個 Store 建立完成，TypeScript 型別正確
- [x] `useTradeStore.fetchPrice` 可透過 axios 取得幣價
- [x] `/trade` 頁面輸入金額後自動計算預計數量
- [x] Server → Client 橋接架構理解並實作
- [x] `/api/price/[coinId]` Route 正常回傳幣價
