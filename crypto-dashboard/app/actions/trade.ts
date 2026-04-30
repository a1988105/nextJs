'use server'

import { auth } from '@/auth'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import {
  executeBuyOrder,
  InsufficientBalanceError,
  InvalidOrderInputError,
  isSupportedCoin,
  UnsupportedCoinError,
} from '@/lib/tradeOrder'
import { getCoinPrice } from '@/services/coinGecko'

type OrderResult = { success: boolean; message: string }

export async function placeOrder(formData: FormData): Promise<OrderResult> {
  const session = await auth()
  if (!session?.user?.id) {
    logger.warn('trade', 'Rejected order without authenticated session')
    return { success: false, message: '請先登入' }
  }

  const userId = Number(session.user.id)
  const coin = String(formData.get('coin') ?? '')
  const usdAmount = Number(formData.get('amount'))

  if (!Number.isInteger(userId) || userId <= 0) {
    logger.error('trade', 'Rejected order with invalid session user id', {
      userId: session.user.id,
    })
    return { success: false, message: '登入狀態無效，請重新登入' }
  }

  if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
    logger.warn('trade', 'Rejected order with invalid amount', { coin, usdAmount })
    return { success: false, message: '請輸入有效金額' }
  }

  if (!isSupportedCoin(coin)) {
    logger.warn('trade', 'Rejected order for unsupported coin', { userId, coin, usdAmount })
    return { success: false, message: '不支援的交易標的' }
  }

  const price = await getCoinPrice(coin)
  if (price === null) {
    logger.error('trade', 'Rejected order because price was unavailable', { userId, coin, usdAmount })
    return { success: false, message: '無法取得即時價格，請稍後再試' }
  }

  try {
    const { qty } = await executeBuyOrder(prisma, {
      userId,
      coin,
      usdAmount,
      price,
    })

    return {
      success: true,
      message: `成功買入 ${qty.toFixed(6)} ${coin} @ $${price.toLocaleString()}`,
    }
  } catch (error) {
    if (error instanceof InsufficientBalanceError) {
      logger.warn('trade', 'Rejected order because balance was insufficient', {
        userId,
        coin,
        usdAmount,
      })
      return { success: false, message: '餘額不足' }
    }

    if (error instanceof UnsupportedCoinError) {
      logger.warn('trade', 'Rejected order for unsupported coin', { userId, coin, usdAmount })
      return { success: false, message: '不支援的交易標的' }
    }

    if (error instanceof InvalidOrderInputError) {
      logger.warn('trade', 'Rejected order with invalid input', { userId, coin, usdAmount, price })
      return { success: false, message: '請輸入有效交易資料' }
    }

    logger.error('trade', 'Order transaction failed', {
      userId,
      coin,
      usdAmount,
      price,
      error,
    })
    return { success: false, message: '下單失敗，請稍後再試' }
  }
}
