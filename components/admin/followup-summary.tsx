import Link from "next/link"
import { ArrowRight, ClipboardList, Package } from "lucide-react"
import { countByStatus } from "@/lib/followup"

export async function FollowupSummary() {
  const [quotes, orders] = await Promise.all([countByStatus("leads"), countByStatus("orders")])
  const cards = [
    {
      href: "/admin/quotes?status=new",
      icon: ClipboardList,
      label: "New quotes to call",
      value: quotes.new ?? 0,
      detail: `${quotes.contacted ?? 0} contacted · ${quotes.quoted ?? 0} quoted`,
    },
    {
      href: "/admin/orders?status=pending",
      icon: Package,
      label: "Orders awaiting confirmation",
      value: orders.pending ?? 0,
      detail: `${orders.confirmed ?? 0} confirmed · ${orders.paid ?? 0} paid · ${orders.shipped ?? 0} shipped`,
    },
  ]

  return (
    <section aria-label="Customer follow-up" className="mb-8 grid gap-4 md:grid-cols-2">
      {cards.map(({ href, icon: Icon, label, value, detail }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <span className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm text-muted-foreground">{label}</span>
            <span className="block text-3xl font-bold text-foreground">{value}</span>
            <span className="block text-xs text-muted-foreground">{detail}</span>
          </span>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ))}
    </section>
  )
}
