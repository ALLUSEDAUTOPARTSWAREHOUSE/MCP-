"use client"

import { useMemo, useState, useTransition } from "react"
import { ProductFixCard, type ProductFixCardProps } from "./product-fix-card"
import { bulkSetExcludeFromFeed } from "@/app/admin/merchant-actions"

const cardKey = (c: Pick<ProductFixCardProps, "brand" | "slug">) => `${c.brand}/${c.slug}`

/**
 * Wraps the list of ProductFixCards with checkboxes so an admin can select
 * several pages at once and bulk-toggle "Exclude from Google" without
 * opening each page's edit form individually.
 */
export function FixPagesList({ cards }: { cards: ProductFixCardProps[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const allKeys = useMemo(() => cards.map(cardKey), [cards])
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k))

  const toggleOne = (k: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(allKeys))
  }

  const runBulk = (exclude: boolean) => {
    const items = cards.filter((c) => selected.has(cardKey(c))).map((c) => ({ brand: c.brand, slug: c.slug }))
    if (items.length === 0) return
    startTransition(async () => {
      const res = await bulkSetExcludeFromFeed(items, exclude)
      setMessage(res.message)
      if (res.ok) setSelected(new Set())
    })
  }

  if (cards.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-primary"
            aria-label="Select all pages on this page"
          />
          Select all ({cards.length})
        </label>
        <span className="text-xs text-muted-foreground">{selected.size} selected</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            disabled={selected.size === 0 || isPending}
            onClick={() => runBulk(true)}
            className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-amber-400"
          >
            {isPending ? "Saving…" : "Exclude selected from Google"}
          </button>
          <button
            type="button"
            disabled={selected.size === 0 || isPending}
            onClick={() => runBulk(false)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Include selected in Google"}
          </button>
        </div>
      </div>

      {message && (
        <p role="status" className="text-xs text-muted-foreground">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {cards.map((c) => {
          const k = cardKey(c)
          return (
            <div key={k} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.has(k)}
                onChange={() => toggleOne(k)}
                className="mt-7 h-4 w-4 shrink-0 accent-primary"
                aria-label={`Select ${c.sheetName}`}
              />
              <div className="min-w-0 flex-1">
                <ProductFixCard {...c} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
