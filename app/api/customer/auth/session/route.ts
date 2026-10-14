import { NextRequest, NextResponse } from 'next/server'
import { CUSTOMER_COOKIE, verifyCustomerToken } from '@/lib/customer-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = verifyCustomerToken(request.cookies.get(CUSTOMER_COOKIE)?.value)
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: session.email, customerId: session.customerId, role: 'customer' },
  })
}
