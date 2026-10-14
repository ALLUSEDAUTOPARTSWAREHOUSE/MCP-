import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts } from '@/lib/db/schema'
import { inArray, sql } from 'drizzle-orm'

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string') : []
  if (!ids.length) return NextResponse.json({ error: 'Select at least one product' }, { status: 400 })
  const mode = body.mode
  const value = Number(body.value)
  if (!['set', 'increase', 'decrease', 'percent-increase', 'percent-decrease'].includes(mode) || !Number.isFinite(value) || value < 0) return NextResponse.json({ error: 'Invalid bulk pricing operation' }, { status: 400 })
  const nextPrice = mode === 'set' ? sql`GREATEST(0, ${value})` : mode === 'increase' ? sql`price + ${value}` : mode === 'decrease' ? sql`GREATEST(0, price - ${value})` : mode === 'percent-increase' ? sql`price * (1 + ${value} / 100)` : sql`GREATEST(0, price * (1 - ${value} / 100))`
  await db.update(catalogProducts).set({ price: nextPrice, priceDisplay: sql`concat('$', to_char(${nextPrice}, 'FM999,999,990.00'))`, updatedAt: new Date() }).where(inArray(catalogProducts.id, ids))
  return NextResponse.json({ updated: ids.length })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json(); const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string') : []
  if (!ids.length) return NextResponse.json({ error: 'Select at least one product' }, { status: 400 })
  await db.delete(catalogProducts).where(inArray(catalogProducts.id, ids))
  return NextResponse.json({ deleted: ids.length })
}
