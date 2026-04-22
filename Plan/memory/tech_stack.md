---
name: 技術棧決策
description: 此專案所有技術選型與原因，用於換電腦後快速恢復上下文
type: project
---

# 技術棧

| 項目 | 選擇 | 原因 |
|------|------|------|
| Framework | Next.js 15 (App Router) | 最新穩定版，學了就是現在業界主流 |
| 語言 | TypeScript | 計畫預設 |
| 樣式 | Tailwind CSS | 計畫預設 |
| 狀態管理 | Zustand (Small Stores) | 學習目標核心 |
| Server Fetch | 原生 `fetch()` | Next.js 對其擴充 cache 控制，axios 無法使用 |
| Client Fetch | axios（在 Zustand action 內） | 不引入 SWR/TanStack Query，保持簡單 |
| 資料庫 | Prisma + SQLite | 輕量、本地、學習用 |
| 身份驗證 | NextAuth.js v5 Credentials Provider | 自訂帳號密碼登入，不用 OAuth |
| 密碼加密 | bcryptjs | 明文密碼不可存入 DB |
| Session | JWT in httpOnly cookie | Credentials Provider 強制使用 JWT |
| 加密貨幣 API | CoinGecko Public API | 免費、無需 API Key |

**Why:** 這是一個學習專案，技術選型以「不過度引入套件、能清楚展示 Next.js 渲染模式差異」為原則。
**How to apply:** 遇到新需求先確認是否符合此原則再引入新套件。
