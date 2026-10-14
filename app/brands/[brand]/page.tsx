import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { SeoBacklinks } from '@/components/seo-backlinks'
import { BrandProductImage } from '@/components/brands/brand-product-image'
import {
  BRAND_DIRECTORY,
  getBrandLabel,
  getBrandModels,
  getBrandProductUrl,
  getProductDisplayImage,
  isValidBrand,
  loadBrandCatalog,
  resolveBrandPartImage,
  searchBrandProducts,
} from '@/lib/brand-catalog'
import { ChevronRight, ChevronLeft, Search } from 'lucide-react'

interface PageProps {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ q?: string; model?: string; category?: string; page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params
  if (!isValidBrand(brand)) return {}
  const label = getBrandLabel(brand)
  const catalog = loadBrandCatalog(brand)
  const productCount = catalog?.products?.length || 0
  return {
    title: `Used ${label} Engines, Transmissions & Parts | Exact Mileage Pricing`,
    description: `Shop ${productCount > 0 ? productCount.toLocaleString() : ''} used OEM ${label} engines, transmissions, and parts. Exact low/medium/high mileage pricing, tested parts, 90-day warranty, nationwide shipping.`,
  }
}

export default async function BrandCatalogPage({ params, searchParams }: PageProps) {
  const { brand } = await params
  const sp = await searchParams
  if (!isValidBrand(brand)) notFound()

  const label = getBrandLabel(brand)
  const catalog = loadBrandCatalog(brand)
  if (!catalog) notFound()

  const page = Number.parseInt(sp.page || '1', 10) || 1
  const result = searchBrandProducts(brand, { q: sp.q, model: sp.model, category: sp.category, page })
  const models = getBrandModels(brand).slice(0, 24)

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries({ q: sp.q, model: sp.model, category: sp.category, ...overrides })) {
      if (v) q.set(k, v)
    }
    const s = q.toString()
    return s ? `?${s}` : ''
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Breadcrumb + hero */}
        <section className="py-10 bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/brands" className="hover:text-primary transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{label} Parts</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground text-balance">
              Used {label} Engines, Transmissions &amp; Parts
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
              {(catalog?.products?.length || 0).toLocaleString()} tested used OEM {label} parts with exact mileage-based
              pricing from our live inventory. 90-day warranty and nationwide shipping included.
            </p>

            {/* Search — plain GET form, works without JS */}
            <form method="get" className="mt-6 flex max-w-xl gap-2" role="search" aria-label={`Search ${label} parts`}>
              {sp.model ? <input type="hidden" name="model" value={sp.model} /> : null}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  defaultValue={sp.q || ''}
                  placeholder={`Search ${label} parts, e.g. "2015 engine"`}
                  className="w-full rounded-lg border border-border/40 bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Model filter chips */}
        {models.length > 1 && (
          <section className="py-4 border-b border-border/20 bg-card/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav aria-label={`${label} models`} className="flex flex-wrap gap-2">
                <Link
                  href={`/brands/${brand}${buildQuery({ model: undefined, page: undefined })}`}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    !sp.model
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  All models
                </Link>
                {models.map(({ model, count }) => (
                  <Link
                    key={model}
                    href={`/brands/${brand}${buildQuery({ model, page: undefined })}`}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      sp.model === model
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {model} ({count.toLocaleString()})
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        )}

        {/* Product grid */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-sm text-muted-foreground">
              {result.total.toLocaleString()} parts{sp.model ? ` for ${label} ${sp.model}` : ''}
              {sp.q ? ` matching "${sp.q}"` : ''} — page {result.page} of {result.pageCount}
            </p>

            {result.products.length === 0 ? (
              <div className="rounded-xl border border-border/40 bg-card p-10 text-center">
                <p className="text-foreground font-semibold">No parts matched your search.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different keyword, or{' '}
                  <Link href="/quote" className="text-primary font-medium hover:underline">request a free quote</Link>{' '}
                  and we&apos;ll locate it for you.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {result.products.map((product) => (
                  <Link
                    key={product.canonicalSlug}
                    href={getBrandProductUrl(brand, product)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full bg-muted">
                      <BrandProductImage
                        src={getProductDisplayImage(brand, product).src}
                        generatedSrc={getProductDisplayImage(brand, product).generatedSrc}
                        illustrative={getProductDisplayImage(brand, product).illustrative}
                        fallbackSrc={resolveBrandPartImage(product)}
                        alt={product.name}
                        sku={product.mpn || product.id}
                        brand={label}
                        year={product.year}
                        model={product.model}
                        category={product.category}
                        compact
                      />
                      <Badge className="absolute top-3 left-3 capitalize">{product.category || 'Part'}</Badge>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h2 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h2>
                      <div className="mt-auto flex items-baseline justify-between gap-2">
                        <span className="text-lg font-black text-primary">${product.price.toLocaleString()}</span>
                        {product.tiers && (
                          <span className="text-[11px] text-muted-foreground">
                            ${Math.min(product.tiers.high, product.tiers.low).toLocaleString()}–$
                            {Math.max(product.tiers.high, product.tiers.low).toLocaleString()} by mileage
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {result.pageCount > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
                {result.page > 1 && (
                  <Link
                    href={`/brands/${brand}${buildQuery({ page: String(result.page - 1) })}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/40 px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                )}
                <span className="px-3 text-sm text-muted-foreground">
                  Page {result.page} of {result.pageCount.toLocaleString()}
                </span>
                {result.page < result.pageCount && (
                  <Link
                    href={`/brands/${brand}${buildQuery({ page: String(result.page + 1) })}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/40 px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>

        {/* Other brands */}
        <section className="py-8 border-t border-border/20 bg-card/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
              Shop other brands
            </h2>
            <nav aria-label="All brands" className="flex flex-wrap gap-2">
              {BRAND_DIRECTORY.filter((b) => b.slug !== brand).map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="rounded-full border border-border/40 px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Used {b.label} Parts
                </Link>
              ))}
              <Link
                href="/acura"
                className="rounded-full border border-border/40 px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                Used Acura Parts
              </Link>
            </nav>
          </div>
        </section>

        {/* Keyword-rich internal backlinks for Google indexing */}
        <SeoBacklinks make={label} partType="Engine" />
      </main>
      <Footer />
    </>
  )
}
