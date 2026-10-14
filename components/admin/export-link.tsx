import { Download } from "lucide-react"

/** Downloads the list the admin is looking at (same status and search filters) as a CSV file. */
export function ExportLink({ kind, status, query }: { kind: "orders" | "quotes" | "customers"; status?: string; query?: string }) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (query) params.set("q", query)
  const qs = params.toString()
  return (
    <a
      href={`/api/admin/export/${kind}${qs ? `?${qs}` : ""}`}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Download CSV
    </a>
  )
}
