import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { orders, payouts, ledgerEntries, sellers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: any

  try {
    const body = await request.text()
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object)
      break

    case 'charge.failed':
      await handleChargeFailed(event.data.object)
      break

    case 'charge.dispute.created':
      await handleDisputeCreated(event.data.object)
      break

    case 'account.updated':
      await handleAccountUpdated(event.data.object)
      break

    case 'transfer.created':
      await handleTransferCreated(event.data.object)
      break

    default:
      console.log(`[v0] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleChargeSucceeded(charge: any) {
  try {
    console.log('[v0] Processing successful charge:', charge.id)

    // Update order status
    // In a real app, match the charge metadata to an order and update it
    const orderId = charge.metadata?.orderId

    if (orderId) {
      await db.update(orders).set({ paymentStatus: 'paid' }).where(eq(orders.id, orderId))
    }
  } catch (error) {
    console.error('[v0] Error handling charge succeeded:', error)
  }
}

async function handleChargeFailed(charge: any) {
  try {
    console.log('[v0] Processing failed charge:', charge.id)

    // Update order status
    const orderId = charge.metadata?.orderId

    if (orderId) {
      await db.update(orders).set({ paymentStatus: 'failed' }).where(eq(orders.id, orderId))
    }
  } catch (error) {
    console.error('[v0] Error handling charge failed:', error)
  }
}

async function handleDisputeCreated(dispute: any) {
  try {
    console.log('[v0] Dispute created:', dispute.id)

    // Create fraud flag for the seller
    // This would typically create a fraud_flag record to alert admins
  } catch (error) {
    console.error('[v0] Error handling dispute:', error)
  }
}

async function handleAccountUpdated(account: any) {
  try {
    console.log('[v0] Stripe Connect account updated:', account.id)

    // Update seller verification status based on account state
    // Check account.charges_enabled and account.payouts_enabled
  } catch (error) {
    console.error('[v0] Error handling account update:', error)
  }
}

async function handleTransferCreated(transfer: any) {
  try {
    console.log('[v0] Transfer created to seller:', transfer.destination)

    // Update payout status
    // Match stripe transfer ID to a payout record
  } catch (error) {
    console.error('[v0] Error handling transfer:', error)
  }
}
