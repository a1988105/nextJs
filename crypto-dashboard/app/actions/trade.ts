'use server'

import { auth } from '@/auth'

export async function placeOrder(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const coin = formData.get('coin') as string
  const amount = Number(formData.get('amount'))

  if (!coin || isNaN(amount) || amount <= 0) {
    return { success: false, message: '輸入資料無效' }
  }

  // 模擬寫入 DB 邏輯
  console.log(`[Trade] 用戶 ${session.user?.name} 下單：${amount} USD of ${coin}`)
  return { success: true, message: `成功下單 ${amount} USD 的 ${coin}` }
}
