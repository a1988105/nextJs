---
name: Fetch 策略
description: Server/Client 端資料獲取的分工方式
type: project
---

# Fetch 策略

| 情境 | 方案 | 原因 |
|------|------|------|
| Server Components (SSG/ISR/SSR) | 原生 `fetch()` + Next.js cache 參數 | 保留 Next.js 的 force-cache / revalidate / no-store 控制 |
| Client Components 資料獲取 | axios，在 Zustand action 內呼叫 | 統一狀態管理，不引入 SWR/TanStack Query |
| 寫入 / 表單提交 | Server Action | 不需建立額外 API Route，自動 CSRF 保護 |

**Why:** 用戶明確選擇不引入 SWR 或 TanStack Query，所有 client 狀態統一由 Zustand 管理。
**How to apply:** 遇到 client 端需要 fetch 資料時，永遠在 Zustand store action 裡用 axios 呼叫，不在 component 內直接 fetch。
