import { NextResponse } from 'next/server'
import { CUSTOMER_COOKIE, customerCookieOptions } from '@/lib/customer-auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  for (const name of [CUSTOMER_COOKIE, 'customerToken', 'customerEmail', 'customerId']) {
    response.cookies.set(name, '', { ...customerCookieOptions, maxAge: 0 })
  }
  return response
}
