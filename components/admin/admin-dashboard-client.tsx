'use client'

import { Children, useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  DatabaseZap,
  DollarSign,
  Hourglass,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Trophy,
} from 'lucide-react'
import type { DashboardMetrics } from '@/lib/admin-metrics'
import type { FeedAlert } from '@/lib/merchant-health'
import { StatusBadge } from '@/components/admin/status-badge'

type KpiResponse = DashboardMetrics & {
  feed: {
    lastGoogleFetch: string | null
    snapshotDay: string | null
    eligible: number | null
    total: number | null
    alerts: FeedAlert[]
  }
}

const REFRESH_MS = 60_000

const fetcher = async (url: string): Promise<KpiResponse> => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' })
  if (res.status === 401) {
    throw new Error('unauthorized')
  }
  if (!res.ok) throw new Error(`Failed to load KPIs: ${res.status}`)
  return res.json()
}

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const count = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, word: string) => `${count(n)} ${word}${n === 1 ? '' : 's'}`
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export function AdminDashboardClient() {
  const router = useRouter()
  const [data, setData] = useState<KpiResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setData(await fetcher('/api/admin/kpis'))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, REFRESH_MS)
    return () => clearInterval(interval)
  }, [load])

  // Redirect to login if unauthorized
  useEffect(() => {
    if (error?.message === 'unauthorized') {
      router.push('/admin/login')
    }
  }, [error, router])

  const alerts: FeedAlert[] = data
    ? [
        ...data.feed.alerts,
        ...(data.actions.staleNewQuotes > 0
          ? [
              {
                level: 'warning' as const,
                message: `${plural(data.actions.staleNewQuotes, 'quote request')} waiting over 24 hours for a call-back.`,
              },
            ]
          : []),
        ...(data.actions.stalePendingOrders > 0
          ? [
              {
                level: 'warning' as const,
                message: `${plural(data.actions.stalePendingOrders, 'order')} still pending after 24 hours.`,
              },
            ]
          : []),
      ]
    : []

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live numbers from your orders and quote requests
            {data
              ? ` · updated ${new Date(data.generatedAt).toLocaleTimeString()} · days in ${data.timeZone.replace('_', ' ')} time`
              : ''}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/70"
          aria-label="Refresh numbers"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </header>

      {error && error.message !== 'unauthorized' && (
        <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          The dashboard couldn't load ({error.message}). It retries every minute; Settings → System health shows what is
          misconfigured.
        </div>
      )}

      {data && data.errors.length > 0 && (
        <section
          aria-labelledby="data-errors"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          <h2 id="data-errors" className="mb-2 flex items-center gap-2 font-semibold text-destructive">
            <DatabaseZap className="h-4 w-4" aria-hidden="true" />
            Some numbers couldn't be read from the database
          </h2>
          <ul className="flex flex-col gap-1 text-foreground">
            {data.errors.map((e) => (
              <li key={`${e.section}-${e.message}`}>
                <span className="font-medium">{e.section}:</span> <code className="text-xs">{e.message}</code>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Those cards show 0 until this is fixed.{' '}
            <Link href="/admin/settings" className="text-primary hover:underline">
              Open System health
            </Link>
          </p>
        </section>
      )}

      {alerts.length > 0 && (
        <section aria-labelledby="alerts-heading" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <h2 id="alerts-heading" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Needs attention
          </h2>
          <ul className="flex flex-col gap-1 text-sm">
            {alerts.map((a) => (
              <li key={a.message} className={a.level === 'critical' ? 'text-destructive' : 'text-foreground'}>
                {a.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div role="group" aria-label="Sales" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Paid revenue today"
          value={data ? money(data.today.revenue) : '—'}
          detail={data ? `${plural(data.today.orders, 'order')} placed today` : undefined}
          icon={DollarSign}
        />
        <KpiCard
          label="Last 7 days"
          value={data ? money(data.last7.revenue) : '—'}
          detail={data ? `${plural(data.last7.orders, 'order')} · ${plural(data.last7.quotes, 'quote')}` : undefined}
          icon={CalendarDays}
        />
        <KpiCard
          label="Last 30 days"
          value={data ? money(data.last30.revenue) : '—'}
          detail={
            data ? `Avg paid order ${data.last30.paidOrders ? money(data.last30.averageOrderValue) : '—'}` : undefined
          }
          icon={ShoppingCart}
        />
        <KpiCard
          label="Awaiting payment"
          value={data ? money(data.awaitingPayment.amount) : '—'}
          detail={data ? `${plural(data.awaitingPayment.orders, 'confirmed order')} not yet paid` : undefined}
          href="/admin/orders?status=confirmed"
          icon={Hourglass}
        />
      </div>

      <div role="group" aria-label="Follow-up" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Quotes to call"
          value={data ? count(data.actions.newQuotes) : '—'}
          detail={data ? `${count(data.actions.openQuotes)} open · ${count(data.today.quotes)} new today` : undefined}
          href="/admin/quotes?status=new"
          icon={ClipboardList}
        />
        <KpiCard
          label="Orders to confirm"
          value={data ? count(data.actions.pendingOrders + data.actions.reservedOrders) : '—'}
          detail={
            data ? `${count(data.actions.pendingOrders)} pending · ${count(data.actions.reservedOrders)} reserved` : undefined
          }
          href="/admin/orders?status=pending"
          icon={ShoppingCart}
        />
        <KpiCard
          label="Quote win rate (30 days)"
          value={
            data ? (data.last30.quoteWinRate === null ? '—' : `${Math.round(data.last30.quoteWinRate * 100)}%`) : '—'
          }
          detail="Won ÷ (won + lost)"
          icon={Trophy}
        />
        <KpiCard
          label="Products in Google feed"
          value={data?.feed.eligible != null ? count(data.feed.eligible) : '—'}
          detail={
            data
              ? data.feed.lastGoogleFetch
                ? `Google fetched ${when(data.feed.lastGoogleFetch)}`
                : 'Google has not fetched the feed yet'
              : undefined
          }
          href="/admin/merchant"
          icon={ShoppingBag}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section aria-labelledby="trend-heading" className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <h2 id="trend-heading" className="mb-4 text-lg font-semibold text-foreground">
            Last 14 days
          </h2>
          {data ? <DailyChart daily={data.daily} /> : <p className="text-sm text-muted-foreground">Loading…</p>}
        </section>

        <section aria-labelledby="makes-heading" className="rounded-lg border border-border bg-card p-5">
          <h2 id="makes-heading" className="text-lg font-semibold text-foreground">
            Most requested makes
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">Quote requests, last 30 days</p>
          {data && data.topMakes.length === 0 && <p className="text-sm text-muted-foreground">No quote requests yet.</p>}
          <ul className="space-y-2 text-sm">
            {data?.topMakes.map((m) => (
              <li key={m.make} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-foreground">{m.make}</span>
                <span className="h-2 flex-1 rounded-full bg-muted" aria-hidden="true">
                  <span
                    className="block h-2 rounded-full bg-primary"
                    style={{ width: `${(m.count / data.topMakes[0].count) * 100}%` }}
                  />
                </span>
                <span className="w-8 text-right font-semibold tabular-nums text-foreground">{m.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListCard title="Recent orders" href="/admin/orders" linkLabel="All orders" empty="No orders yet." loading={!data}>
          {data?.recentOrders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders?q=${encodeURIComponent(o.orderNumber)}`}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm hover:bg-muted/40"
            >
              <span className="min-w-0">
                <span className="block font-mono text-foreground">{o.orderNumber}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {o.customerName || 'Guest'} · {when(o.createdAt)}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                <span className="font-semibold tabular-nums text-foreground">{money(o.amount)}</span>
              </span>
            </Link>
          ))}
        </ListCard>

        <ListCard
          title="Recent quote requests"
          href="/admin/quotes"
          linkLabel="All quotes"
          empty="No quote requests yet."
          loading={!data}
        >
          {data?.recentQuotes.map((q) => (
            <Link
              key={q.id}
              href={`/admin/quotes?q=${encodeURIComponent(q.name)}`}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm hover:bg-muted/40"
            >
              <span className="min-w-0">
                <span className="block truncate text-foreground">
                  {q.vehicle || 'Vehicle not given'} <span className="capitalize text-muted-foreground">{q.partType}</span>
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {q.name} · {when(q.createdAt)}
                </span>
              </span>
              <StatusBadge status={q.status} />
            </Link>
          ))}
        </ListCard>
      </div>

      <section aria-labelledby="lifetime-heading" className="rounded-lg border border-border bg-card p-5">
        <h2 id="lifetime-heading" className="mb-3 text-lg font-semibold text-foreground">
          All time
        </h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <Stat label="Paid revenue" value={data ? money(data.lifetime.revenue) : '—'} />
          <Stat label="Orders" value={data ? count(data.lifetime.orders) : '—'} />
          <Stat label="Quote requests" value={data ? count(data.lifetime.quotes) : '—'} />
        </dl>
      </section>
    </div>
  )
}

function DailyChart({ daily }: { daily: KpiResponse['daily'] }) {
  if (daily.length === 0) return <p className="text-sm text-muted-foreground">No data for the chart.</p>
  const maxRevenue = Math.max(...daily.map((d) => d.revenue), 1)
  const maxQuotes = Math.max(...daily.map((d) => d.quotes), 1)
  const label = (day: string) =>
    new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

  return (
    <div>
      <div className="flex h-40 items-end gap-1" aria-hidden="true">
        {daily.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 items-end justify-center gap-0.5"
            title={`${label(d.day)}: ${money(d.revenue)} paid · ${plural(d.orders, 'order')} · ${plural(d.quotes, 'quote')}`}
          >
            <span className="w-1/2 rounded-t bg-primary" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
            <span className="w-1/3 rounded-t bg-sky-500/70" style={{ height: `${(d.quotes / maxQuotes) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground" aria-hidden="true">
        {daily.map((d, i) => (
          <span key={d.day} className="flex-1 text-center">
            {i % 2 === 0 ? label(d.day) : ''}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Paid revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500/70" /> Quote requests
        </span>
      </div>
      <table className="sr-only">
        <caption>Paid revenue, orders and quote requests per day</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Paid revenue</th>
            <th scope="col">Orders</th>
            <th scope="col">Quote requests</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((d) => (
            <tr key={d.day}>
              <td>{label(d.day)}</td>
              <td>{money(d.revenue)}</td>
              <td>{d.orders}</td>
              <td>{d.quotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KpiCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string
  value: string
  detail?: string
  href?: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}) {
  const body = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </>
  )
  return href ? (
    <Link href={href} className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
      {body}
    </Link>
  ) : (
    <div className="rounded-lg border border-border bg-card p-5">{body}</div>
  )
}

function ListCard({
  title,
  href,
  linkLabel,
  empty,
  loading,
  children,
}: {
  title: string
  href: string
  linkLabel: string
  empty: string
  loading: boolean
  children?: ReactNode
}) {
  const hasRows = Children.count(children) > 0
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Link href={href} className="text-sm text-primary hover:underline">
          {linkLabel}
        </Link>
      </div>
      {loading ? (
        <p className="py-3 text-sm text-muted-foreground">Loading…</p>
      ) : hasRows ? (
        <div className="divide-y divide-border">{children}</div>
      ) : (
        <p className="py-3 text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 sm:flex-col sm:items-start">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}
