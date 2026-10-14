import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  // Redirect relative to the current host (falling back to localhost sent
  // production admins to http://localhost:3000 when NEXT_PUBLIC_APP_URL was unset).
  // 303 makes the browser follow with a GET.
  const response = NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 303,
  })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
