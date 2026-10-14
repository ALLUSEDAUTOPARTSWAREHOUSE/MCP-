'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'
import { and, eq } from 'drizzle-orm'
import { notifyNewOrder, notifyNewCustomer } from '@/lib/notification-dispatcher'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

interface CheckoutData {
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shippingCost: number
  shippingAddress: string
  billingAddress: string
}

export async function createOrder(data: CheckoutData) {
  const userId = await getUserId()

  // Validate cart is not empty
  if (!data.items || data.items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Validate addresses
  if (!data.shippingAddress || !data.billingAddress) {
    throw new Error('Addresses are required')
  }

  // Validate totals
  if (data.subtotal <= 0) {
    throw new Error('Invalid order total')
  }

  const orderId = randomUUID()
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
  const totalAmount = data.subtotal + data.tax + data.shippingCost

  try {
    // Get user info for notification
    const userEmail = (await auth.api.getSession({ headers: await headers() }))?.user?.email || 'unknown@example.com'
    const userName = (await auth.api.getSession({ headers: await headers() }))?.user?.name || 'Customer'

    const result = await db.insert(orders).values({
      id: orderId,
      userId,
      orderNumber,
      status: 'pending',
      totalAmount: totalAmount.toString(),
      subtotal: data.subtotal.toString(),
      tax: data.tax.toString(),
      shippingCost: data.shippingCost.toString(),
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      items: JSON.stringify(data.items),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    // Send order notification asynchronously (fire-and-forget)
    notifyNewOrder(orderId, {
      orderId,
      orderNumber,
      customerName: userName,
      email: userEmail,
      itemCount: data.items.length,
      total: totalAmount,
      createdAt: new Date(),
    }).catch((err) => console.error('[Order] Notification failed:', err))

    return {
      success: true,
      orderId,
      orderNumber,
      message: 'Order created successfully',
    }
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    throw new Error('Failed to create order. Please try again.')
  }
}

export async function getOrderByNumber(orderNumber: string) {
  const userId = await getUserId()
  
  const result = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1)
  
  return result[0]
}
