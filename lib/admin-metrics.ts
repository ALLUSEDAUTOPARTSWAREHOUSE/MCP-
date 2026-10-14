import "server-only"
import { pool } from "@/lib/db"

/**
 * Real sales and follow-up numbers for the admin dashboard and the daily
 * report email, read straight from public.orders and public.leads (the tables
 * the checkout and quote forms write to). Days are counted in the business's
 * own time zone so "today" matches the phone line's day.
 *
 * Every query runs on its own: if one table or column is missing, that
 * section reports the database error and the rest of the dashboard still
 * loads, instead of the whole page going blank.
 */

export const BUSINESS_TIME_ZONE = "America/Chicago"

// Statuses where the customer has actually paid. "confirmed" means fitment is
// confirmed but payment is still owed, so it counts as awaiting payment.
const PAID_STATUSES = ["paid", "shipped", "delivered"]
const OPEN_QUOTE_STATUSES = ["new", "contacted", "quoted"]
const STALE_HOURS = 24

export interface PeriodTotals {
  orders: number
  paidOrders: number
  revenue: number
  quotes: number
}

export interface DailyPoint extends PeriodTotals {
  day: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string | null
  status: string
  amount: number
  createdAt: string
}

export interface RecentQuote {
  id: number
  name: string
  vehicle: string
  partType: string
  status: string
  createdAt: string
}

export interface MetricError {
  section: string
  message: string
}

export interface DashboardMetrics {
  generatedAt: string
  timeZone: string
  today: PeriodTotals
  yesterday: PeriodTotals
  last7: PeriodTotals
  last30: PeriodTotals & { averageOrderValue: number; quoteWinRate: number | null }
  lifetime: { orders: number; revenue: number; quotes: number }
  awaitingPayment: { orders: number; amount: number }
  actions: {
    newQuotes: number
    staleNewQuotes: number
    openQuotes: number
    pendingOrders: number
    stalePendingOrders: number
    reservedOrders: number
    unpaidConfirmedOrders: number
  }
  daily: DailyPoint[]
  topMakes: { make: string; count: number }[]
  recentOrders: RecentOrder[]
  recentQuotes: RecentQuote[]
  /** Sections that could not be read, with the database's own error message. */
  errors: MetricError[]
}

const n = (v: unknown) => {
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v))

/** Midnight in the business time zone, `daysAgo` days back, as an SQL expression. */
const dayStart = (daysAgo: number) =>
  `(date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}') - interval '${daysAgo} days') AT TIME ZONE '${BUSINESS_TIME_ZONE}'`

async function attempt<T>(errors: MetricError[], section: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!errors.some((e) => e.section === section && e.message === message)) errors.push({ section, message })
    console.error(`[admin-metrics] ${section} failed:`, message)
    return fallback
  }
}

async function periodTotals(errors: MetricError[], fromDaysAgo: number, toDaysAgo: number | null): Promise<PeriodTotals> {
  const upper = toDaysAgo === null ? "now()" : dayStart(toDaysAgo)
  const [orders, quotes] = await Promise.all([
    attempt(
      errors,
      "Orders",
      async () => {
        const { rows } = await pool.query(
          `SELECT count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
                  count(*) FILTER (WHERE status = ANY($1))::int AS paid_orders,
                  coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS revenue
             FROM public.orders
            WHERE createdat >= ${dayStart(fromDaysAgo)} AND createdat < ${upper}`,
          [PAID_STATUSES],
        )
        return { orders: n(rows[0]?.orders), paidOrders: n(rows[0]?.paid_orders), revenue: n(rows[0]?.revenue) }
      },
      { orders: 0, paidOrders: 0, revenue: 0 },
    ),
    attempt(
      errors,
      "Quote requests",
      async () => {
        const { rows } = await pool.query(
          `SELECT count(*)::int AS quotes FROM public.leads
            WHERE created_at >= ${dayStart(fromDaysAgo)} AND created_at < ${upper}`,
        )
        return n(rows[0]?.quotes)
      },
      0,
    ),
  ])
  return { ...orders, quotes }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const errors: MetricError[] = []

  const [today, yesterday, last7, last30, lifetime, awaiting, outcomes, orderActions, quoteActions, daily, topMakes, recentOrders, recentQuotes] =
    await Promise.all([
      periodTotals(errors, 0, null),
      periodTotals(errors, 1, 0),
      periodTotals(errors, 6, null),
      periodTotals(errors, 29, null),
      attempt(
        errors,
        "Orders",
        async () => {
          const [o, l] = await Promise.all([
            pool.query(
              `SELECT count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
                      coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS revenue
                 FROM public.orders`,
              [PAID_STATUSES],
            ),
            pool.query(`SELECT count(*)::int AS quotes FROM public.leads`).catch(() => ({ rows: [{ quotes: 0 }] })),
          ])
          return { orders: n(o.rows[0]?.orders), revenue: n(o.rows[0]?.revenue), quotes: n(l.rows[0]?.quotes) }
        },
        { orders: 0, revenue: 0, quotes: 0 },
      ),
      attempt(
        errors,
        "Orders",
        async () => {
          const { rows } = await pool.query(
            `SELECT count(*)::int AS orders, coalesce(sum(totalamount), 0) AS amount
               FROM public.orders WHERE status = 'confirmed'`,
          )
          return { orders: n(rows[0]?.orders), amount: n(rows[0]?.amount) }
        },
        { orders: 0, amount: 0 },
      ),
      attempt(
        errors,
        "Quote requests",
        async () => {
          const { rows } = await pool.query(
            `SELECT count(*) FILTER (WHERE status = 'won')::int AS won,
                    count(*) FILTER (WHERE status = 'lost')::int AS lost
               FROM public.leads WHERE created_at >= ${dayStart(29)}`,
          )
          return { won: n(rows[0]?.won), lost: n(rows[0]?.lost) }
        },
        { won: 0, lost: 0 },
      ),
      attempt(
        errors,
        "Orders",
        async () => {
          const { rows } = await pool.query(
            `SELECT count(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
                    count(*) FILTER (WHERE status = 'pending' AND createdat < now() - interval '${STALE_HOURS} hours')::int AS stale_pending_orders,
                    count(*) FILTER (WHERE status = 'reserved_pending_fitment')::int AS reserved_orders,
                    count(*) FILTER (WHERE status = 'confirmed')::int AS unpaid_confirmed_orders
               FROM public.orders`,
          )
          return rows[0] ?? {}
        },
        {} as Record<string, unknown>,
      ),
      attempt(
        errors,
        "Quote requests",
        async () => {
          const { rows } = await pool.query(
            `SELECT count(*) FILTER (WHERE status = 'new')::int AS new_quotes,
                    count(*) FILTER (WHERE status = 'new' AND created_at < now() - interval '${STALE_HOURS} hours')::int AS stale_new_quotes,
                    count(*) FILTER (WHERE status = ANY($1))::int AS open_quotes
               FROM public.leads`,
            [OPEN_QUOTE_STATUSES],
          )
          return rows[0] ?? {}
        },
        {} as Record<string, unknown>,
      ),
      attempt(
        errors,
        "14-day chart",
        async () => {
          const { rows } = await pool.query(
            `WITH days AS (
               SELECT generate_series(
                 date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}') - interval '13 days',
                 date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}'),
                 interval '1 day'
               ) AS day
             ),
             o AS (
               SELECT date_trunc('day', createdat::timestamptz AT TIME ZONE '${BUSINESS_TIME_ZONE}') AS day,
                      count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
                      count(*) FILTER (WHERE status = ANY($1))::int AS paid_orders,
                      coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS revenue
                 FROM public.orders WHERE createdat >= ${dayStart(13)} GROUP BY 1
             ),
             l AS (
               SELECT date_trunc('day', created_at::timestamptz AT TIME ZONE '${BUSINESS_TIME_ZONE}') AS day,
                      count(*)::int AS quotes
                 FROM public.leads WHERE created_at >= ${dayStart(13)} GROUP BY 1
             )
             SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
                    coalesce(o.orders, 0) AS orders, coalesce(o.paid_orders, 0) AS paid_orders,
                    coalesce(o.revenue, 0) AS revenue, coalesce(l.quotes, 0) AS quotes
               FROM days LEFT JOIN o ON o.day = days.day LEFT JOIN l ON l.day = days.day
              ORDER BY days.day`,
            [PAID_STATUSES],
          )
          return rows.map((r) => ({
            day: String(r.day),
            orders: n(r.orders),
            paidOrders: n(r.paid_orders),
            revenue: n(r.revenue),
            quotes: n(r.quotes),
          }))
        },
        [] as DailyPoint[],
      ),
      attempt(
        errors,
        "Quote requests",
        async () => {
          const { rows } = await pool.query(
            `SELECT initcap(lower(trim(make))) AS make, count(*)::int AS count
               FROM public.leads
              WHERE created_at >= ${dayStart(29)} AND coalesce(trim(make), '') <> ''
              GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 8`,
          )
          return rows.map((r) => ({ make: String(r.make), count: n(r.count) }))
        },
        [] as { make: string; count: number }[],
      ),
      attempt(
        errors,
        "Orders",
        async () => {
          const { rows } = await pool.query(
            `SELECT id, ordernumber, customer_name, status, totalamount, createdat
               FROM public.orders ORDER BY createdat DESC LIMIT 8`,
          )
          return rows.map((r) => ({
            id: String(r.id),
            orderNumber: String(r.ordernumber),
            customerName: (r.customer_name as string) ?? null,
            status: String(r.status ?? "pending"),
            amount: n(r.totalamount),
            createdAt: iso(r.createdat),
          }))
        },
        [] as RecentOrder[],
      ),
      attempt(
        errors,
        "Quote requests",
        async () => {
          const { rows } = await pool.query(
            `SELECT id, full_name, year, make, model, part_type, status, created_at
               FROM public.leads ORDER BY created_at DESC LIMIT 8`,
          )
          return rows.map((r) => ({
            id: n(r.id),
            name: String(r.full_name ?? ""),
            vehicle: [r.year, r.make, r.model].filter(Boolean).join(" "),
            partType: String(r.part_type ?? ""),
            status: String(r.status ?? "new"),
            createdAt: iso(r.created_at),
          }))
        },
        [] as RecentQuote[],
      ),
    ])

  const { won, lost } = outcomes
  const o = orderActions as Record<string, unknown>
  const q = quoteActions as Record<string, unknown>

  return {
    generatedAt: new Date().toISOString(),
    timeZone: BUSINESS_TIME_ZONE,
    today,
    yesterday,
    last7,
    last30: {
      ...last30,
      averageOrderValue: last30.paidOrders > 0 ? last30.revenue / last30.paidOrders : 0,
      quoteWinRate: won + lost > 0 ? won / (won + lost) : null,
    },
    lifetime,
    awaitingPayment: awaiting,
    actions: {
      newQuotes: n(q.new_quotes),
      staleNewQuotes: n(q.stale_new_quotes),
      openQuotes: n(q.open_quotes),
      pendingOrders: n(o.pending_orders),
      stalePendingOrders: n(o.stale_pending_orders),
      reservedOrders: n(o.reserved_orders),
      unpaidConfirmedOrders: n(o.unpaid_confirmed_orders),
    },
    daily,
    topMakes,
    recentOrders,
    recentQuotes,
    errors,
  }
}
