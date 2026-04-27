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
| Phase 5：效能優化與部署 | ⬜ 未開始 | - |

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

- [ ] 3.1 `useAuthStore.ts` 建立
- [ ] 3.1 `useUIStore.ts` 建立
- [ ] 3.1 `useTradeStore.ts` 建立（含 fetchPrice）
- [ ] 3.2 Server → Client 資料橋接實作
- [ ] 3.3 `/trade` CSR 頁面 + 計算機邏輯
- [ ] 3.3 `/api/price/[coinId]` Route

## Phase 4 細項

- [x] 4.1 `useUIStore` 加入 persist middleware
- [x] 4.2 `useHasHydrated` Hook 建立
- [x] 4.2 ThemeToggle 套用 useHasHydrated
- [x] 4.3 Navbar 顯示用戶名

## Phase 5 細項

- [ ] 5.1 所有元件改用精準 Selector
- [ ] 5.2 Bundle 分析執行
- [ ] 5.3 `.env.local` 設定完整
- [ ] 5.3 `npm run build` 成功

---

## 下次繼續的位置

<!-- 每次停下來時更新這裡 -->
**最後更新：** 2026-04-27
**停在：** Phase 4 完成
**下一步：** Phase 5 — 效能優化與部署

---

## 環境資訊

| 項目 | 內容 |
|------|------|
| Node.js 版本 | v24.14.1 |
| npm 版本 | 11.12.1 |
| 專案路徑 | `D:\Git\Claude Code\nextjs\crypto-dashboard` |
| Next.js 版本 | 16.2.4（installed latest） |
