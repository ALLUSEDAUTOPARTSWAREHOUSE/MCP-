'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ledger, sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

/**
 * Post a transaction to the append-only ledger
 * This records all financial transactions for sellers
 */
export async function postTransaction(
  orderId: string,
  sellerId: string,
  transactionType: 'sale' | 'refund' | 'chargeback' | 'withdrawal',
  amount: number,
  commission: number,
  description?: string,
  metadata?: Record<string, any>
) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    // Verify seller exists and user has permission
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      throw new Error('Seller not found')
    }

    // Only admins or the seller themselves can post transactions
    if (session.user.id !== seller[0].userId && session.user.role !== 'admin') {
      throw new Error('Permission denied')
    }

    const netAmount = amount - commission

    // Insert into immutable ledger
    const entry = await db
      .insert(ledger)
      .values({
        id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        sellerId,
        transactionType,
        amount: amount.toString(),
        commission: commission.toString(),
        netAmount: netAmount.toString(),
        status: 'completed',
        description,
        metadata,
      })
      .returning()

    console.log('[v0] Ledger entry created:', entry[0])

    return { success: true, ledgerId: entry[0].id }
  } catch (error) {
    console.error('[v0] Ledger post error:', error)
    throw error
  }
}

/**
 * Calculate fraud risk score for an order
 */
export async function calculateRiskScore(
  orderId: string,
  orderData: {
    amount: number
    userVelocity?: number
    chargebackHistory?: number
    geographicalMismatch?: boolean
  }
): Promise<number> {
  let score = 0

  // High amount orders get flagged
  if (orderData.amount > 5000) score += 20

  // High velocity (multiple orders in short time)
  if (orderData.userVelocity && orderData.userVelocity > 5) score += 25

  // Chargeback history
  if (orderData.chargebackHistory && orderData.chargebackHistory > 2) score += 30

  // Geographical mismatch
  if (orderData.geographicalMismatch) score += 15

  return Math.min(score, 100)
}
