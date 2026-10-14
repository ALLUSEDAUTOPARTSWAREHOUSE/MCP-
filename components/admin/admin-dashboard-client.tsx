'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Users,
  Clock,
  RotateCcw,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react'

interface KpiResponse {
  generatedAt: string
  kpis: {
    dailyRevenue: number
    totalOrders: number
    averageOrderValue: number
    approvalRate: number
    fraudRate: number
    chargebackRate: number
    refundRate: number
    customerSatisfaction: number
    avgResponseTime: number
    avgShippingTime: number
    inventoryTurnover: number
  }
  operations: {
    openFraudFlags: number
    pendingReturns: number
    totalReviews: number
    totalCustomers: number
    newCustomersToday: number
    lifetimeOrders: number
  }
  recentOrders: { orderNumber: string; amount: number; status: string }[]
}

const fetcher = async (url: string): Promise<KpiResponse> => {
  const res = await fetch(url, { credentials: 'include' })
  if (res.status === 401) {
    throw new Error('unauthorized')
  }
  if (!res.ok) throw new Error(`Failed to load KPIs: ${res.status}`)
  return res.json()
}

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function AdminDashboardClient({ adminEmail }: { adminEmail: string }) {
  const router = useRouter()

  const { data, error, isLoading, mutate, isValidating } = useSWR<KpiResponse>(
    '/api/admin/kpis',
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  )

  // Redirect to login if the session expired (only in effect, not during render)
  useEffect(() => {
    if (error?.message === 'unauthorized') {
      router.push('/admin/login')
    }
  }, [error, router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
    router.refresh()
  }

  const k = data?.kpis
  const ops = data?.operations

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              AUAPW Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-semibold">{adminEmail}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => mutate()}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/70 rounded-lg transition-colors"
              aria-label="Refresh KPIs"
            >
              <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-full px-6 py-8">
        {error && error.message !== 'unauthorized' && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6 text-sm">
            Failed to load live KPIs. The dashboard will retry automatically.
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Live KPIs {data ? `— updated ${new Date(data.generatedAt).toLocaleTimeString()}` : ''}
          </p>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        </div>

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard
            label="Daily Revenue"
            value={k ? money(k.dailyRevenue) : '—'}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Orders Today"
            value={k ? String(k.totalOrders) : '—'}
            icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Avg Order Value"
            value={k ? money(k.averageOrderValue) : '—'}
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Approval Rate"
            value={k ? `${k.approvalRate.toFixed(1)}%` : '—'}
            icon={<CheckCircle className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Fraud Rate"
            value={k ? `${k.fraudRate.toFixed(1)}%` : '—'}
            icon={<AlertTriangle className="w-5 h-5 text-primary" />}
          />
        </div>

        {/* Secondary KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SmallStat
            label="Chargeback Rate"
            value={k ? `${k.chargebackRate.toFixed(2)}%` : '—'}
            icon={<ShieldAlert className="w-4 h-4 text-destructive" />}
          />
          <SmallStat
            label="Refund Rate"
            value={k ? `${k.refundRate.toFixed(1)}%` : '—'}
            icon={<RotateCcw className="w-4 h-4 text-primary" />}
          />
          <SmallStat
            label="Satisfaction"
            value={k ? `${k.customerSatisfaction.toFixed(1)}/5.0` : '—'}
            icon={<Users className="w-4 h-4 text-primary" />}
          />
          <SmallStat
            label="Avg Response Time"
            value={k ? `${k.avgResponseTime.toFixed(1)}h` : '—'}
            icon={<Clock className="w-4 h-4 text-primary" />}
          />
        </div>

        {/* Operations + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-foreground mb-4">Operations</h2>
            <ul className="space-y-3 text-sm">
              <OpRow label="Open Fraud Flags" value={ops?.openFraudFlags ?? 0} />
              <OpRow label="Pending Returns" value={ops?.pendingReturns ?? 0} />
              <OpRow label="Total Customers" value={ops?.totalCustomers ?? 0} />
              <OpRow label="New Customers Today" value={ops?.newCustomersToday ?? 0} />
              <OpRow label="Lifetime Orders" value={ops?.lifetimeOrders ?? 0} />
              <OpRow label="Total Reviews" value={ops?.totalReviews ?? 0} />
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h2>
            {data && data.recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
            <div className="divide-y divide-border">
              {data?.recentOrders.map((o) => (
                <div
                  key={o.orderNumber}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-mono text-foreground">{o.orderNumber}</span>
                  <span className="text-muted-foreground capitalize">{o.status}</span>
                  <span className="font-semibold text-foreground">{money(o.amount)}</span>
                </div>
              ))}
              {!data && (
                <p className="py-3 text-sm text-muted-foreground">Loading orders…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function SmallStat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function OpRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
    </li>
  )
}
