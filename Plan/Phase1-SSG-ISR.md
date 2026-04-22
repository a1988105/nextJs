# Phase 1：基礎建設 + SSG + ISR

## 目標
掌握 App Router 結構、SEO 最強的靜態渲染（SSG）與增量靜態再生（ISR）

---

## 技術棧
| 項目 | 選擇 |
|------|------|
| Framework | Next.js 15 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| Linting | ESLint |
| 資料來源 | CoinGecko Public API（免費、無需 API Key） |

---

## 1.1 專案初始化

### 建立專案
```bash
npx create-next-app@latest crypto-dashboard
# 選擇：TypeScript ✓, Tailwind CSS ✓, App Router ✓, ESLint ✓
```

### 安裝所有依賴（一次裝完）
```bash
npm install zustand axios next-auth@beta prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs
```

### App Router 核心檔案
建立以下檔案作為 App Router 基礎：

```
app/
├── layout.tsx        # 全域佈局（含 Navbar、Session Provider）
├── page.tsx          # 首頁
├── loading.tsx       # 全域 Suspense 載入狀態
├── error.tsx         # 全域錯誤邊界（'use client'）
├── not-found.tsx     # 404 頁面
```

### Next.js 15 注意事項
- `params` 和 `searchParams` 變成 **async**，需要 `await`
  ```ts
  // ❌ Next.js 14 寫法
  export default function Page({ params }: { params: { id: string } }) {}

  // ✅ Next.js 15 寫法
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  }
  ```
- `fetch()` 預設 `no-store`，SSG 需明確加 `{ cache: 'force-cache' }`

---

## 1.2 SSG 頁面：幣種百科 `/coins/[id]`

### 檔案路徑
```
app/coins/[id]/page.tsx
```

### CoinGecko API
- 端點：`GET https://api.coingecko.com/api/v3/coins/{id}`
- 免費版限制：每分鐘 10-30 次請求
- 常用幣種 id：`bitcoin`, `ethereum`, `solana`

### 核心實作重點

**generateStaticParams** — 預先產生靜態頁面
```ts
export async function generateStaticParams() {
  return [
    { id: 'bitcoin' },
    { id: 'ethereum' },
    { id: 'solana' },
  ]
}
```

**fetch with force-cache** — SSG 快取
```ts
const res = await fetch(
  `https://api.coingecko.com/api/v3/coins/${id}`,
  { cache: 'force-cache' }  // Next.js 15 必須明確指定
)
```

**generateMetadata** — 動態 SEO meta
```ts
export async function generateMetadata({ params }: Props) {
  const { id } = await params
  // fetch 幣種資料後回傳 title/description
  return {
    title: `${coin.name} (${coin.symbol.toUpperCase()}) | Crypto Dashboard`,
    description: coin.description.en.slice(0, 160),
  }
}
```

### 學習重點
- 靜態渲染如何提升首屏速度與 SEO
- `generateStaticParams` 只在 build time 執行
- `generateMetadata` 與頁面共用同一次 fetch（Next.js 自動去重）

---

## 1.3 ISR 頁面：市場新聞 `/market/news`

### 檔案路徑
```
app/market/news/page.tsx
```

### CoinGecko API
- 端點：`GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10`

### 核心實作重點

**fetch with revalidate** — ISR 每 60 秒背景重新產生
```ts
const res = await fetch(url, {
  next: { revalidate: 60 }
})
```

### 學習重點
- 渲染模式完整路徑：`SSG (force-cache) → ISR (revalidate) → SSR (no-store)`
- ISR 不會讓用戶等待重新產生，背景靜默更新

---

## 完成條件
- [ ] `npx create-next-app` 完成，可執行 `npm run dev`
- [ ] `app/layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` 建立完成
- [ ] `/coins/bitcoin` 頁面可正常顯示幣種資料
- [ ] `/coins/ethereum` 頁面靜態預渲染
- [ ] `generateMetadata` 正確輸出 SEO title/description
- [ ] `/market/news` 頁面設定 `revalidate: 60`
