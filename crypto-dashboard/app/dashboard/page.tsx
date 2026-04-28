import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUserBalance } from '@/services/user'
import DashboardClient from '@/components/DashboardClient'

// Server Component：只負責 fetch 資料 + 傳 props
export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const userId = Number(session.user?.id)
  const data = await getUserBalance(userId)

  return (
    <DashboardClient
      username={session.user?.name ?? '用戶'}
      initialData={data}
    />
  )
}
