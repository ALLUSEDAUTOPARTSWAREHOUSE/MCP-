import {
  acuraProducts,
  resolveAcuraImage,
  getRelatedAcuraProducts,
  getAcuraProductUrl,
  parseAcuraModelYear,
  type AcuraProduct,
} from "@/lib/acura-data"

/** Compact, AI- and client-friendly representation of a catalog product. */
export interface CatalogHit {
  id: string
  name: string
  slug: string
  brand: string
  model: string
  year: string
  category: string
  price: number
  pricingTiers?: { low?: number; medium?: number; high?: number }
  compatibility?: string
  warranty?: string
  shipping?: string
  condition?: string
  availability?: string
  image: string
  url: string
}

export function toCatalogHit(product: AcuraProduct): CatalogHit {
  const { model, year } = parseAcuraModelYear(product)
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    model,
    year,
    category: product.category,
    price: product.price,
    pricingTiers: product.pricingTiers,
    compatibility: product.compatibility,
    warranty: product.warranty,
    shipping: product.shipping,
    condition: product.condition,
    availability: product.availability,
    image: resolveAcuraImage(product),
    url: getAcuraProductUrl(product),
  }
}

export interface SearchFilters {
  query?: string
  category?: string
  model?: string
  year?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}

/**
 * Score-based catalog search. Ranks products by how well they match the
 * free-text query plus structured filters (category, model, year, price).
 */
export function searchCatalog(filters: SearchFilters): CatalogHit[] {
  const {
    query = "",
    category,
    model,
    year,
    minPrice,
    maxPrice,
    limit = 12,
  } = filters

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)

  const scored = acuraProducts
    .map((product) => {
      const hit = toCatalogHit(product)
      const haystack = [
        product.name,
        product.category,
        product.compatibility,
        product.description,
        hit.model,
        hit.year,
      ]
        .join(" ")
        .toLowerCase()

      let score = 0

      // Structured filters act as hard-ish constraints (heavily weighted).
      if (category && hit.category.toLowerCase().includes(category.toLowerCase())) score += 8
      if (category && !hit.category.toLowerCase().includes(category.toLowerCase())) score -= 6
      if (model && hit.model.toLowerCase() === model.toLowerCase()) score += 10
      if (model && hit.model.toLowerCase() !== model.toLowerCase()) score -= 8
      if (year && hit.year === String(year)) score += 6

      // Free-text term matching.
      for (const term of terms) {
        if (haystack.includes(term)) score += 2
        if (hit.model.toLowerCase() === term) score += 4
      }

      // Price constraints.
      if (typeof minPrice === "number" && hit.price < minPrice) score -= 5
      if (typeof maxPrice === "number" && hit.price > maxPrice) score -= 5

      return { hit, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.hit)
}

/** Distinct list of models and categories, useful for AI grounding + filter UIs. */
export function getCatalogFacets(): { models: string[]; categories: string[] } {
  const models = new Set<string>()
  const categories = new Set<string>()
  for (const product of acuraProducts) {
    const { model } = parseAcuraModelYear(product)
    if (model) models.add(model)
    if (product.category) categories.add(product.category)
  }
  return {
    models: [...models].sort(),
    categories: [...categories].sort(),
  }
}

/**
 * Complementary-part recommendations. Combines the catalog's own related-product
 * logic with a curated map of parts that are commonly bought together.
 */
const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
  engine: ["transmission"],
  transmission: ["engine"],
}

export function recommendParts(productId: string, limit = 4): CatalogHit[] {
  const product = acuraProducts.find((p) => p.id === productId)
  if (!product) return []

  const related = getRelatedAcuraProducts(product, limit * 2).map(toCatalogHit)

  // Pull in complementary categories for the same model when available.
  const { model } = parseAcuraModelYear(product)
  const categoryKey = Object.keys(COMPLEMENTARY_CATEGORIES).find((k) =>
    product.category.toLowerCase().includes(k),
  )
  const complementaryCats = categoryKey ? COMPLEMENTARY_CATEGORIES[categoryKey] : []

  const complementary = acuraProducts
    .filter((p) => {
      if (p.id === product.id) return false
      const { model: m } = parseAcuraModelYear(p)
      const catMatch = complementaryCats.some((c) => p.category.toLowerCase().includes(c))
      return catMatch && m === model
    })
    .map(toCatalogHit)

  // Merge, dedupe by id, prioritise complementary parts.
  const seen = new Set<string>()
  const merged: CatalogHit[] = []
  for (const hit of [...complementary, ...related]) {
    if (seen.has(hit.id)) continue
    seen.add(hit.id)
    merged.push(hit)
    if (merged.length >= limit) break
  }
  return merged
}
