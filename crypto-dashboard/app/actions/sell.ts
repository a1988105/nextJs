'use server'

import { auth } from '@/auth'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import {
  executeSellOrder,
  InsufficientHoldingError,
  InvalidOrderInputError,
  isSupportedCoin,
  UnsupportedCoinError,
} from '@/lib/tradeOrder'
import { getCoinPrice } from '@/services/coinGecko'

type OrderResult = { success: boolean; message: string }

export async function placeSellOrder(formData: FormData): Promise<OrderResult> {
  const session = await auth()
  if (!session?.user?.id) {
    logger.warn('trade', 'Rejected sell order without authenticated session')
    return { success: false, message: '請先登入' }
  }

  const userId = Number(session.user.id)
  const coin = String(formData.get('coin') ?? '')
  const coinAmount = Number(formData.get('coinAmount'))

  if (!Number.isInteger(userId) || userId <= 0) {
    return { success: false, message: '登入狀態無效，請重新登入' }
  }

  if (!Number.isFinite(coinAmount) || coinAmount <= 0) {
    return { success: false, message: '請輸入有效數量' }
  }

  if (!isSupportedCoin(coin)) {
    return { success: false, message: '不支援的交易標的' }
  }

  const price = await getCoinPrice(coin)
  if (price === null) {
    return { success: false, message: '無法取得即時價格，請稍後再試' }
  }

  try {
    const { usdReceived } = await executeSellOrder(prisma, { userId, coin, coinAmount, price })
    return {
      success: true,
      message: `成功賣出 ${coinAmount.toFixed(6)} ${coin} @ $${price.toLocaleString()}，獲得 $${usdReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }
  } catch (error) {
    if (error instanceof InsufficientHoldingError) {
      logger.warn('trade', 'Rejected sell due to insufficient holding', { userId, coin })
      return { success: false, message: '持倉不足' }
    }
    if (error instanceof UnsupportedCoinError) {
      return { success: false, message: '不支援的交易標的' }
    }
    if (error instanceof InvalidOrderInputError) {
      return { success: false, message: '請輸入有效交易資料' }
    }
    logger.error('trade', 'Sell order failed', { userId, coin, coinAmount, price, error })
    return { success: false, message: '賣出失敗，請稍後再試' }
  }
}
