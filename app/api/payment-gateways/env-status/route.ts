import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/payment-gateways/env-status?vars=STRIPE_SECRET_KEY,PAYPAL_CLIENT_SECRET
 * Admin-only: reports whether each named environment variable is currently
 * set on this deployment. Returns booleans only — never the values — so the
 * dashboard can show "Configured" / "Needs setup" next to each gateway
 * without ever exposing a secret.
 */
export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const varsParam = req.nextUrl.searchParams.get('vars') ?? ''
  const names = varsParam
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)

  const status: Record<string, boolean> = {}
  for (const name of names) {
    // Only ever expose whether a value is present, never the value itself.
    status[name] = Boolean(process.env[name] && process.env[name]!.length > 0)
  }

  return NextResponse.json({ status })
}
