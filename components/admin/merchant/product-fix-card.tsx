"use client"

import { useActionState } from "react"
import { ExternalLink } from "lucide-react"
import { updateProductFix, type MerchantActionState } from "@/app/admin/merchant-actions"

const initial: MerchantActionState = { ok: false, message: "" }

const inputClass = "rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
const labelClass = "flex flex-col gap-1 text-xs font-medium text-muted-foreground"

export interface ProductFixCardProps {
  brand: string
  brandLabel: string
  slug: string
  pagePath: string
  sheetName: string
  sheetPrice: number | null
  sheetDescription: string
  imageUrl: string
  livePrice: number | null
  issues: { code: string; label: string }[]
  override: {
    title: string | null
    description: string | null
    price: number | null
    imageUrl: string | null
    availability: string | null
    hidden: boolean
    excludeFromFeed: boolean
    notes: string | null
    updatedAt: string
  } | null
}

export function ProductFixCard(props: ProductFixCardProps) {
  const [state, action, pending] = useActionState(updateProductFix, initial)
  const o = props.override

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex min-w-0 flex-1 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied hosts */}
          <img
            src={props.imageUrl}
            alt=""
            className="h-20 w-24 shrink-0 rounded-md border border-border bg-muted object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{props.brandLabel}</span>
              {o && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">
                  Edited {new Date(o.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </span>
              )}
              <span>
                Live price: {props.livePrice === null ? "Quote only" : `$${props.livePrice.toLocaleString()}`}
              </span>
            </div>
            <h2 className="text-pretty font-semibold text-foreground">{o?.title || props.sheetName}</h2>
            <p className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
              <span className="shrink-0 font-medium text-foreground/80">Image URL:</span>
              <span className="truncate" title={props.imageUrl}>
                {props.imageUrl}
              </span>
            </p>
            <a
              href={props.pagePath}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View page <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            {props.issues.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Issues">
                {props.issues.map((issue) => (
                  <li
                    key={issue.code}
                    className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400"
                  >
                    {issue.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Re-keyed on save/reset so the inputs pick up the stored values. */}
        <form key={o?.updatedAt ?? "sheet"} action={action} className="flex w-full flex-col gap-3 lg:w-[28rem]">
          <input type="hidden" name="brand" value={props.brand} />
          <input type="hidden" name="slug" value={props.slug} />
          <label className={labelClass}>
            Title (max 150)
            <input name="title" maxLength={150} defaultValue={o?.title ?? ""} placeholder={props.sheetName} className={inputClass} />
          </label>
          <label className={labelClass}>
            Description
            <textarea
              name="description"
              rows={3}
              maxLength={5000}
              defaultValue={o?.description ?? ""}
              placeholder={props.sheetDescription || "Add a description for Google Shopping"}
              className={`${inputClass} resize-y`}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              Price ($)
              <input
                name="price"
                type="number"
                min="1"
                step="0.01"
                inputMode="decimal"
                defaultValue={o?.price ?? ""}
                placeholder={props.sheetPrice === null ? "Quote only" : String(props.sheetPrice)}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Availability
              <select name="availability" defaultValue={o?.availability ?? ""} className={inputClass}>
                <option value="">In stock (default)</option>
                <option value="in_stock">In stock</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="backorder">Backorder</option>
              </select>
            </label>
          </div>
          <label className={labelClass}>
            Image URL (https)
            <input
              name="imageUrl"
              type="url"
              defaultValue={o?.imageUrl ?? ""}
              placeholder="https://… real photo of this part"
              className={inputClass}
            />
          </label>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="excludeFromFeed" defaultChecked={o?.excludeFromFeed} className="h-4 w-4 accent-primary" />
              Exclude from Google
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="hidden" defaultChecked={o?.hidden} className="h-4 w-4 accent-primary" />
              Hide page on website
            </label>
          </div>
          <label className={labelClass}>
            Internal notes
            <input name="notes" maxLength={2000} defaultValue={o?.notes ?? ""} className={inputClass} />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" className={`text-xs ${state.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
              {pending ? "" : state.message}
            </p>
            <div className="flex gap-2">
              {o && (
                <button
                  type="submit"
                  name="intent"
                  value="reset"
                  disabled={pending}
                  className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-60"
                >
                  Reset
                </button>
              )}
              <button
                type="submit"
                name="intent"
                value="save"
                disabled={pending}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save fix"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </article>
  )
}
