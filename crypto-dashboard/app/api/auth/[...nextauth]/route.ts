import { handlers } from '@/auth'
import type { NextRequest } from 'next/server'

// Auth.js v5 hardcodes `Expires` on every session cookie write.
// We strip it here so authjs.session-token becomes a true session cookie
// (cleared on browser close), while the JWT exp claim still enforces server-side expiry.
function stripCookieExpiry(response: Response): Response {
  const setCookies = response.headers.getSetCookie()
  if (!setCookies.length) return response

  const newHeaders = new Headers(response.headers)
  newHeaders.delete('set-cookie')
  for (const cookie of setCookies) {
    const stripped = cookie
      .replace(/;\s*expires=[^;]*/gi, '')
      .replace(/;\s*max-age=[^;]*/gi, '')
    newHeaders.append('set-cookie', stripped)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

export async function GET(request: NextRequest) {
  return stripCookieExpiry(await handlers.GET(request))
}

export async function POST(request: NextRequest) {
  return stripCookieExpiry(await handlers.POST(request))
}
