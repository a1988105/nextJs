import { cache } from 'react'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import type { UserBalance } from '@/lib/dashboard'

export const getUserBalance = cache(async function getUserBalance(userId: number): Promise<UserBalance> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { holdings: true },
    })

    if (!user) {
      logger.warn('user', 'User balance requested for missing user', { userId })
    }

    return {
      balance: user?.balance ?? 0,
      holdings: (user?.holdings ?? []).map((h) => ({
        coin: h.coin,
        amount: h.amount,
        value: h.value,
      })),
    }
  } catch (error) {
    logger.error('user', 'Failed to load user balance', { userId, error })
    throw error
  }
})
