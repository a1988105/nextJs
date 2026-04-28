'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getCoinPrice } from '@/services/coinGecko'

type OrderResult = { success: boolean; message: string }

export async function placeOrder(formData: FormData): Promise<OrderResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: '請先登入' }

  const coin = formData.get('coin') as string
  const usdAmount = Number(formData.get('amount'))

  if (!coin || isNaN(usdAmount) || usdAmount <= 0) {
    return { success: false, message: '輸入資料無效' }
  }

  const price = await getCoinPrice(coin)
  if (price === null) return { success: false, message: '無法取得即時價格，請稍後再試' }

  const userId = Number(session.user.id)
  const qty = usdAmount / price

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { success: false, message: '找不到使用者' }
  if (user.balance < usdAmount) return { success: false, message: `餘額不足（目前 $${user.balance.toLocaleString()}）` }

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

  return {
    success: true,
    message: `成功買入 ${qty.toFixed(6)} ${coin} @ $${price.toLocaleString()}`,
  }
}
