import Link from "next/link"
import { Search } from "lucide-react"

interface FollowupFiltersProps {
  basePath: string
  statuses: readonly string[]
  counts: Record<string, number>
  activeStatus?: string
  query?: string
  searchPlaceholder: string
}

export function FollowupFilters({
  basePath,
  statuses,
  counts,
  activeStatus,
  query,
  searchPlaceholder,
}: FollowupFiltersProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const href = (status?: string) => {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (query) params.set("q", query)
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const tab = (label: string, count: number, status?: string) => {
    const active = (activeStatus ?? "") === (status ?? "")
    return (
      <Link
        key={label}
        href={href(status)}
        aria-current={active ? "page" : undefined}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground"
        }`}
      >
        {label.replace(/_/g, " ")}
        <span className={`rounded-full px-1.5 text-xs ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>{count}</span>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {tab("All", total)}
        {statuses.map((s) => tab(s, counts[s] ?? 0, s))}
      </nav>
      <form action={basePath} className="relative w-full lg:w-80">
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        <label htmlFor="followup-search" className="sr-only">
          Search
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="followup-search"
          name="q"
          defaultValue={query}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
        />
      </form>
    </div>
  )
}
