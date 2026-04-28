<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


#專案結構
/app                ← Next.js routing（RSC 為主）
/components         ← 純 UI（不可有 business logic）
/hooks              ← 邏輯（state / effects / orchestration）
/services           ← API / external calls
/schemas            ← Zod schema（所有外部資料必經）
/types              ← TS types（domain model）
/lib                ← utils（純 function）

# AI Coding Rules

## General
- Use TypeScript with strict mode
- Do NOT use `any`
- Prefer functional, composable patterns


## Architecture
- Components: UI only
- Hooks: contain logic
- Services: handle API calls
- Schemas: validate ALL external data

## Data Handling
- All API responses MUST be validated using Zod
- Never trust external data
- No inline fetch inside components

## Error Handling
- Always handle error states
- Never swallow errors silently

## Code Quality
- Max function length: 50 lines
- Prefer small reusable functions
- Avoid deep nesting (>3 levels)
- No magic numbers or magic strings

## React / Next.js
- Prefer Server Components by default
- Use Client Components only when necessary
- Use Suspense where applicable

## Server / Client 邊界（重要）
- `lib/` 只放純 type 和純函數，Client Component 可以 import
- 任何 import `prisma` 的函數一律放 `services/`，只能在 Server Component、Server Action、Route Handler 呼叫
- 違反此規則會導致 `Module not found: Can't resolve 'fs'` 瀏覽器錯誤
- 新增 DB 邏輯前先確認：這個檔案是否可能被 `'use client'` 的元件 import？是的話就拆開