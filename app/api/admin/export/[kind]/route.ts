import { getAdminSession } from "@/lib/admin-auth"
import { listCustomers } from "@/lib/admin-customers"
import { ORDER_STATUSES, QUOTE_STATUSES, listOrders, listQuoteLeads } from "@/lib/followup"

export const dynamic = "force-dynamic"

const MAX_ROWS = 5000

/**
 * CSV cell. Text starting with = + - @ (even after leading spaces, which some
 * spreadsheets ignore) is prefixed with ' so it never runs as a formula.
 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : ""
  let s = String(value)
  if (/^[\s\uFEFF\xA0]*[=+\-@]/.test(s) || /^[\t\r]/.test(s)) s = `'${s}`
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const csv = (header: string[], rows: unknown[][]) =>
  [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n"

/** GET /api/admin/export/orders|quotes|customers?status=&q= — the same filters as the admin lists. */
export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  if (!(await getAdminSession())) return new Response("Unauthorized", { status: 401 })

  const { kind } = await params
  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim().slice(0, 100) || undefined
  const rawStatus = url.searchParams.get("status") ?? undefined
  let body: string

  if (kind === "orders") {
    const status = ORDER_STATUSES.find((s) => s === rawStatus)
    const orders = await listOrders(status, q, MAX_ROWS)
    body = csv(
      ["Order #", "Date", "Status", "Customer", "Email", "Phone", "Ship to", "Items", "Subtotal", "Tax", "Shipping", "Total", "Payment", "Customer notes", "Internal notes"],
      orders.map((o) => [
        o.orderNumber,
        o.createdAt,
        o.status,
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.shippingAddress,
        o.items.map((l) => `${l.quantity} x ${l.name}`).join("; "),
        o.subtotal,
        o.tax,
        o.shippingCost,
        o.totalAmount,
        o.paymentGateway,
        o.customerNotes,
        o.internalNotes,
      ]),
    )
  } else if (kind === "quotes") {
    const status = QUOTE_STATUSES.find((s) => s === rawStatus)
    const leads = await listQuoteLeads(status, q, MAX_ROWS)
    body = csv(
      ["Quote #", "Date", "Status", "Name", "Phone", "Email", "Part", "Year", "Make", "Model", "Option", "State", "ZIP", "Quoted price", "Customer notes", "Internal notes", "Source"],
      leads.map((l) => [
        l.id,
        l.createdAt,
        l.status,
        l.fullName,
        l.phone,
        l.email,
        l.partType,
        l.year,
        l.make,
        l.model,
        l.partOption,
        l.state,
        l.zip,
        l.quoteAmount,
        l.notes,
        l.internalNotes,
        l.source,
      ]),
    )
  } else if (kind === "customers") {
    const customers = await listCustomers(q, MAX_ROWS)
    body = csv(
      ["Name", "Email", "Phone", "Orders", "Paid total", "Quote requests", "Quotes won", "Last activity"],
      customers.map((c) => [c.name, c.email, c.phone, c.orders, c.paidTotal, c.quotes, c.quotesWon, c.lastActivity]),
    )
  } else {
    return new Response("Unknown export", { status: 404 })
  }

  const day = new Date().toISOString().slice(0, 10)
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="auapw-${kind}-${day}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
