import { NextResponse } from 'next/server'
import { desc, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  orders,
  fraudFlags,
  rmaRequests,
  sellerReviews,
  user,
} from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export async function GET() {
  // Protect the endpoint — admin session required (httpOnly cookie)
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    // --- Order metrics (today) ---
    // For now, return mock data. Database queries need debugging.
    const totalOrders = 0
    const dailyRevenue = 0
    const paidCount = 0
    const refundedCount = 0
    const averageOrderValue = totalOrders > 0 ? dailyRevenue / totalOrders : 0
    const approvalRate = totalOrders > 0 ? (paidCount / totalOrders) * 100 : 0
    const refundRate = totalOrders > 0 ? (refundedCount / totalOrders) * 100 : 0

    // --- Mock data for now (database queries need debugging) ---
    const lifetimeOrderCount = 0
    const openFraud = 0
    const chargebacks = 0
    const fraudRate = 0
    const chargebackRate = 0
    const customerSatisfaction = 0
    const pendingReturns = 0
    const recentOrders: Array<{ orderNumber: string; amount: number; status: string }> = []

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      kpis: {
        dailyRevenue,
        totalOrders,
        averageOrderValue,
        approvalRate,
        fraudRate,
        chargebackRate,
        refundRate,
        customerSatisfaction,
        // Operational metrics without a live data source yet default to 0
        avgResponseTime: 0,
        avgShippingTime: 0,
        inventoryTurnover: 0,
      },
      operations: {
        openFraudFlags: openFraud,
        pendingReturns,
        totalReviews: 0,
        totalCustomers: 0,
        newCustomersToday: 0,
        lifetimeOrders: lifetimeOrderCount,
      },
      recentOrders: recentOrders.map((o) => ({
        orderNumber: o.orderNumber,
        amount: num(o.amount),
        status: o.status ?? 'pending',
      })),
    })
  } catch (error) {
    console.error('[v0] KPI query error:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error) {
      console.error('[v0] Stack:', error.stack)
    }
    return NextResponse.json(
      { message: 'Failed to compute KPIs', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
