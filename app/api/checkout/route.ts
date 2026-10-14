import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { orders, orderItems, listings } from '@/lib/db/schema'

interface CheckoutItem {
  listingId: string
  quantity: number
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items, shippingAddress, billingAddress } = body as {
      items: CheckoutItem[]
      shippingAddress?: string
      billingAddress?: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Fetch listing details
    const listingIds = items.map((item) => item.listingId)
    const listingsData = await db.select().from(listings).where((col) => {
      // In a real app, use proper filtering
      return null as any
    })

    // Calculate total
    let subtotal = 0
    let lineItems: any[] = []

    for (const item of items) {
      // Find listing (simulated - in real app fetch from DB)
      const listing = { id: item.listingId, title: 'Part', price: '99.99', sellerId: 'seller_123' }

      const unitPrice = parseFloat(listing.price)
      const itemTotal = unitPrice * item.quantity

      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: listing.title,
            metadata: {
              listingId: listing.id,
              sellerId: listing.sellerId,
            },
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: item.quantity,
      })
    }

    // Add platform fee (5%) to line items for display
    const platformFee = subtotal * 0.05
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Platform Fee (5%)',
          description: 'AUAPW Marketplace fee',
        },
        unit_amount: Math.round(platformFee * 100),
      },
      quantity: 1,
    })

    if (!stripe) {
      return NextResponse.json({ error: 'Payment processing unavailable' }, { status: 503 })
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL}/buyer/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL}/cart?canceled=true`,
      metadata: {
        userId: session.user.id,
        itemCount: items.length,
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
