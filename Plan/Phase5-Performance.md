# Phase 5：效能優化與生產部署

## 目標
確保 App 在高頻動態更新下依然流暢，並完成生產部署準備

---

## 5.1 精準 Selector 優化

### 問題說明
```ts
// ❌ 錯誤：解構整個 Store，任何狀態變化都會觸發重新渲染
const { user, token, isLoggedIn } = useAuthStore()

// ✅ 正確：只訂閱需要的狀態
const user = useAuthStore((state) => state.user)
```

### 範例：避免不必要的重新渲染
```tsx
// NavbarUsername.tsx — 只依賴 language，不因 notificationsEnabled 改變而重渲
const language = useAuthStore((state) => state.language)

// ThemeIcon.tsx — 只依賴 theme
const theme = useUIStore((state) => state.theme)
```

### 學習重點
- Zustand 的 selector 是最簡單的效能優化手段
- 每個元件只訂閱自己需要的最小狀態
- 可用 `React DevTools` 的 Profiler 確認渲染次數

---

## 5.2 Bundle 分析

### 安裝分析工具
```bash
npm install -D @next/bundle-analyzer
```

### next.config.ts 設定
```ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // 其他 next config
})
```

### 執行分析
```bash
ANALYZE=true npm run build
```

### 常見問題
- `axios` 是否比預期大？（可改用原生 fetch 在 Client 端）
- 是否有重複打包的套件？

---

## 5.3 部署準備

### 環境變數 `.env.local`
```env
# NextAuth
AUTH_SECRET=your_secret_here   # 用 openssl rand -base64 32 產生

# CoinGecko（Public API 不需要 Key，但可預留）
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3

# Prisma
DATABASE_URL=file:./dev.db
```

### next.config.ts 最終設定
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['assets.coingecko.com'],  // CoinGecko 幣種圖片
  },
}

export default nextConfig
```

### 部署到 Vercel
```bash
npm install -g vercel
vercel
```

**注意：** SQLite 在 Vercel 無法持久化（無狀態環境），部署前需評估：
- 開發/學習用途：SQLite 即可
- 正式部署：改用 PostgreSQL（如 Vercel Postgres 或 Supabase）

---

## 完成條件
- [ ] 所有元件改用精準 Selector，避免多餘重渲染
- [ ] Bundle 分析執行完成，無異常大套件
- [ ] `.env.local` 設定完整
- [ ] `npm run build` 成功無錯誤
- [ ] 了解 SQLite 在生產環境的限制
