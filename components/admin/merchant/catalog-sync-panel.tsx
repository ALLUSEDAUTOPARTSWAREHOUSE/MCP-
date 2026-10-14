"use client"

import { useActionState } from "react"
import { RefreshCw, Upload, PlusCircle, Trash2, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  addManualProduct,
  removeManualProduct,
  syncProducts,
  uploadProductSheet,
  type CatalogActionState,
} from "@/app/admin/catalog-actions"

const initial: CatalogActionState = { ok: false, message: "" }
const inputClass = "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
const labelClass = "flex flex-col gap-1 text-xs font-medium text-muted-foreground"

export interface CatalogSyncPanelProps {
  brands: { slug: string; label: string }[]
  manualProducts: {
    brand: string
    brandLabel: string
    slug: string
    name: string
    price: number | null
    source: "manual" | "upload"
    pagePath: string
    createdAt: string
  }[]
}

function SyncButton() {
  const [state, action, pending] = useActionState(syncProducts, initial)
  return (
    <form action={action} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
        {pending ? "Syncing…" : "Sync products"}
      </button>
      <p role="status" className={`text-xs ${state.ok ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
        {pending ? "" : state.message || "Republishes the catalog so the website and Google feed reflect the latest data."}
      </p>
    </form>
  )
}

function ManualProductForm({ brands }: { brands: { slug: string; label: string }[] }) {
  const [state, action, pending] = useActionState(addManualProduct, initial)

  return (
    <form key={state.ok ? state.message : "idle"} action={action} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Brand
          <select name="brand" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose a brand
            </option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Part type
          <select name="category" defaultValue="engine" className={inputClass}>
            <option value="engine">Engine</option>
            <option value="transmission">Transmission</option>
          </select>
        </label>
      </div>
      <label className={labelClass}>
        Product name
        <input name="name" required maxLength={150} placeholder="2015 Toyota Camry 2.5L Engine" className={inputClass} />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className={labelClass}>
          Model
          <input name="model" maxLength={100} placeholder="Camry" className={inputClass} />
        </label>
        <label className={labelClass}>
          Year
          <input name="year" maxLength={20} placeholder="2015" className={inputClass} />
        </label>
        <label className={labelClass}>
          Price ($)
          <input name="price" type="number" min="1" step="0.01" inputMode="decimal" placeholder="Leave blank for quote-only" className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Image URL (https)
        <input name="imageUrl" type="url" placeholder="https://… real photo of this part" className={inputClass} />
      </label>
      <label className={labelClass}>
        Description
        <textarea name="description" rows={3} maxLength={5000} placeholder="Tested used part details…" className={`${inputClass} resize-y`} />
      </label>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className={`text-xs ${state.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
          {pending ? "" : state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          {pending ? "Adding…" : "Add product"}
        </button>
      </div>
    </form>
  )
}

function UploadSheetForm({ brands }: { brands: { slug: string; label: string }[] }) {
  const [state, action, pending] = useActionState(uploadProductSheet, initial)

  return (
    <form key={state.ok ? state.message : "idle"} action={action} className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Upload an .xlsx sheet with <code className="rounded bg-muted px-1 py-0.5">Product Name</code> and{" "}
        <code className="rounded bg-muted px-1 py-0.5">Price</code> columns (optionally{" "}
        <code className="rounded bg-muted px-1 py-0.5">Model</code>, <code className="rounded bg-muted px-1 py-0.5">Year</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">Product Type</code>, <code className="rounded bg-muted px-1 py-0.5">Image URL</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">Description</code>). Every row is added as a product for the brand you pick below.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Brand
          <select name="brand" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose a brand
            </option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Spreadsheet file
          <input name="file" type="file" accept=".xlsx,.xls" required className={`${inputClass} py-1.5`} />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className={`text-xs ${state.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
          {pending ? "" : state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {pending ? "Uploading…" : "Upload sheet"}
        </button>
      </div>
    </form>
  )
}

function ManualProductRow({ product }: { product: CatalogSyncPanelProps["manualProducts"][number] }) {
  const [state, action, pending] = useActionState(removeManualProduct, initial)
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.brandLabel} · {product.price ? `$${product.price.toLocaleString()}` : "Quote only"} ·{" "}
          {product.source === "upload" ? "From upload" : "Manual"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={product.pagePath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
        <form action={action}>
          <input type="hidden" name="brand" value={product.brand} />
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            disabled={pending}
            aria-label={`Remove ${product.name}`}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60"
          >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            Remove
          </button>
        </form>
      </div>
      {!state.ok && state.message && <p className="w-full text-xs text-destructive">{state.message}</p>}
    </li>
  )
}

export function CatalogSyncPanel({ brands, manualProducts }: CatalogSyncPanelProps) {
  return (
    <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sync products</h2>
          <p className="text-sm text-muted-foreground">Republish the catalog, or add products by hand or spreadsheet.</p>
        </div>
        <SyncButton />
      </div>

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual">Add product manually</TabsTrigger>
          <TabsTrigger value="upload">Upload sheet</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="pt-4">
          <ManualProductForm brands={brands} />
        </TabsContent>
        <TabsContent value="upload" className="pt-4">
          <UploadSheetForm brands={brands} />
        </TabsContent>
      </Tabs>

      {manualProducts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            Manually added products ({manualProducts.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {manualProducts.map((p) => (
              <ManualProductRow key={`${p.brand}/${p.slug}`} product={p} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
