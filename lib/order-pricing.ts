import "server-only"
import { BRAND_DIRECTORY, getBrandProductBySlug, getBrandProductUrl } from "@/lib/brand-catalog"
import { getSalesMode } from "@/lib/catalog-fields"
import { SHIPPING } from "@/lib/site-policy"
import type { OrderLine } from "@/lib/followup"

export const MAX_UNITS_PER_PRODUCT = 5
export const MAX_LINES_PER_ORDER = 20
export const TAX_RATE = 0.08

export interface CartLineInput {
  id: string
  make?: string
  price: number
  quantity: number
}

export type PricingResult =
  | { ok: true; lines: OrderLine[]; subtotal: number; tax: number; shippingCost: number; totalAmount: number }
  | { ok: false; error: string }

const round2 = (n: number) => Math.round(n * 100) / 100

function findBrandSlug(make?: string): string | undefined {
  if (!make) return undefined
  const needle = make.trim().toLowerCase()
  return BRAND_DIRECTORY.find((b) => b.label.toLowerCase() === needle || b.slug === needle)?.slug
}

/**
 * Re-prices a cart from the catalog. The client price is only used to tell
 * which mileage tier the shopper picked; it must equal one of the catalog's
 * own prices for that part or the line is rejected.
 */
export function priceCart(cart: CartLineInput[]): PricingResult {
  if (!Array.isArray(cart) || cart.length === 0) return { ok: false, error: "Your cart is empty." }
  if (cart.length > MAX_LINES_PER_ORDER) return { ok: false, error: "Too many items in one order. Please call us." }

  const unitsByProduct = new Map<string, number>()
  const lines: OrderLine[] = []

  for (const item of cart) {
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, error: "Invalid quantity in cart." }

    const brand = findBrandSlug(item.make)
    const product = brand ? getBrandProductBySlug(brand, String(item.id)) : undefined
    if (!brand || !product) {
      return { ok: false, error: "One of the parts in your cart needs a phone quote. Please call us to order it." }
    }
    if (getSalesMode(product) !== "buy_now") {
      return { ok: false, error: `${product.name} is quote-only. Please call us to order it.` }
    }

    const catalogPrices = [product.price, product.tiers?.low, product.tiers?.medium, product.tiers?.high].filter(
      (p): p is number => typeof p === "number" && p > 0,
    )
    const unitPrice = catalogPrices.find((p) => Math.abs(p - Number(item.price)) < 0.01)
    if (unitPrice === undefined) {
      return { ok: false, error: `The price for ${product.name} has changed. Please re-add it to your cart.` }
    }

    const units = (unitsByProduct.get(product.id) ?? 0) + quantity
    if (units > MAX_UNITS_PER_PRODUCT) {
      return { ok: false, error: `Online orders are limited to ${MAX_UNITS_PER_PRODUCT} of the same part. Call us for fleet orders.` }
    }
    unitsByProduct.set(product.id, units)

    lines.push({
      productId: product.id,
      name: product.name,
      make: brand,
      unitPrice,
      quantity,
      lineTotal: round2(unitPrice * quantity),
      url: getBrandProductUrl(brand, product),
    })
  }

  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0))
  const shippingCost = round2(SHIPPING.price * lines.reduce((sum, l) => sum + l.quantity, 0))
  const tax = round2(subtotal * TAX_RATE)
  return { ok: true, lines, subtotal, tax, shippingCost, totalAmount: round2(subtotal + tax + shippingCost) }
}
