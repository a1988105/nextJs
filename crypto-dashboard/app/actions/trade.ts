'use server'

import { auth } from '@/auth'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { getCoinPrice } from '@/services/coinGecko'

type OrderResult = { success: boolean; message: string }

export async function placeOrder(formData: FormData): Promise<OrderResult> {
  const session = await auth()
  if (!session?.user?.id) {
    logger.warn('trade', 'Rejected order without authenticated session')
    return { success: false, message: '請先登入' }
  }

  const coin = formData.get('coin') as string
  const usdAmount = Number(formData.get('amount'))

  if (!coin || isNaN(usdAmount) || usdAmount <= 0) {
    logger.warn('trade', 'Rejected order with invalid input', { coin, usdAmount })
    return { success: false, message: '請輸入有效金額' }
  }

  const price = await getCoinPrice(coin)
  if (price === null) {
    logger.error('trade', 'Rejected order because price was unavailable', { coin, usdAmount })
    return { success: false, message: '無法取得即時價格，請稍後再試' }
  }

  const userId = Number(session.user.id)
  const qty = usdAmount / price

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    logger.error('trade', 'Rejected order because user was not found', { userId, coin, usdAmount })
    return { success: false, message: '找不到使用者' }
  }

  if (user.balance < usdAmount) {
    logger.warn('trade', 'Rejected order because balance was insufficient', {
      userId,
      coin,
      usdAmount,
      balance: user.balance,
    })
    return { success: false, message: `餘額不足，目前餘額 $${user.balance.toLocaleString()}` }
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: usdAmount } },
      }),
      prisma.holding.upsert({
        where: { userId_coin: { userId, coin } },
        create: { userId, coin, amount: qty, value: usdAmount },
        update: { amount: { increment: qty }, value: { increment: usdAmount } },
      }),
      prisma.trade.create({
        data: { userId, coin, usdAmount, price, qty },
      }),
    ])
  } catch (error) {
    logger.error('trade', 'Order transaction failed', {
      userId,
      coin,
      usdAmount,
      price,
      qty,
      error,
    })
    return { success: false, message: '下單失敗，請稍後再試' }
  }

  return {
    success: true,
    message: `成功買入 ${qty.toFixed(6)} ${coin} @ $${price.toLocaleString()}`,
  }
}
