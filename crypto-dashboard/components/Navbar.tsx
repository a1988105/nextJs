import Link from 'next/link'
import { signOut } from '@/auth'
import { getSession } from '@/lib/session'
import { ThemeToggle } from '@/components/ThemeToggle'

export async function Navbar() {
  const session = await getSession()

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl px-6 py-3.5 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2.5 mr-4">
        <span className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center text-black text-xs font-black select-none">
          C
        </span>
        <span className="font-bold text-[15px] tracking-tight text-[var(--text)]">
          Crypto<span className="text-amber-400">Board</span>
        </span>
      </Link>

      <Link
        href="/"
        className="text-sm text-[var(--muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-md hover:bg-[var(--card-hover)] transition-all duration-150"
      >
        Home
      </Link>
      <Link
        href="/market/news"
        className="text-sm text-[var(--muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-md hover:bg-[var(--card-hover)] transition-all duration-150"
      >
        Market
      </Link>
      <Link
        href="/dashboard"
        className="text-sm text-[var(--muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-md hover:bg-[var(--card-hover)] transition-all duration-150"
      >
        Dashboard
      </Link>
      <Link
        href="/trade"
        className="text-sm text-[var(--muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-md hover:bg-[var(--card-hover)] transition-all duration-150"
      >
        Trade
      </Link>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <>
            <span className="text-sm text-[var(--muted)]">
              {session.user?.name}
            </span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-4 py-1.5 rounded-md transition-colors duration-150"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-4 py-1.5 rounded-md transition-colors duration-150"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
