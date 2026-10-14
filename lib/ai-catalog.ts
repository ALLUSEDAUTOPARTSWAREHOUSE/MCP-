import {
  BRAND_DIRECTORY,
  getBrandLabel,
  getBrandProductUrl,
  isValidBrand,
  loadDerivedCatalog,
  resolveBrandPartImage,
  type DerivedProduct,
} from "@/lib/brand-catalog"
import { CATALOG_INDEX } from "@/lib/catalog-index"
import { slugifyModel, type SalesMode } from "@/lib/catalog-fields"
import { SHIPPING, USED_WARRANTY } from "@/lib/site-policy"

/** Compact, AI- and client-friendly representation of a catalog product. */
export interface CatalogHit {
  /** `${brand}/${slug}` — stable across every brand catalog. */
  id: string
  name: string
  slug: string
  brand: string
  brandLabel: string
  model: string
  year: string
  category: string
  salesMode: SalesMode
  /** Standard-mileage price; null when the part is quote-only ("Call for price"). */
  price: number | null
  pricingTiers?: { low: number; medium: number; high: number }
  compatibility?: string
  warranty: string
  shipping: string
  condition: string
  availability: string
  image: string
  url: string
}

export function toCatalogHit(brand: string, product: DerivedProduct): CatalogHit {
  const buyable = product.salesMode === "buy_now" && !!product.priceTiers
  return {
    id: `${brand}/${product.canonicalSlug}`,
    name: product.name,
    slug: product.canonicalSlug,
    brand,
    brandLabel: getBrandLabel(brand),
    model: product.modelName,
    year: product.yearNumber ? String(product.yearNumber) : product.year || "",
    category: product.partType,
    salesMode: product.salesMode,
    price: buyable ? product.priceTiers!.standard : null,
    pricingTiers: buyable
      ? {
          low: product.priceTiers!.premium,
          medium: product.priceTiers!.standard,
          high: product.priceTiers!.saver,
        }
      : undefined,
    compatibility: product.compatibility,
    warranty: USED_WARRANTY,
    shipping: SHIPPING.label,
    condition: "used",
    availability: buyable ? "in stock" : "call for availability",
    image: resolveBrandPartImage({ category: product.partType, name: product.name }),
    url: getBrandProductUrl(brand, product),
  }
}

const MAKE_ALIASES: Record<string, string> = {
  chevy: "chevrolet",
  vw: "volkswagen",
  mercedes: "mercedes-benz",
  benz: "mercedes-benz",
  landrover: "land-rover",
  "land rover": "land-rover",
  alfa: "alfa-romeo",
  "alfa romeo": "alfa-romeo",
  "aston martin": "aston-martin",
  caddy: "cadillac",
}

/** Resolve "Chevy", "chevrolet", "Mercedes Benz", "land-rover" … to a brand slug. */
export function resolveMake(input?: string | null): string | undefined {
  if (!input) return undefined
  const key = input.toLowerCase().trim()
  const slug = MAKE_ALIASES[key] ?? key.replace(/\s+/g, "-")
  if (isValidBrand(slug)) return slug
  return BRAND_DIRECTORY.find((b) => b.label.toLowerCase() === key)?.slug
}

/** Find a make mentioned in free text, by name/alias first, then by a unique model name. */
function detectMakeInText(text: string): string | undefined {
  const lower = ` ${text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ")} `
  for (const alias of Object.keys(MAKE_ALIASES).sort((a, b) => b.length - a.length)) {
    if (lower.includes(` ${alias} `)) return MAKE_ALIASES[alias]
  }
  for (const b of BRAND_DIRECTORY) {
    if (lower.includes(` ${b.label.toLowerCase()} `) || lower.includes(` ${b.slug} `)) return b.slug
  }
  const tokens = new Set(
    lower.trim().split(/\s+/).filter((t) => t.length >= 3 && !/^\d+$/.test(t)).map(compactModel),
  )
  const owners = new Set<string>()
  for (const make of CATALOG_INDEX.makes) {
    for (const m of make.models) if (tokens.has(compactModel(m.name))) owners.add(make.slug)
  }
  return owners.size === 1 ? [...owners][0] : undefined
}

/** "F-150", "f150", "Truck-F150" → "f150"; sheet model names carry Truck-/Van- prefixes. */
function compactModel(model: string): string {
  return slugifyModel(model)
    .replace(/^(truck|van|suv)-/, "")
    .replace(/-/g, "")
}

export interface SearchFilters {
  query?: string
  make?: string
  category?: string
  model?: string
  year?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}

export interface CatalogSearchResult {
  make?: string
  hits: CatalogHit[]
}

const STOP_WORDS = new Set(["for", "a", "an", "the", "my", "used", "do", "you", "have", "need", "with", "and", "of", "cheapest", "best"])

/**
 * Score-based search across the brand catalogs built from the master pricing sheets.
 * Searches one make at a time (resolved from `make`, the query text, or a model name)
 * so a request only parses that make's catalog.
 */
export function searchCatalogDetailed(filters: SearchFilters): CatalogSearchResult {
  const { query = "", category, model, year, minPrice, maxPrice, limit = 12 } = filters
  const make =
    resolveMake(filters.make) ?? detectMakeInText(`${query} ${model ?? ""}`)

  if (!make) return { hits: [] }

  const partType = /trans/i.test(`${category ?? ""} ${query}`)
    ? "transmission"
    : /engine|motor/i.test(`${category ?? ""} ${query}`)
      ? "engine"
      : undefined
  const modelKey = model ? compactModel(model) : undefined
  const yearNum = year ? Number.parseInt(year, 10) : undefined
  const brandWords = new Set([make, ...getBrandLabel(make).toLowerCase().split(/\s+/)])
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((t) => t && !STOP_WORDS.has(t) && !brandWords.has(t) && !/^(engines?|transmissions?|motor)$/.test(t))
  const cheapest = /cheap|lowest|budget/i.test(query)

  const scored: { product: DerivedProduct; score: number }[] = []
  for (const product of loadDerivedCatalog(make)) {
    if (partType && product.partType !== partType) continue
    const productModelKey = compactModel(product.modelName)
    if (modelKey && !productModelKey.startsWith(modelKey)) continue
    if (yearNum && product.yearNumber !== yearNum) continue
    const price = product.salesMode === "buy_now" ? product.priceTiers?.standard : undefined
    if (typeof maxPrice === "number" && (price === undefined || price > maxPrice)) continue
    if (typeof minPrice === "number" && (price === undefined || price < minPrice)) continue

    const haystack = `${product.name} ${product.modelName} ${product.variant} ${product.yearNumber ?? ""}`.toLowerCase()
    let score = modelKey && productModelKey === modelKey ? 4 : 1
    for (const term of terms) {
      if (haystack.includes(term) || productModelKey === compactModel(term)) score += 2
      else score -= 1
    }
    if (product.salesMode === "buy_now") score += 3
    if (score > 0) scored.push({ product, score })
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (cheapest) return (a.product.priceTiers?.standard ?? Infinity) - (b.product.priceTiers?.standard ?? Infinity)
    return (b.product.yearNumber ?? 0) - (a.product.yearNumber ?? 0)
  })

  return { make, hits: scored.slice(0, limit).map((s) => toCatalogHit(make, s.product)) }
}

export function searchCatalog(filters: SearchFilters): CatalogHit[] {
  return searchCatalogDetailed(filters).hits
}

/** Makes and part categories, for AI grounding and filter UIs. */
export function getCatalogFacets(): { makes: string[]; categories: string[] } {
  return {
    makes: CATALOG_INDEX.makes.map((m) => m.label),
    categories: ["engine", "transmission"],
  }
}

export function getCatalogHitById(id: string): CatalogHit | undefined {
  const [brand, slug] = id.split("/")
  if (!brand || !slug || !isValidBrand(brand)) return undefined
  const product = loadDerivedCatalog(brand).find((p) => p.canonicalSlug === slug)
  return product ? toCatalogHit(brand, product) : undefined
}

/**
 * Complementary parts for a product: the other part type for the same model and
 * year first (an engine pairs with a transmission), then the same part in nearby years.
 */
export function recommendParts(productId: string, limit = 4): CatalogHit[] {
  const [brand, slug] = productId.split("/")
  if (!brand || !slug || !isValidBrand(brand)) return []
  const catalog = loadDerivedCatalog(brand)
  const base = catalog.find((p) => p.canonicalSlug === slug)
  if (!base) return []
  const model = slugifyModel(base.modelName)
  const sameModel = catalog.filter((p) => p !== base && slugifyModel(p.modelName) === model)
  const yearGap = (p: DerivedProduct) => Math.abs((p.yearNumber ?? 0) - (base.yearNumber ?? 0))
  const byFit = (a: DerivedProduct, b: DerivedProduct) =>
    (a.salesMode === b.salesMode ? 0 : a.salesMode === "buy_now" ? -1 : 1) || yearGap(a) - yearGap(b)

  const complementary = sameModel.filter((p) => p.partType !== base.partType).sort(byFit)
  const similar = sameModel.filter((p) => p.partType === base.partType).sort(byFit)
  return [...complementary.slice(0, Math.ceil(limit / 2)), ...similar]
    .slice(0, limit)
    .map((p) => toCatalogHit(brand, p))
}
