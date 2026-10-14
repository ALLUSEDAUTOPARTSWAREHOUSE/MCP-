import "server-only"
import { createHash } from "node:crypto"
import { cache } from "react"
import { pool } from "@/lib/db"
import { getSalesMode } from "@/lib/catalog-fields"
import {
  BRAND_DIRECTORY,
  getBrandLabel,
  getBrandProductUrl,
  getProductDisplayImage,
  loadBrandCatalog,
  type BrandProduct,
} from "@/lib/brand-catalog"

export const MERCHANT_CENTER_ID = "5828832429"
export const MERCHANT_STORE_NAME = "A U A P W - All Used Auto Parts Warehouse"
export const COMPARISON_SHOPPING_SERVICE = "Google Shopping (google.com/shopping)"
export const SITE_URL = "https://www.allusedautopartswarehouse.com"
export const FEED_PATH = "/feeds/google-shopping.xml"

export const AVAILABILITY_OPTIONS = ["in_stock", "out_of_stock", "backorder"] as const
export type Availability = (typeof AVAILABILITY_OPTIONS)[number]

const TITLE_LIMIT = 150
const DESCRIPTION_MIN = 50

export interface ProductOverride {
  brand: string
  slug: string
  title: string | null
  description: string | null
  price: number | null
  imageUrl: string | null
  availability: Availability | null
  hidden: boolean
  excludeFromFeed: boolean
  notes: string | null
  updatedAt: string
}

interface OverrideRow {
  brand: string
  slug: string
  title: string | null
  description: string | null
  price: string | null
  image_url: string | null
  availability: string | null
  hidden: boolean
  exclude_from_feed: boolean
  notes: string | null
  updated_at: Date
}

function mapOverride(r: OverrideRow): ProductOverride {
  return {
    brand: r.brand,
    slug: r.slug,
    title: r.title,
    description: r.description,
    price: r.price === null ? null : Number(r.price),
    imageUrl: r.image_url,
    availability: AVAILABILITY_OPTIONS.find((a) => a === r.availability) ?? null,
    hidden: r.hidden,
    excludeFromFeed: r.exclude_from_feed,
    notes: r.notes,
    updatedAt: r.updated_at.toISOString(),
  }
}

/** Overrides must never take a product page down, so DB failures fall back to the sheet data. */
export const getProductOverride = cache(async (brand: string, slug: string): Promise<ProductOverride | null> => {
  try {
    const { rows } = await pool.query<OverrideRow>(
      "SELECT * FROM product_overrides WHERE brand = $1 AND slug = $2",
      [brand, slug],
    )
    return rows[0] ? mapOverride(rows[0]) : null
  } catch (error) {
    console.error("[merchant] override lookup failed:", (error as Error).message)
    return null
  }
})

export async function getAllOverrides(): Promise<Map<string, ProductOverride>> {
  const { rows } = await pool.query<OverrideRow>("SELECT * FROM product_overrides")
  return new Map(rows.map((r) => [`${r.brand}/${r.slug}`, mapOverride(r)]))
}

export async function listRecentOverrides(limit = 50): Promise<ProductOverride[]> {
  const { rows } = await pool.query<OverrideRow>(
    "SELECT * FROM product_overrides ORDER BY updated_at DESC LIMIT $1",
    [limit],
  )
  return rows.map(mapOverride)
}

export type OverrideInput = Omit<ProductOverride, "brand" | "slug" | "updatedAt">

export async function upsertOverride(brand: string, slug: string, input: OverrideInput) {
  await pool.query(
    `INSERT INTO product_overrides
       (brand, slug, title, description, price, image_url, availability, hidden, exclude_from_feed, notes, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
     ON CONFLICT (brand, slug) DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       price = EXCLUDED.price,
       image_url = EXCLUDED.image_url,
       availability = EXCLUDED.availability,
       hidden = EXCLUDED.hidden,
       exclude_from_feed = EXCLUDED.exclude_from_feed,
       notes = EXCLUDED.notes,
       updated_at = now()`,
    [
      brand,
      slug,
      input.title,
      input.description,
      input.price,
      input.imageUrl,
      input.availability,
      input.hidden,
      input.excludeFromFeed,
      input.notes,
    ],
  )
}

export async function deleteOverride(brand: string, slug: string) {
  await pool.query("DELETE FROM product_overrides WHERE brand = $1 AND slug = $2", [brand, slug])
}

// --- Effective product values (sheet data + admin override) -----------------

/** Product as rendered on its page: the sheet row with any admin fixes layered on top. */
export function applyOverrideToProduct(product: BrandProduct, override: ProductOverride | null): BrandProduct {
  if (!override) return product
  const priceOverridden = override.price !== null
  return {
    ...product,
    name: override.title || product.name,
    description: override.description || product.description,
    imageUrl: override.imageUrl || product.imageUrl,
    price: priceOverridden ? override.price! : product.price,
    tiers: priceOverridden ? undefined : product.tiers,
    salesMode: priceOverridden ? "buy_now" : product.salesMode,
  }
}

export const SCHEMA_AVAILABILITY: Record<Availability, string> = {
  in_stock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  backorder: "https://schema.org/BackOrder",
}

export interface EffectiveProduct {
  title: string
  description: string
  price: number | null
  imageUrl: string
  imageIsIllustrative: boolean
  availability: Availability
  hidden: boolean
  excludeFromFeed: boolean
  url: string
}

export function getEffectiveProduct(
  brand: string,
  product: BrandProduct,
  override: ProductOverride | null,
): EffectiveProduct {
  const display = getProductDisplayImage(brand, product)
  const sheetPrice = getSalesMode(product) === "buy_now" ? product.price : null
  const defaultImage = display.src.startsWith("http") ? display.src : `${SITE_URL}${display.src}`
  return {
    title: override?.title || product.name,
    description: override?.description || product.description || product.name,
    price: override?.price ?? sheetPrice,
    imageUrl: override?.imageUrl || defaultImage,
    imageIsIllustrative: !override?.imageUrl && display.illustrative,
    availability: override?.availability ?? "in_stock",
    hidden: override?.hidden ?? false,
    excludeFromFeed: override?.excludeFromFeed ?? false,
    url: `${SITE_URL}${getBrandProductUrl(brand, product)}`,
  }
}

export type IssueCode = "no_price" | "title_too_long" | "short_description" | "illustrative_image" | "hidden" | "excluded"

export const ISSUE_LABELS: Record<IssueCode, string> = {
  no_price: "No price (quote-only) — not sent to Google",
  title_too_long: `Title over ${TITLE_LIMIT} characters — Google truncates it`,
  short_description: `Description under ${DESCRIPTION_MIN} characters`,
  illustrative_image: "Uses a generated image, not a real photo",
  hidden: "Page hidden from the website",
  excluded: "Manually excluded from Google feed",
}

export function auditProduct(effective: EffectiveProduct): IssueCode[] {
  const issues: IssueCode[] = []
  if (effective.price === null) issues.push("no_price")
  if (effective.title.length > TITLE_LIMIT) issues.push("title_too_long")
  if (effective.description.length < DESCRIPTION_MIN) issues.push("short_description")
  if (effective.imageIsIllustrative) issues.push("illustrative_image")
  if (effective.hidden) issues.push("hidden")
  if (effective.excludeFromFeed) issues.push("excluded")
  return issues
}

export function isFeedEligible(effective: EffectiveProduct): boolean {
  return effective.price !== null && effective.price > 0 && !effective.hidden && !effective.excludeFromFeed
}

/** Google limits offer ids to 50 chars; catalog slugs are longer, so hash them into a stable id. */
export function feedItemId(brand: string, slug: string): string {
  return `${brand.slice(0, 12)}-${createHash("sha1").update(`${brand}/${slug}`).digest("hex").slice(0, 16)}`
}

/**
 * Reverses a feed `g:id` back to its brand + product, for the Merchant Center
 * "Checkout URL" deep link (e.g. /checkout?item_id={id}). The brand prefix
 * narrows the search to that brand's catalog before matching the full hash.
 */
export function resolveFeedItemId(
  itemId: string,
): { brand: string; product: BrandProduct } | null {
  const prefix = itemId.split("-")[0]
  const candidates = prefix
    ? BRAND_DIRECTORY.filter((b) => b.slug.slice(0, 12) === prefix)
    : BRAND_DIRECTORY
  const searchOrder = candidates.length > 0 ? candidates : BRAND_DIRECTORY
  for (const brand of searchOrder) {
    const catalog = loadBrandCatalog(brand.slug)
    if (!catalog) continue
    for (const product of catalog.products) {
      if (feedItemId(brand.slug, product.canonicalSlug) === itemId) {
        return { brand: brand.slug, product }
      }
    }
  }
  return null
}

// --- Catalog stats / admin search -------------------------------------------

export interface BrandFeedStats {
  slug: string
  label: string
  total: number
  eligible: number
  issues: Record<IssueCode, number>
}

const emptyIssues = (): Record<IssueCode, number> => ({
  no_price: 0,
  title_too_long: 0,
  short_description: 0,
  illustrative_image: 0,
  hidden: 0,
  excluded: 0,
})

export async function getFeedStats(): Promise<BrandFeedStats[]> {
  const overrides = await getAllOverrides()
  return BRAND_DIRECTORY.map((b) => {
    const catalog = loadBrandCatalog(b.slug)
    const stats: BrandFeedStats = { slug: b.slug, label: b.label, total: 0, eligible: 0, issues: emptyIssues() }
    for (const product of catalog?.products ?? []) {
      const effective = getEffectiveProduct(b.slug, product, overrides.get(`${b.slug}/${product.canonicalSlug}`) ?? null)
      stats.total++
      if (isFeedEligible(effective)) stats.eligible++
      for (const issue of auditProduct(effective)) stats.issues[issue]++
    }
    return stats
  })
}

export interface ProductSearchHit {
  brand: string
  brandLabel: string
  slug: string
  sheet: { name: string; price: number | null; description: string }
  effective: EffectiveProduct
  override: ProductOverride | null
  issues: IssueCode[]
}

export async function searchProductsForAdmin(opts: {
  brand?: string
  q?: string
  issue?: IssueCode
  limit?: number
}): Promise<{ hits: ProductSearchHit[]; total: number }> {
  const overrides = await getAllOverrides()
  const brands = opts.brand ? BRAND_DIRECTORY.filter((b) => b.slug === opts.brand) : BRAND_DIRECTORY
  const q = opts.q?.toLowerCase().trim()
  const limit = opts.limit ?? 30
  const hits: ProductSearchHit[] = []
  let total = 0

  for (const b of brands) {
    const catalog = loadBrandCatalog(b.slug)
    for (const product of catalog?.products ?? []) {
      if (q && !product.name.toLowerCase().includes(q) && !product.canonicalSlug.includes(q)) continue
      const override = overrides.get(`${b.slug}/${product.canonicalSlug}`) ?? null
      const effective = getEffectiveProduct(b.slug, product, override)
      const issues = auditProduct(effective)
      if (opts.issue && !issues.includes(opts.issue)) continue
      total++
      if (hits.length < limit) {
        hits.push({
          brand: b.slug,
          brandLabel: getBrandLabel(b.slug),
          slug: product.canonicalSlug,
          sheet: {
            name: product.name,
            price: getSalesMode(product) === "buy_now" ? product.price : null,
            description: product.description || "",
          },
          effective,
          override,
          issues,
        })
      }
    }
  }
  return { hits, total }
}

// --- Feed fetch log ("sync" status) ------------------------------------------

export async function logFeedFetch(userAgent: string | null, brand: string | null) {
  const isGoogle = /google/i.test(userAgent ?? "")
  try {
    await pool.query("INSERT INTO merchant_feed_fetches (user_agent, brand, is_google) VALUES ($1, $2, $3)", [
      (userAgent ?? "").slice(0, 300),
      brand,
      isGoogle,
    ])
  } catch (error) {
    console.error("[merchant] fetch log failed:", (error as Error).message)
  }
}

export interface FeedFetch {
  fetchedAt: string
  userAgent: string | null
  brand: string | null
  isGoogle: boolean
}

export async function listFeedFetches(limit = 10): Promise<{ recent: FeedFetch[]; lastGoogle: string | null }> {
  const [recent, google] = await Promise.all([
    pool.query("SELECT fetched_at, user_agent, brand, is_google FROM merchant_feed_fetches ORDER BY fetched_at DESC LIMIT $1", [limit]),
    pool.query("SELECT max(fetched_at) AS last FROM merchant_feed_fetches WHERE is_google"),
  ])
  return {
    recent: recent.rows.map((r) => ({
      fetchedAt: r.fetched_at.toISOString(),
      userAgent: r.user_agent,
      brand: r.brand,
      isGoogle: r.is_google,
    })),
    lastGoogle: google.rows[0]?.last ? google.rows[0].last.toISOString() : null,
  }
}
