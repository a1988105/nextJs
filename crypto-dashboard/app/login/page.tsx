'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError('帳號或密碼錯誤')
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-20 relative">
      {/* Ambient glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm fade-up delay-1">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 mb-5">
            <span className="text-black font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">歡迎回來</h1>
          <p className="text-gray-500 text-sm mt-1">登入您的 Crypto 儀表板</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5"
                htmlFor="username"
              >
                帳號
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="輸入帳號"
                className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.08] transition-all duration-150"
              />
            </div>

            <div>
              <label
                className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5"
                htmlFor="password"
              >
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="輸入密碼"
                className="w-full bg-white/[0.06] border border-white/[0.08] text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.08] transition-all duration-150"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-bold py-2.5 rounded-lg transition-all duration-150 text-sm tracking-wide"
            >
              {loading ? '登入中…' : '登入'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          <Link
            href="/market/news"
            className="hover:text-amber-400 transition-colors duration-150"
          >
            ← 返回市場總覽
          </Link>
        </p>
      </div>
    </div>
  )
}
