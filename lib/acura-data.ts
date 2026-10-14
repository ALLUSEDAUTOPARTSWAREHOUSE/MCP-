import acuraData from "@/lib/acura-products.json"

export interface AcuraProduct {
  id: string
  name: string
  slug: string
  brand: string
  description: string
  price: number
  pricingTiers?: { low?: number; medium?: number; high?: number }
  image?: string
  imageSpec?: string
  category: string
  compatibility?: string
  warranty?: string
  shipping?: string
  condition?: string
  availability?: string
  stock?: number
  gtin?: number
  mpn?: string
}

const data = acuraData as unknown as {
  products: AcuraProduct[]
  grouped: Record<string, Record<string, AcuraProduct[]>>
}

export const acuraProducts = data.products
export const acuraGrouped = data.grouped

// The JSON references external image URLs (auapw.org) that no longer resolve.
// Map every product to a bundled local image based on its model + category so
// cards render reliably on all devices. Falls back to a category default.
const ENGINE_IMAGES: Record<string, string> = {
  cl: "/images/acura/engines/acura-cl-engine-v6-3.2l.png",
  ilx: "/images/acura/engines/acura-ilx-engine.png",
  mdx: "/images/acura/engines/acura-mdx-engine.png",
  rdx: "/images/acura/engines/acura-rdx-engine.png",
}
const ENGINE_DEFAULT = "/images/acura/engines/acura-cl-engine-v6-3.2l.png"
const TRANSMISSION_DEFAULT = "/images/acura/transmissions/acura-cl-transmission-automatic.png"
const TRANSMISSION_MANUAL = "/images/acura/transmissions/acura-cl-transmission-manual.png"

export function resolveAcuraImage(product: AcuraProduct): string {
  const category = (product.category || "").toLowerCase()
  const haystack = `${product.name} ${product.compatibility || ""} ${product.slug || ""}`.toLowerCase()

  if (category.includes("transmission")) {
    return haystack.includes("manual") ? TRANSMISSION_MANUAL : TRANSMISSION_DEFAULT
  }

  // Engines (and anything else) — match a known model in the name.
  for (const [model, img] of Object.entries(ENGINE_IMAGES)) {
    if (new RegExp(`\\b${model}\\b`).test(haystack)) return img
  }
  return ENGINE_DEFAULT
}

export function getAcuraProductBySlug(slug: string): AcuraProduct | undefined {
  return data.products.find((p) => p.slug === slug)
}

export function getAcuraProductById(id: string): AcuraProduct | undefined {
  return data.products.find((p) => p.id === id)
}

// Related products: same category first, then same model/compatibility, excluding self.
export function getRelatedAcuraProducts(product: AcuraProduct, limit = 4): AcuraProduct[] {
  const sameCategory = data.products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  )
  const sameModel = data.products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.compatibility === product.compatibility,
  )
  return [...sameCategory, ...sameModel].slice(0, limit)
}
