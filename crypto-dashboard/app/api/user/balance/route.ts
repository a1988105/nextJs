import { auth } from '@/auth'
import { logger } from '@/lib/logger'
import { getUserBalance } from '@/services/user'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    logger.warn('api.user.balance', 'Rejected balance request without session')
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = Number(session.user.id)
  if (!Number.isInteger(userId)) {
    logger.error('api.user.balance', 'Rejected balance request with invalid session user id', {
      userId: session.user.id,
    })
    return Response.json({ error: 'Invalid session' }, { status: 400 })
  }

  try {
    const data = await getUserBalance(userId)
    return Response.json(data)
  } catch (error) {
    logger.error('api.user.balance', 'Failed to load balance', { userId, error })
    return Response.json({ error: 'Failed to load balance' }, { status: 500 })
  }
}
