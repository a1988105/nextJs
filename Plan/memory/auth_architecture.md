---
name: 身份驗證架構
description: 登入機制、session 管理與資料庫的設計決策
type: project
---

# 身份驗證架構

## 選擇
- NextAuth.js v5 (Auth.js) + Credentials Provider
- 自訂登入頁 `/login`（帳號 + 密碼表單）
- 不使用 GitHub OAuth 或其他第三方 Provider

## 資料流
```
用戶輸入帳密
    ↓
NextAuth Credentials Provider
    ↓
Prisma 查詢 SQLite User 資料表
    ↓
bcryptjs 驗證 hash
    ↓
驗證成功 → JWT 存入 httpOnly cookie
```

## 資料庫職責
- Prisma + SQLite 只存 `User { id, username, password(hash) }`
- **不存 session**（session 由 JWT cookie 管理）

## Zustand useAuthStore 職責
- 只管 UI 層用戶偏好（語言、通知設定）
- **不存 session / JWT**（由 NextAuth 管理，避免重複）

## 路由守衛
- `middleware.ts` 保護 `/dashboard` 和 `/trade`
- Server Component 內用 `auth()` 雙重確認

**Why:** 用戶想自己建登入頁面學習完整流程，不想依賴 GitHub OAuth。JWT 是 Credentials Provider 的強制選項。
**How to apply:** 需要取得 session 時，Server Component 用 `auth()`，Client Component 用 `useSession()`。
