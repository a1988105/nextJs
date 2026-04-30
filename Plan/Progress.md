# 實作進度

> 每次換電腦或繼續開發前，先看這份文件確認進度

---

## 整體進度

| 階段 | 狀態 | 完成日期 |
|------|------|---------|
| Phase 1：基礎建設 + SSG + ISR | ✅ 完成 | 2026-04-22 |
| Phase 2：SSR + 身份驗證 + Server Actions | ✅ 完成 | 2026-04-24 |
| Phase 3：Zustand Small Stores | ✅ 完成  | 2026-04-24 |
| Phase 4：持久化與 Hydration | ✅ 完成 | 2026-04-27 |
| Phase 4.5：DB 真實持久化（Holding / Trade） | ✅ 完成 | 2026-04-28 |
| Phase 4.8：賣出功能 + 交易記錄頁 | ✅ 完成 | 2026-04-30 |
| Phase 5：效能優化與部署 | ✅ 完成 | 2026-04-30 |

> 狀態標示：⬜ 未開始 / 🔄 進行中 / ✅ 完成

---

## Phase 1 細項

- [x] 1.1 `npx create-next-app` 完成，`npm run dev` 可執行
- [x] 1.1 安裝所有依賴（zustand, axios, next-auth, prisma, bcryptjs）
- [x] 1.1 建立 `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- [x] 1.2 `/coins/[id]` 頁面 + `generateStaticParams`
- [x] 1.2 `generateMetadata` 動態 SEO meta
- [x] 1.3 `/market/news` ISR 頁面（revalidate: 60）

## Phase 2 細項

- [x] 2.1 Prisma Schema 建立 User 資料表 + migrate
- [x] 2.1 NextAuth Credentials Provider 設定
- [x] 2.1 `/login` 自訂登入頁
- [x] 2.1 `proxy.ts` 路由守衛（Next.js 16 改名為 proxy）
- [x] 2.2 `/dashboard` SSR 頁面
- [x] 2.2 `/api/user/balance` API Route
- [x] 2.3 `app/actions/trade.ts` Server Action

## Phase 3 細項

- [x] 3.1 `useAuthStore.ts` 建立
- [x] 3.1 `useUIStore.ts` 建立
- [x] 3.1 `useTradeStore.ts` 建立（含 fetchPrice）
- [x] 3.2 Server → Client 資料橋接實作
- [x] 3.3 `/trade` CSR 頁面 + 計算機邏輯
- [x] 3.3 `/api/price/[coinId]` Route

## Phase 4 細項

- [x] 4.1 `useUIStore` 加入 persist middleware
- [x] 4.2 `useHasHydrated` Hook 建立
- [x] 4.2 ThemeToggle 套用 useHasHydrated
- [x] 4.3 Navbar 顯示用戶名

## Phase 4.5 細項

- [x] Prisma schema 加 `Holding`、`Trade` model，`User` 加 `balance` 欄位
- [x] `placeOrder` Server Action 接 DB：server-side 取即時價、驗餘額、transaction 寫 DB
- [x] `/trade` 頁面「確認買入」接上 Server Action（loading spinner、inline 通知、成功清空輸入）
- [x] `getUserBalance` 改為 async，從 DB 讀真實 balance + holdings
- [x] `/api/user/balance` 改讀真實 DB
- [x] Dashboard 傳 `session.user.id` 給 `getUserBalance`

## Phase 4.8 細項

- [x] `lib/tradeOrder.ts` 加入 `executeSellOrder`（transaction：驗持倉 → 減持倉 → 加餘額 → 寫 Trade 紀錄）
- [x] `InsufficientHoldingError` 新 Error 類別
- [x] `app/actions/sell.ts` Server Action（`placeSellOrder`）
- [x] `services/user.ts` 加入 `getUserTrades`（最近 50 筆，倒序）
- [x] `store/useTradeStore.ts` 加入 `sellCoinAmount` / `setSellCoinAmount`
- [x] `app/trade/page.tsx` 改為 Server Component（SSR fetch balance + holdings，未登入 redirect）
- [x] `components/TradeClient.tsx` 統一 Buy/Sell 分頁 UI，成功後呼叫 `router.refresh()` 更新持倉
- [x] `app/trade/history/page.tsx` 新頁面（SSR + Auth，列出所有交易）
- [x] Home page 加入 Trade / Trade History feature card
- [x] Navbar 加入 History 連結

## Phase 5 細項

- [x] 5.1 `DashboardClient` 改三個獨立 selector；`TradeClient` 改用 `useShallow`（9 欄位）
- [x] 5.2 安裝 `@next/bundle-analyzer`，新增 `npm run analyze` script
- [x] 5.3 `.env.local` 補上 `DATABASE_URL` + `NEXT_PUBLIC_APP_URL`
- [x] 5.3 `npm run build` 成功（13 頁全部通過）

---

## 下次繼續的位置

<!-- 每次停下來時更新這裡 -->
**最後更新：** 2026-04-30
**停在：** Phase 5 全部完成（精準 selector、bundle analyzer、env 補全、build 成功）
**下一步：** 所有 Phase 已完成 🎉

---

## 環境資訊

| 項目 | 內容 |
|------|------|
| Node.js 版本 | v24.14.1 |
| npm 版本 | 11.12.1 |
| 專案路徑 | `D:\Git\Claude Code\nextjs\crypto-dashboard` |
| Next.js 版本 | 16.2.4（installed latest） |
