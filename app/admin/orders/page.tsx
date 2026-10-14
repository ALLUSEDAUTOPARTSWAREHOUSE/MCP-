import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin-auth"
import { ORDER_STATUSES, countByStatus, listOrders } from "@/lib/followup"
import { FollowupFilters } from "@/components/admin/followup-filters"
import { OrderCard } from "@/components/admin/order-card"

export const dynamic = "force-dynamic"
export const metadata = { title: "Orders | AUAPW Admin", robots: { index: false } }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  if (!(await getAdminSession())) redirect("/admin/login")

  const { status: rawStatus, q } = await searchParams
  const status = ORDER_STATUSES.find((s) => s === rawStatus)
  const query = q?.trim().slice(0, 100) || undefined
  const [orders, counts] = await Promise.all([listOrders(status, query), countByStatus("orders")])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Orders placed at checkout. No card is collected online — call to confirm fitment and take payment, then
          update the status.
        </p>
      </header>

      <FollowupFilters
        basePath="/admin/orders"
        statuses={ORDER_STATUSES}
        counts={counts}
        activeStatus={status}
        query={query}
        searchPlaceholder="Search order #, name, phone, email…"
      />

      {orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No orders {status ? `with status "${status}"` : "yet"}.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} statuses={ORDER_STATUSES} />
          ))}
        </div>
      )}
    </div>
  )
}
