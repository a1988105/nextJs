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

## React / Next.js
- Prefer Server Components by default
- Use Client Components only when necessary
- Use Suspense where applicable