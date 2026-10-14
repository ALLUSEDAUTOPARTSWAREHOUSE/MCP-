import acuraData from "@/lib/acura-products.json"

export interface AcuraProduct {
  id: string
  name: string
  slug: string
  canonicalSlug: string
  brand: string
  description: string
  price: number
  pricingTiers?: { low?: number; medium?: number; high?: number }
  image?: string
  imageSpec?: string
  imageLabel: string
  category: string
  compatibility?: string
  warranty: string
  shipping: string
  condition?: string
  availability?: string
  stock?: number
  gtin?: number
  mpn?: string
  model: string
  year: string
  /** Canonical product URL from the pricing sheet (auapw.org). */
  productUrl?: string | null
  /** Reference image URL from the pricing sheet (auapw.org). */
  imageUrl?: string | null
}

type RawAcuraProduct = Omit<
  AcuraProduct,
  | "canonicalSlug"
  | "imageLabel"
  | "model"
  | "year"
  | "warranty"
  | "shipping"
> & {
  warranty?: string
  shipping?: string
}

const rawData = acuraData as unknown as {
  products: RawAcuraProduct[]
  grouped: Record<string, Record<string, RawAcuraProduct[]>>
}

const ENGINE_IMAGES: Record<string, string> = {
  cl: "/images/acura/engines/acura-cl-engine-v6-3.2l.png",
  ilx: "/images/acura/engines/acura-ilx-engine.png",
  mdx: "/images/acura/engines/acura-mdx-engine.png",
  rdx: "/images/acura/engines/acura-rdx-engine.png",
}

const ENGINE_REPRESENTATIVE = "/images/parts/engine-used.jpg"
const TRANSMISSION_AUTOMATIC = "/images/acura/transmissions/acura-cl-transmission-automatic.png"
const TRANSMISSION_MANUAL = "/images/acura/transmissions/acura-cl-transmission-manual.png"

export function parseAcuraModelYear(product: Pick<RawAcuraProduct, "name" | "compatibility">): {
  model: string
  year: string
} {
  const source = `${product.name || ""} ${product.compatibility || ""}`
  const year = source.match(/\b(?:19|20)\d{2}\b/)?.[0] || ""
  const model = source.match(/Acura\s+([A-Za-z0-9-]+)/i)?.[1]?.toUpperCase() || "Acura"
  return { model, year }
}

export function getCanonicalAcuraSlug(product: Pick<RawAcuraProduct, "slug" | "id">): string {
  const base = product.slug.replace(/-+$/g, "")
  return `${base}-${product.id.toLowerCase()}`
}

// Prices come directly from the Acura pricing sheet — no markup or clamping.
function sanitizePrice(price: number | undefined): number | undefined {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) return undefined
  return Math.round(price)
}

function normalizeProduct(product: RawAcuraProduct): AcuraProduct {
  const { model, year } = parseAcuraModelYear(product)
  return {
    ...product,
    price: sanitizePrice(product.price) ?? 0,
    pricingTiers: product.pricingTiers
      ? {
          low: sanitizePrice(product.pricingTiers.low),
          medium: sanitizePrice(product.pricingTiers.medium),
          high: sanitizePrice(product.pricingTiers.high),
        }
      : undefined,
    canonicalSlug: getCanonicalAcuraSlug(product),
    model,
    year,
    warranty: "90 Days",
    shipping: "$240",
    imageSpec: (product.imageSpec || "").replace(/free shipping/gi, "$240 shipping"),
    imageLabel: "Representative image — verify VIN/fitment before purchase",
  }
}

export const acuraProducts: AcuraProduct[] = rawData.products.map(normalizeProduct)
const productsById = new Map(acuraProducts.map((product) => [product.id, product]))

export const acuraGrouped: Record<string, Record<string, AcuraProduct[]>> = Object.fromEntries(
  Object.entries(rawData.grouped).map(([group, categories]) => [
    group,
    Object.fromEntries(
      Object.entries(categories).map(([category, products]) => [
        category,
        products.map((product) => productsById.get(product.id) || normalizeProduct(product)),
      ]),
    ),
  ]),
)

export function resolveAcuraImage(product: Pick<AcuraProduct, "category" | "name" | "compatibility" | "slug" | "model" | "image">): string {
  const category = (product.category || "").toLowerCase()
  const source = `${product.name} ${product.compatibility || ""} ${product.slug || ""}`.toLowerCase()

  if (category.includes("transmission")) {
    return /\bmanual\b|\(mt\)/i.test(source) ? TRANSMISSION_MANUAL : TRANSMISSION_AUTOMATIC
  }

  if (category.includes("engine")) {
    return ENGINE_IMAGES[product.model.toLowerCase()] || ENGINE_REPRESENTATIVE
  }

  return product.image || ENGINE_REPRESENTATIVE
}

export function getAcuraProductBySlug(slug: string): AcuraProduct | undefined {
  return acuraProducts.find(
    (product) => product.canonicalSlug === slug || product.slug === slug,
  )
}

export function getAcuraProductById(id: string): AcuraProduct | undefined {
  return productsById.get(id)
}

export function getAcuraProductUrl(product: Pick<AcuraProduct, "canonicalSlug">): string {
  return `/acura/${product.canonicalSlug}`
}

/** Human-readable part-type label, e.g. "Used Engine", "Used Transmission". */
export function getAcuraPartTypeLabel(
  product: Pick<AcuraProduct, "category">,
): string {
  const category = (product.category || "").trim()
  const withoutUsed = category.replace(/^used\s+/i, "")
  const titled = withoutUsed.replace(/\b\w/g, (c) => c.toUpperCase())
  return `Used ${titled}`
}

/**
 * Build a Google Images search URL for the exact part so shoppers can index
 * and verify real photos of that specific engine/transmission/part.
 */
export function getAcuraPartImageSearchUrl(
  product: Pick<AcuraProduct, "name" | "compatibility" | "category">,
): string {
  // The name already embeds year + model (e.g. "2001 Acura CL Engine - ...").
  // Only append compatibility when it isn't already part of the name.
  const name = product.name || ""
  const compatibility = product.compatibility || ""
  const query = (
    name.toLowerCase().includes(compatibility.toLowerCase()) || !compatibility
      ? name
      : `${compatibility} ${name}`
  )
    .replace(/\s+/g, " ")
    .trim()
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
}

export function getRelatedAcuraProducts(product: AcuraProduct, limit = 4): AcuraProduct[] {
  const sameModel = acuraProducts.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.model === product.model &&
      candidate.category === product.category,
  )
  const complementary = acuraProducts.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.model === product.model &&
      candidate.category !== product.category,
  )
  return [...sameModel, ...complementary].slice(0, limit)
}
