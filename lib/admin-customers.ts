import "server-only"
import { pool } from "@/lib/db"

/**
 * One row per customer, built from orders and quote requests. People are
 * matched by email, or by phone digits when there is no email, so a shopper
 * who asked for a quote and later ordered shows up once with both histories.
 */

export interface CustomerSummary {
  key: string
  name: string
  email: string | null
  phone: string | null
  orders: number
  paidTotal: number
  quotes: number
  quotesWon: number
  lastActivity: string | null
}

const PAID_STATUSES = ["paid", "shipped", "delivered"]

export async function listCustomers(search?: string, limit = 200): Promise<CustomerSummary[]> {
  const { rows } = await pool.query(
    `WITH o AS (
       SELECT lower(coalesce(nullif(trim(customer_email), ''), regexp_replace(coalesce(customer_phone, ''), '\\D', '', 'g'))) AS key,
              max(customer_name) AS name, max(customer_email) AS email, max(customer_phone) AS phone,
              count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
              coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS paid_total,
              max(createdat::timestamptz) AS last_order
         FROM public.orders GROUP BY 1
     ),
     l AS (
       SELECT lower(coalesce(nullif(trim(email), ''), regexp_replace(coalesce(phone, ''), '\\D', '', 'g'))) AS key,
              max(full_name) AS name, max(email) AS email, max(phone) AS phone,
              count(*)::int AS quotes,
              count(*) FILTER (WHERE status = 'won')::int AS quotes_won,
              max(created_at::timestamptz) AS last_quote
         FROM public.leads GROUP BY 1
     )
     SELECT coalesce(o.key, l.key) AS key,
            coalesce(o.name, l.name) AS name,
            coalesce(o.email, l.email) AS email,
            coalesce(o.phone, l.phone) AS phone,
            coalesce(o.orders, 0) AS orders,
            coalesce(o.paid_total, 0) AS paid_total,
            coalesce(l.quotes, 0) AS quotes,
            coalesce(l.quotes_won, 0) AS quotes_won,
            greatest(o.last_order, l.last_quote) AS last_activity
       FROM o FULL OUTER JOIN l ON o.key = l.key
      WHERE coalesce(o.key, l.key) <> ''
        AND ($2::text IS NULL
             OR coalesce(o.name, l.name) ILIKE $2
             OR coalesce(o.email, l.email) ILIKE $2
             OR coalesce(o.phone, l.phone) ILIKE $2)
      ORDER BY last_activity DESC NULLS LAST
      LIMIT $3`,
    [PAID_STATUSES, search ? `%${search}%` : null, limit],
  )
  return rows.map((r) => ({
    key: String(r.key),
    name: String(r.name ?? ""),
    email: (r.email as string) ?? null,
    phone: (r.phone as string) ?? null,
    orders: Number(r.orders) || 0,
    paidTotal: Number(r.paid_total) || 0,
    quotes: Number(r.quotes) || 0,
    quotesWon: Number(r.quotes_won) || 0,
    lastActivity: r.last_activity instanceof Date ? r.last_activity.toISOString() : r.last_activity ? String(r.last_activity) : null,
  }))
}
