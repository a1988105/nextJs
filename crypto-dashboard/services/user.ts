import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import type { UserBalance } from '@/lib/dashboard'

export const getUserBalance = cache(async function getUserBalance(userId: number): Promise<UserBalance> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { holdings: true },
  })

  return {
    balance: user?.balance ?? 0,
    holdings: (user?.holdings ?? []).map((h) => ({
      coin: h.coin,
      amount: h.amount,
      value: h.value,
    })),
  }
})
