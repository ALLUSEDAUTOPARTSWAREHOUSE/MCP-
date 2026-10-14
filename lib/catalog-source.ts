import 'server-only'

import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { catalogProducts as productRows } from '@/lib/db/schema'
import { PRODUCTS_CATALOG, type CatalogProduct } from '@/lib/products-catalog'

/**
 * Portal catalog is the source of truth. Every website + Google Merchant read
 * flows through here so an edit or delete in /admin/merchant-center is
 * reflected everywhere. Falls back to the static seed data if the products
 * table has not been populated yet.
 */

type ProductRow = typeof productRows.$inferSelect

function rowToProduct(row: ProductRow): CatalogProduct {
  return {
    id: Number.isNaN(Number(row.id)) ? row.id.length : Number(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    priceDisplay: row.priceDisplay,
    mileage: row.mileage,
    condition: row.condition,
    warranty: row.warranty,
    rating: Number(row.rating),
    reviews: row.reviews,
    image: row.image,
    description: row.description,
    fits: row.fits,
    sku: row.sku,
    inStock: row.inStock,
    brand: row.brand,
    fitment: row.fitment ?? undefined,
    imageGallery: Array.isArray(row.imageGallery) ? row.imageGallery.filter((value): value is string => typeof value === 'string') : [],
    mpn: row.mpn ?? undefined,
    gtin: row.gtin ?? undefined,
    supplier: row.supplier ?? undefined,
    sourceUrl: row.sourceUrl ?? undefined,
  }
}

async function seedIfEmpty(): Promise<void> {
  const existing = await db.select({ id: productRows.id }).from(productRows).limit(1)
  if (existing.length) return
  await db.insert(productRows).values(
    PRODUCTS_CATALOG.map((product) => ({
      id: String(product.id),
      name: product.name,
      category: product.category,
      price: String(product.price),
      priceDisplay: product.priceDisplay,
      mileage: product.mileage,
      condition: product.condition,
      warranty: product.warranty,
      rating: String(product.rating),
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      fits: product.fits,
      sku: product.sku,
      inStock: product.inStock,
    })),
  )
}

/** All products in the portal catalog. Includes out-of-stock items. */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    await seedIfEmpty()
    const rows = await db
      .select()
      .from(productRows)
      .orderBy(asc(productRows.category), asc(productRows.name))
    if (rows.length) return rows.map(rowToProduct)
  } catch (error) {
    console.error('[catalog-source] falling back to static catalog:', error)
  }
  return PRODUCTS_CATALOG
}

/** A single product resolved by its numeric or string id. */
export async function getCatalogProductById(id: string | number): Promise<CatalogProduct | undefined> {
  const all = await getCatalogProducts()
  return all.find((product) => String(product.id) === String(id))
}

/** Related products for a detail page: same category first, then others. */
export async function getRelatedCatalogProducts(
  product: CatalogProduct,
  limit = 4,
): Promise<CatalogProduct[]> {
  const all = await getCatalogProducts()
  const sameCategory = all.filter((p) => p.category === product.category && p.id !== product.id)
  const others = all.filter((p) => p.category !== product.category && p.id !== product.id)
  return [...sameCategory, ...others].slice(0, limit)
}
