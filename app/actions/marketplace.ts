'use server'

import { db } from '@/lib/db'
import {
  sellers,
  listings,
  orders,
  orderItems,
  ledgerEntries,
  payouts,
  sellerReviews,
  listingReviews,
  user,
} from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'

/**
 * Create or update seller profile
 */
export async function upsertSellerProfile(data: {
  businessName: string
  description?: string
  businessType?: string
  website?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  taxId?: string
}) {
  const session = await auth.api.getSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Check if seller profile exists
    const existing = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, session.user.id))
      .limit(1)

    if (existing.length > 0) {
      // Update existing
      await db
        .update(sellers)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(sellers.userId, session.user.id))

      return { success: true, sellerId: existing[0].id }
    } else {
      // Create new
      const sellerId = `seller_${Date.now()}`
      await db.insert(sellers).values({
        id: sellerId,
        userId: session.user.id,
        businessName: data.businessName,
        description: data.description,
        businessType: data.businessType,
        website: data.website,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        taxId: data.taxId,
      })

      return { success: true, sellerId }
    }
  } catch (error) {
    console.error('[v0] Upsert seller profile error:', error)
    return { success: false, error: 'Failed to create/update seller profile' }
  }
}

/**
 * Create a new listing
 */
export async function createListing(data: {
  sku: string
  title: string
  description?: string
  category: string
  subcategory?: string
  price: number
  originalPrice?: number
  quantity: number
  condition: 'new' | 'like-new' | 'excellent' | 'good' | 'fair'
  warranty?: string
  shippingCost?: number
  images?: string[]
  specifications?: Record<string, any>
}) {
  const session = await auth.api.getSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Get seller profile
    const sellerProfile = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, session.user.id))
      .limit(1)

    if (!sellerProfile.length) {
      return { success: false, error: 'Seller profile not found' }
    }

    const listingId = `listing_${Date.now()}`
    await db.insert(listings).values({
      id: listingId,
      sellerId: sellerProfile[0].id,
      sku: data.sku,
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      price: data.price.toString(),
      originalPrice: data.originalPrice?.toString(),
      quantity: data.quantity,
      condition: data.condition,
      warranty: data.warranty,
      shippingCost: (data.shippingCost || 0).toString(),
      images: data.images || [],
      specifications: data.specifications || {},
    })

    return { success: true, listingId }
  } catch (error) {
    console.error('[v0] Create listing error:', error)
    return { success: false, error: 'Failed to create listing' }
  }
}

/**
 * Record a sale transaction and create ledger entries
 */
export async function recordSale(data: {
  sellerId: string
  listingId: string
  buyerId: string
  orderId: string
  amount: number // Gross amount before commission
}) {
  try {
    const commission = (data.amount * 0.05).toString() // 5% platform fee
    const netAmount = (data.amount - parseFloat(commission)).toString()

    // Record gross sale to seller account
    await db.insert(ledgerEntries).values({
      id: `entry_${Date.now()}_sale`,
      sellerId: data.sellerId,
      type: 'sale',
      amount: data.amount.toString(),
      orderId: data.orderId,
      description: `Sale of listing ${data.listingId}`,
      status: 'completed',
    })

    // Record commission deduction
    await db.insert(ledgerEntries).values({
      id: `entry_${Date.now()}_commission`,
      sellerId: data.sellerId,
      type: 'commission_deduction',
      amount: `-${commission}`,
      orderId: data.orderId,
      description: `Platform commission (5%)`,
      status: 'completed',
    })

    // Update seller total sales
    const sellerData = await db.select().from(sellers).where(eq(sellers.id, data.sellerId)).limit(1)
    if (sellerData.length) {
      const newTotal = (parseFloat(sellerData[0].totalSales || '0') + data.amount).toString()
      await db.update(sellers).set({ totalSales: newTotal }).where(eq(sellers.id, data.sellerId))
    }

    return { success: true, netAmount }
  } catch (error) {
    console.error('[v0] Record sale error:', error)
    return { success: false, error: 'Failed to record sale' }
  }
}

/**
 * Process a payout to seller
 */
export async function processPayout(data: {
  sellerId: string
  amount: number
  method: 'stripe' | 'bank_transfer' | 'check'
  stripeTransferId?: string
}) {
  try {
    const payoutId = `payout_${Date.now()}`
    const period = new Date().toISOString().slice(0, 7) // YYYY-MM

    await db.insert(payouts).values({
      id: payoutId,
      sellerId: data.sellerId,
      amount: data.amount.toString(),
      method: data.method,
      stripeTransferId: data.stripeTransferId,
      period,
      status: data.stripeTransferId ? 'in_transit' : 'pending',
    })

    // Record ledger entry
    await db.insert(ledgerEntries).values({
      id: `entry_${Date.now()}_payout`,
      sellerId: data.sellerId,
      type: 'payout',
      amount: `-${data.amount}`,
      description: `Payout via ${data.method}`,
      reference: payoutId,
      status: 'completed',
    })

    return { success: true, payoutId }
  } catch (error) {
    console.error('[v0] Process payout error:', error)
    return { success: false, error: 'Failed to process payout' }
  }
}

/**
 * Get seller dashboard data
 */
export async function getSellerDashboard() {
  const session = await auth.api.getSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const sellerProfile = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, session.user.id))
      .limit(1)

    if (!sellerProfile.length) {
      return { success: false, error: 'Seller profile not found' }
    }

    const sellerId = sellerProfile[0].id

    // Get listing stats
    const sellerListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId))

    // Get recent sales
    const recentSales = await db
      .select()
      .from(ledgerEntries)
      .where(and(eq(ledgerEntries.sellerId, sellerId), eq(ledgerEntries.type, 'sale')))
      .orderBy(desc(ledgerEntries.createdAt))
      .limit(10)

    // Get pending payouts
    const pendingPayouts = await db
      .select()
      .from(payouts)
      .where(and(eq(payouts.sellerId, sellerId), eq(payouts.status, 'pending')))

    // Get reviews
    const reviews = await db
      .select()
      .from(sellerReviews)
      .where(eq(sellerReviews.sellerId, sellerId))
      .orderBy(desc(sellerReviews.createdAt))
      .limit(5)

    return {
      success: true,
      seller: sellerProfile[0],
      stats: {
        totalListings: sellerListings.length,
        activeListings: sellerListings.filter((l) => l.status === 'active').length,
        totalSales: sellerProfile[0].totalSales,
        rating: sellerProfile[0].rating,
        totalReviews: sellerProfile[0].totalReviews,
      },
      recentSales,
      pendingPayouts,
      reviews,
    }
  } catch (error) {
    console.error('[v0] Get seller dashboard error:', error)
    return { success: false, error: 'Failed to load dashboard' }
  }
}

/**
 * Get buyer purchase history
 */
export async function getBuyerOrders() {
  const session = await auth.api.getSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const buyerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))

    const ordersWithItems = await Promise.all(
      buyerOrders.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
        const reviews = await db
          .select()
          .from(listingReviews)
          .where(eq(listingReviews.orderId, order.id))

        return {
          ...order,
          items,
          reviewed: reviews.length > 0,
        }
      })
    )

    return { success: true, orders: ordersWithItems }
  } catch (error) {
    console.error('[v0] Get buyer orders error:', error)
    return { success: false, error: 'Failed to load orders' }
  }
}

/**
 * Submit a review for a purchase
 */
export async function submitReview(data: {
  orderId: string
  sellerId: string
  listingId: string
  rating: number
  title?: string
  comment?: string
}) {
  const session = await auth.api.getSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  if (data.rating < 1 || data.rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5' }
  }

  try {
    // Create seller review
    const sellerReviewId = `sreview_${Date.now()}`
    await db.insert(sellerReviews).values({
      id: sellerReviewId,
      sellerId: data.sellerId,
      buyerId: session.user.id,
      orderId: data.orderId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      verified: true,
    })

    // Create listing review
    const listingReviewId = `lreview_${Date.now()}`
    await db.insert(listingReviews).values({
      id: listingReviewId,
      listingId: data.listingId,
      buyerId: session.user.id,
      orderId: data.orderId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      verified: true,
    })

    return { success: true }
  } catch (error) {
    console.error('[v0] Submit review error:', error)
    return { success: false, error: 'Failed to submit review' }
  }
}
