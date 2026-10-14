'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { getProductPartsUrl } from '@/lib/products-catalog'

type Product = {
  id: string; name: string; brand: string; category: string; price: string; sku: string; inStock: boolean
  mileage: string; condition: string; warranty: string; description: string; fits: string
  image: string; updatedAt: string
}

const emptyForm = { id: '', name: '', category: 'Engines', price: '', sku: '', inStock: true, mileage: '', condition: 'Used', warranty: '', description: '', fits: '', image: '' }

export default function MerchantCenterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('Loading catalog…')
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState('set')
  const [bulkValue, setBulkValue] = useState('')
  const importInput = useRef<HTMLInputElement>(null)

  async function load() {
    const response = await fetch('/api/admin/merchant-center/catalog')
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Unable to load catalog')
    setProducts(result.products)
    setStatus(`${result.products.length} products in portal catalog`)
  }

  useEffect(() => { load().catch((error) => setStatus(error.message)) }, [])

  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort(), [products])
  const filtered = useMemo(() => products.filter((product) => (brandFilter === 'all' || product.brand === brandFilter) && `${product.name} ${product.sku} ${product.category} ${product.brand}`.toLowerCase().includes(query.toLowerCase())), [products, query, brandFilter])

  function edit(product: Product) { setForm({ ...emptyForm, ...product, price: String(product.price) }) }

  async function uploadImage(file: File) {
    setBusy(true)
    try {
      const data = new FormData()
      data.append('file', file)
      const response = await fetch('/api/admin/merchant-center/upload', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Image upload failed')
      setForm((current) => ({ ...current, image: result.url }))
      setStatus('Image uploaded. Save the product to publish it.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Image upload failed')
    } finally { setBusy(false) }
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true)
    try {
      const method = form.id ? 'PATCH' : 'POST'
      const response = await fetch('/api/admin/merchant-center/catalog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setForm(emptyForm); setStatus(`${form.id ? 'Saved' : 'Created'} ${result.product.name}. Website catalog is updated.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Save failed') } finally { setBusy(false) }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This removes it from the portal catalog and the next Google sync.`)) return
    setBusy(true)
    try {
      const response = await fetch('/api/admin/merchant-center/catalog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setStatus(`Deleted ${name}. Run sync to remove it from Google Merchant Center.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Delete failed') } finally { setBusy(false) }
  }

  async function bulkPriceUpdate() {
    const value = Number(bulkValue)
    if (!selected.length || !Number.isFinite(value) || value < 0) return setStatus('Select products and enter a valid price value.')
    setBusy(true)
    try {
      const response = await fetch('/api/admin/merchant-center/bulk', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selected, mode: bulkMode, value }) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setSelected([]); setBulkValue(''); setStatus(`Updated pricing for ${result.updated} products.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Bulk update failed') } finally { setBusy(false) }
  }

  async function bulkDelete() {
    if (!selected.length || !window.confirm(`Delete ${selected.length} selected products?`)) return
    setBusy(true)
    try {
      const response = await fetch('/api/admin/merchant-center/bulk', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selected }) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setSelected([]); setStatus(`Deleted ${result.deleted} products.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Bulk delete failed') } finally { setBusy(false) }
  }

  async function importWorkbook(file: File) {
    setBusy(true)
    try {
      const data = new FormData()
      data.append('file', file)
      const response = await fetch('/api/admin/merchant-center/import', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Import failed')
      await load()
      setStatus(`Imported ${result.imported} products from ${result.sheet}. Review the catalog before syncing.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setBusy(false)
      if (importInput.current) importInput.current.value = ''
    }
  }

  function downloadSpreadsheet() {
    const headers = ['ID', 'Product Name', 'Category', 'Price', 'Price Display', 'SKU', 'In Stock', 'Mileage', 'Condition', 'Warranty', 'Rating', 'Reviews', 'Fits', 'Description', 'Image URL', 'Canonical URL', 'Updated At']
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const rows = products.map((product) => [
      product.id, product.name, product.category, product.price, `$${Number(product.price).toLocaleString()}`, product.sku,
      product.inStock ? 'Yes' : 'No', product.mileage, product.condition, product.warranty, '', '', product.fits,
      product.description, product.image, `${window.location.origin}${getProductPartsUrl(product)}`, product.updatedAt,
    ])
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\\r\\n')
    const blob = new Blob([`\\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `auapw-catalog-${new Date().toISOString().slice(0, 10)}.xls`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setStatus(`Downloaded ${products.length} catalog products as an Excel-compatible spreadsheet.`)
  }

  async function sync() {
    setBusy(true); setStatus('Reconciling portal catalog with Google Merchant Center…')
    try {
      const response = await fetch('/api/admin/merchant-center/sync', { method: 'POST' }); const result = await response.json()
      if (result.authorizationUrl) { setStatus('Authorize Google in the new tab, then sync again.'); window.open(result.authorizationUrl, '_blank', 'noopener,noreferrer'); return }
      if (!response.ok) throw new Error(result.error)
      if (result.prerequisite) { setStatus(result.prerequisite); return }
      setStatus(`${result.synced} synced${result.removed ? `, ${result.removed} removed from Google` : ''}${result.failed?.length ? `, ${result.failed.length} failed` : ''}.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Sync failed') } finally { setBusy(false) }
  }

  const input = (key: keyof typeof emptyForm, label: string, type = 'text') => <label className="flex flex-col gap-1 text-sm"><span className="text-muted-foreground">{label}</span><input required={['name', 'price', 'sku'].includes(key)} type={type} value={String(form[key])} onChange={(event) => setForm({ ...form, [key]: type === 'checkbox' ? event.target.checked : event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" /></label>

  return <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8">
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Catalog operations</p><h1 className="mt-2 text-balance text-4xl font-bold">Merchant Center portal</h1><p className="mt-2 max-w-2xl leading-6 text-muted-foreground">Manage the full website catalog, canonical parts URLs, and Google Merchant Center account 5828832429 from one source of truth.</p></div><div className="flex flex-wrap gap-3"><input ref={importInput} type="file" accept=".xlsx" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importWorkbook(file) }} /><button type="button" onClick={() => importInput.current?.click()} disabled={busy} className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-60">Import XLSX</button><button type="button" onClick={downloadSpreadsheet} disabled={!products.length || busy} className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-60">Download Excel</button><button type="button" onClick={() => { setForm(emptyForm); setStatus('Fill in the form to add a new product.') }} className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-60">New product</button><button type="button" onClick={sync} disabled={busy} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? 'Working…' : 'Sync catalog to Google'}</button></div></header>
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="flex h-fit flex-col gap-4 rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{form.id ? 'Edit product' : 'New product'}</h2>{form.id && <button type="button" onClick={() => setForm(emptyForm)} className="text-xs text-muted-foreground underline">Cancel</button>}</div>{input('name', 'Product name')}{input('category', 'Category')}{input('price', 'Price', 'number')}{input('sku', 'SKU')}{input('mileage', 'Mileage')}{input('condition', 'Condition')}{input('warranty', 'Warranty')}{input('fits', 'Fits')}{input('description', 'Description')}<label className="flex flex-col gap-1 text-sm"><span className="text-muted-foreground">Product image URL</span><input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://…" className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" /></label><label className="flex flex-col gap-1 text-sm"><span className="text-muted-foreground">Upload image</span><input type="file" accept="image/*" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file) }} className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" /></label>{form.image && <div className="flex flex-col gap-2"><img src={form.image} alt="Product preview" className="aspect-square w-full rounded-md border border-border object-cover" /><button type="button" onClick={() => setForm({ ...form, image: '' })} className="rounded-md border border-destructive px-3 py-2 text-sm text-destructive">Remove image</button></div>}<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} /> In stock / publishable</label><button disabled={busy} className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{form.id ? 'Save product changes' : 'Create product'}</button></form>
      <div className="flex flex-col gap-4"><div className="flex flex-col gap-3 sm:flex-row"><input aria-label="Search catalog" placeholder="Search by product, SKU, category, or brand" value={query} onChange={(event) => setQuery(event.target.value)} className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><select aria-label="Filter by brand" value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)} className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"><option value="all">All brands</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></div>{selected.length > 0 && <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3"><span className="text-sm font-semibold">{selected.length} selected</span><select value={bulkMode} onChange={(event) => setBulkMode(event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm"><option value="set">Set price to</option><option value="increase">Increase by $</option><option value="decrease">Decrease by $</option><option value="percent-increase">Increase by %</option><option value="percent-decrease">Decrease by %</option></select><input type="number" min="0" step="0.01" value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} placeholder="Value" className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm" /><button type="button" onClick={bulkPriceUpdate} disabled={busy} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Apply pricing</button><button type="button" onClick={bulkDelete} disabled={busy} className="rounded-md border border-destructive px-3 py-2 text-sm text-destructive">Delete selected</button></div>}<div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4"><input aria-label="Select all filtered products" type="checkbox" checked={filtered.length > 0 && filtered.every((product) => selected.includes(product.id))} onChange={(event) => setSelected(event.target.checked ? Array.from(new Set([...selected, ...filtered.map((product) => product.id)])) : selected.filter((id) => !filtered.some((product) => product.id === id)))} /></th><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id} className="border-b border-border last:border-0"><td className="p-4"><input aria-label={`Select ${product.name}`} type="checkbox" checked={selected.includes(product.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} /></td><td className="p-4"><div className="font-semibold">{product.name}</div><div className="mt-1 text-xs text-muted-foreground">{getProductPartsUrl(product)}</div></td><td className="p-4 font-mono text-xs">{product.sku}</td><td className="p-4">${Number(product.price).toLocaleString()}</td><td className="p-4"><span className={product.inStock ? 'text-emerald-500' : 'text-muted-foreground'}>{product.inStock ? 'In stock' : 'Out of stock'}</span></td><td className="p-4"><div className="flex gap-3"><button type="button" onClick={() => edit(product)} className="text-primary underline">Edit</button><button type="button" onClick={() => remove(product.id, product.name)} className="text-destructive underline">Delete</button></div></td></tr>)}</tbody></table></div></div>
    </section>
  </div></main>
}
