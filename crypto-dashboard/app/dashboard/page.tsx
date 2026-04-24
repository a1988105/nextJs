import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'

interface Holding {
  coin: string
  amount: number
  value: number
}

interface BalanceData {
  balance: number
  holdings: Holding[]
}

async function getBalance(): Promise<BalanceData> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/user/balance`,
    { cache: 'no-store' }
  )
  if (!res.ok) return { balance: 0, holdings: [] }
  return res.json()
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const data = await getBalance()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">個人儀表板</h1>
            <p className="text-gray-400 mt-1">歡迎回來，{session.user?.name}</p>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/login' })
            }}
          >
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
            >
              登出
            </button>
          </form>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">帳戶餘額 (USD)</p>
          <p className="text-4xl font-bold text-green-400">
            ${data.balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">持倉</h2>
          <div className="flex flex-col gap-3">
            {data.holdings.map((h) => (
              <div
                key={h.coin}
                className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-medium capitalize">{h.coin}</p>
                  <p className="text-gray-400 text-sm">{h.amount} 枚</p>
                </div>
                <p className="text-green-400 font-semibold">
                  ${h.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
