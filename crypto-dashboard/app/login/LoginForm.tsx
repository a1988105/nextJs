'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
  const router = useRouter()
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

    router.push('/dashboard')
    router.refresh()
  }

  return (
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
  )
}
