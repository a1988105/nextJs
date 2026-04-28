import { auth } from '@/auth'
import { getUserBalance } from '@/services/user'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await getUserBalance(Number(session.user.id))
  return Response.json(data)
}
