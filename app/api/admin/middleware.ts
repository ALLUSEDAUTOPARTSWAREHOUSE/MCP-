import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminSession')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const verification = verifyAdminToken(token)
  if (!verification.valid) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/kpis/:path*', '/api/admin/approvals/:path*'],
}
