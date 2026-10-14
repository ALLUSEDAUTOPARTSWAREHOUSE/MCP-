import { NextRequest, NextResponse } from 'next/server'
import {
  CUSTOMER_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  createCustomerToken,
  customerCookieOptions,
  customerIdFor,
} from '@/lib/customer-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
    }

    // TODO: verify email/password against the real user store (hashed password).
    // This length check is a placeholder and does NOT authenticate anyone.
    if (password.length < 6) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json(
      { success: true, user: { email, role: 'customer', customerId: customerIdFor(email) } },
      { status: 200 }
    )
    response.cookies.set(CUSTOMER_COOKIE, createCustomerToken(email), {
      ...customerCookieOptions,
      maxAge: CUSTOMER_SESSION_MAX_AGE,
    })
    return response
  } catch (error) {
    console.error('[customer-auth] login error:', error)
    return NextResponse.json({ message: 'Authentication error' }, { status: 500 })
  }
}
