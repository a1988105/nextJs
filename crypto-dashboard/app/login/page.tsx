import Link from 'next/link'
import LoginForm from './LoginForm'
import { PageReveal } from '@/components/PageReveal'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-20 relative">
      {/* Ambient glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      <PageReveal delay={1} className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 mb-5">
            <span className="text-black font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">歡迎回來</h1>
          <p className="text-[var(--muted)] text-sm mt-1">登入您的 Crypto 儀表板</p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-[var(--muted)] mt-5">
          <Link
            href="/market/news"
            className="hover:text-amber-400 transition-colors duration-150"
          >
            ← 返回市場總覽
          </Link>
        </p>
      </PageReveal>
    </div>
  )
}
