import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 模擬從 DB 讀取持倉資料
  return Response.json({
    balance: 10000,
    holdings: [
      { coin: 'bitcoin', amount: 0.5, value: 45000 },
      { coin: 'ethereum', amount: 3.2, value: 9600 },
    ],
  })
}
