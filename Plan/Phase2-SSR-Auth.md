# Phase 2：SSR + 身份驗證 + Server Actions

## 目標
處理個人化即時資料，建立完整的帳號密碼登入機制，學習 Server Action 處理寫入操作

---

## 2.1 身份驗證：NextAuth.js v5 + Prisma + SQLite

### 技術說明
| 項目 | 說明 |
|------|------|
| NextAuth.js v5 (Auth.js) | Next.js 15 對應版本 |
| Credentials Provider | 自訂帳號密碼登入 |
| Session 方式 | JWT 存於 httpOnly cookie |
| 資料庫 | Prisma + SQLite（僅存帳號密碼） |
| 密碼加密 | bcryptjs hash |

### Prisma 設定

**初始化**
```bash
npx prisma init --datasource-provider sqlite
```

**Schema** (`prisma/schema.prisma`)
```prisma
model User {
  id        Int    @id @default(autoincrement())
  username  String @unique
  password  String  // 存 bcrypt hash，非明文
}
```

**建立資料庫**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### NextAuth 設定

**檔案路徑**
```
app/api/auth/[...nextauth]/route.ts
auth.ts   # NextAuth 設定主檔（放根目錄）
```

**auth.ts 核心邏輯**
```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string }
        })
        if (!user) return null
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null
        return { id: String(user.id), name: user.username }
      }
    })
  ],
  pages: { signIn: '/login' },  // 自訂登入頁
})
```

### 自訂登入頁 `/login`
```
app/login/page.tsx   # 'use client'，含帳號密碼表單
```

### middleware.ts — 路由守衛
```ts
// middleware.ts（放根目錄）
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/trade/:path*'],
}
```
未登入存取 `/dashboard` 或 `/trade` 時自動導回 `/login`

### 密碼 Hash 工具（seed 用）
```ts
// scripts/create-user.ts（手動建立測試帳號用）
import bcrypt from 'bcryptjs'
const hash = await bcrypt.hash('your_password', 10)
```

---

## 2.2 SSR 頁面：個人資產儀表板 `/dashboard`

### Server Component 取得 Session
```ts
import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')  // 雙重保護
  // ...
}
```

### fetch with no-store — SSR 每次請求重新渲染
```ts
const res = await fetch(url, { cache: 'no-store' })
```

### API Route：讀取用戶餘額
```
app/api/user/balance/route.ts
```
```ts
export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // 模擬從 DB 讀取餘額資料
  return Response.json({ balance: 10000, holdings: [...] })
}
```

### 學習重點
- Server Component 直接 fetch vs 建立 API Route 的使用時機
  - Server Component fetch：頁面初始資料（HTML 一起送出）
  - API Route：Client Component 動態呼叫，或給外部使用

---

## 2.3 Server Action：模擬下單

### 檔案路徑
```
app/actions/trade.ts
```

### 核心寫法
```ts
'use server'

import { auth } from '@/auth'

export async function placeOrder(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const coin = formData.get('coin') as string
  const amount = Number(formData.get('amount'))

  // 模擬寫入 DB 邏輯
  console.log(`下單：${amount} USD of ${coin}`)
  return { success: true }
}
```

### 學習重點
- GET 資料 → Server Component fetch
- POST / 寫入 → Server Action（不需要建立 API Route）
- Server Action 自動處理 CSRF 保護

---

## 完成條件
- [ ] Prisma + SQLite 設定完成，可建立用戶
- [ ] `/login` 頁面可正常登入
- [ ] 登入後 session 存在 JWT cookie
- [ ] 未登入存取 `/dashboard` 自動導回 `/login`
- [ ] `/dashboard` 顯示 session 中的用戶名與模擬餘額
- [ ] API Route `/api/user/balance` 正常回傳資料
- [ ] Server Action `placeOrder` 可接收表單資料
