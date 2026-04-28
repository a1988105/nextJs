This is a Next.js crypto dashboard demo with credential-based authentication,
market data pages, and a protected dashboard.

## Getting Started

1. Create your local env file from the example and set an auth secret.

```bash
cp .env.example .env.local
```

Use `AUTH_SECRET` going forward. `NEXTAUTH_SECRET` is also accepted for
backward compatibility, but only one is required.

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
2. npx prisma generate

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If neither `AUTH_SECRET` nor `NEXTAUTH_SECRET` is set, the app will now fail
fast during startup with a clear error instead of running with an incomplete
auth configuration.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

- `AUTH_SECRET`: preferred NextAuth secret for signing auth tokens
- `NEXTAUTH_SECRET`: legacy-compatible fallback name
- `NEXT_PUBLIC_APP_URL`: public app URL used by the frontend
- `COINGECKO_BASE_URL`: CoinGecko API base URL

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js / NextAuth.js Documentation](https://authjs.dev)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
