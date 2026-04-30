import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUserBalance } from '@/services/user'
import TradeClient from '@/components/TradeClient'

export default async function TradePage() {
  const session = await getSession()
  const userId = Number(session?.user?.id)
  if (!session || !Number.isInteger(userId)) redirect('/login')

  const { balance, holdings } = await getUserBalance(userId)

  return <TradeClient initialBalance={balance} initialHoldings={holdings} />
}
