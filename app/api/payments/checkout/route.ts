import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Note: Real Stripe integration requires STRIPE_SECRET_KEY environment variable
// This is a placeholder for the Phase 1 structure - Stripe setup continues in Phase 2

interface CheckoutItem {
  listingId: string
  quantity: number
  price: number
}

export async function POST(req: Request) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, shippingAddress, billingAddress } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: CheckoutItem) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.08 // 8% tax
    const shippingCost = 50 // Flat rate for now
    const total = subtotal + tax + shippingCost

    // Create order record
    const order = await db
      .insert(orders)
      .values({
        id: `order_${Date.now()}`,
        userId: session.user.id,
        orderNumber: `ORD-${Date.now()}`,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shippingCost: shippingCost.toString(),
        totalAmount: total.toString(),
        status: 'pending_payment',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        items: JSON.stringify(items),
      })
      .returning()

    // In Phase 2: Create Stripe Checkout Session
    // For now, return order ID for webhook handling
    return NextResponse.json(
      {
        orderId: order[0].id,
        amount: Math.floor(total * 100), // Convert to cents
        message: 'Stripe integration coming in Phase 2',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
