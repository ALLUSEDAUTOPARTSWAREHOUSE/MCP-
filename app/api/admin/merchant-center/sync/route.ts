import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { syncCatalogToMerchantCenter } from '@/lib/google-merchant'

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (
    process.env.ADMIN_EMAIL &&
    session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const result = await syncCatalogToMerchantCenter(session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[merchant-sync]', error)
    return NextResponse.json({ error: 'Merchant Center sync failed' }, { status: 502 })
  }
}
