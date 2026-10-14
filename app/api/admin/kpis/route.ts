import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getDashboardMetrics } from '@/lib/admin-metrics'
import { listFeedFetches } from '@/lib/merchant'
import { listFeedSnapshots } from '@/lib/merchant-health'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Protect the endpoint — admin session required (httpOnly cookie)
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [metrics, snapshots, fetches] = await Promise.all([
      getDashboardMetrics(),
      listFeedSnapshots(1),
      listFeedFetches(1).catch(() => ({ recent: [], lastGoogle: null })),
    ])
    const latest = snapshots[0] ?? null

    return NextResponse.json({
      ...metrics,
      feed: {
        lastGoogleFetch: fetches.lastGoogle,
        snapshotDay: latest?.day ?? null,
        eligible: latest?.eligible ?? null,
        total: latest?.total ?? null,
        alerts: latest?.alerts ?? [],
      },
    })
  } catch (error) {
    console.error('[admin/kpis] query failed:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ message: 'Failed to compute KPIs' }, { status: 500 })
  }
}
