'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getCustomerOrders() {
  const userId = await getUserId()
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy((o) => o.createdAt)
}

export async function getOrderById(orderId: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId) && eq(orders.userId, userId))
    .limit(1)
  return result[0]
}
