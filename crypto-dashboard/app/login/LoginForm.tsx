'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
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
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="themed-card rounded-2xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md p-7">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            className="block text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1.5"
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
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text)] rounded-lg px-4 py-2.5 text-sm placeholder-[var(--muted)] focus:outline-none focus:border-amber-400/60 focus:bg-[var(--input-bg)] transition-all duration-150"
          />
        </div>

        <div>
          <label
            className="block text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1.5"
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
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text)] rounded-lg px-4 py-2.5 text-sm placeholder-[var(--muted)] focus:outline-none focus:border-amber-400/60 focus:bg-[var(--input-bg)] transition-all duration-150"
          />
        </div>

        {error && (
          <div className="text-[var(--red)] text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
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
  )
}
