import "server-only"
import { read, utils } from "xlsx"
import { pool } from "@/lib/db"
import { setManualOverlay, type BrandProduct } from "@/lib/brand-catalog"

export interface ManualProduct {
  id: number
  brand: string
  slug: string
  name: string
  description: string | null
  price: number | null
  imageUrl: string | null
  category: string | null
  model: string | null
  year: string | null
  source: "manual" | "upload"
  createdAt: string
  updatedAt: string
}

interface ManualProductRow {
  id: number
  brand: string
  slug: string
  name: string
  description: string | null
  price: string | null
  image_url: string | null
  category: string | null
  model: string | null
  year: string | null
  source: string
  created_at: Date
  updated_at: Date
}

function mapRow(r: ManualProductRow): ManualProduct {
  return {
    id: r.id,
    brand: r.brand,
    slug: r.slug,
    name: r.name,
    description: r.description,
    price: r.price === null ? null : Number(r.price),
    imageUrl: r.image_url,
    category: r.category,
    model: r.model,
    year: r.year,
    source: r.source === "upload" ? "upload" : "manual",
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  }
}

export function toBrandProduct(p: Pick<ManualProduct, "slug" | "name" | "price" | "imageUrl" | "category" | "model" | "year" | "description">): BrandProduct {
  const price = p.price ?? 0
  return {
    id: `manual-${p.slug}`,
    name: p.name,
    slug: p.slug,
    canonicalSlug: p.slug,
    price,
    imageUrl: p.imageUrl ?? undefined,
    category: p.category || "engine",
    partNumber: `MANUAL-${p.slug}`,
    mpn: `MANUAL-${p.slug}`,
    description: p.description ?? undefined,
    model: p.model || "",
    year: p.year || "",
    salesMode: price > 0 ? "buy_now" : "quote",
  }
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

async function uniqueSlug(brand: string, base: string): Promise<string> {
  const safeBase = base || "part"
  let slug = safeBase
  let n = 2
  while (true) {
    const { rows } = await pool.query("SELECT 1 FROM manual_products WHERE brand = $1 AND slug = $2", [brand, slug])
    if (rows.length === 0) return slug
    slug = `${safeBase}-${n++}`
  }
}

export async function listManualProducts(brand?: string): Promise<ManualProduct[]> {
  const { rows } = brand
    ? await pool.query<ManualProductRow>(
        "SELECT * FROM manual_products WHERE brand = $1 ORDER BY created_at DESC",
        [brand],
      )
    : await pool.query<ManualProductRow>("SELECT * FROM manual_products ORDER BY created_at DESC")
  return rows.map(mapRow)
}

export interface ManualProductInput {
  name: string
  description: string | null
  price: number | null
  imageUrl: string | null
  category: string | null
  model: string | null
  year: string | null
}

export async function createManualProduct(brand: string, input: ManualProductInput): Promise<ManualProduct> {
  const slug = await uniqueSlug(brand, slugifyName(input.name))
  const { rows } = await pool.query<ManualProductRow>(
    `INSERT INTO manual_products (brand, slug, name, description, price, image_url, category, model, year, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'manual')
     RETURNING *`,
    [brand, slug, input.name, input.description, input.price, input.imageUrl, input.category, input.model, input.year],
  )
  return mapRow(rows[0])
}

export async function deleteManualProduct(brand: string, slug: string): Promise<void> {
  await pool.query("DELETE FROM manual_products WHERE brand = $1 AND slug = $2", [brand, slug])
}

/** Reads the admin-provided workbook and upserts every row as a manual product for `brand`. */
export async function importProductSheet(brand: string, buffer: Buffer): Promise<{ inserted: number; skipped: number }> {
  const wb = read(buffer)
  const sheetName = wb.SheetNames.includes("Products") ? "Products" : wb.SheetNames[0]
  const rows = utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName])
  if (!rows.length) return { inserted: 0, skipped: 0 }

  let inserted = 0
  let skipped = 0
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    for (const r of rows) {
      const name = String(r["Product Name"] ?? r["Name"] ?? "").trim()
      if (!name) {
        skipped++
        continue
      }
      const rawPrice = r["Price"]
      const parsedPrice =
        typeof rawPrice === "number"
          ? rawPrice
          : Number.parseFloat(String(rawPrice ?? "").replace(/[^0-9.]/g, ""))
      const price = Number.isFinite(parsedPrice) && parsedPrice > 0 ? Math.round(parsedPrice * 100) / 100 : null
      const category = String(r["Product Type"] ?? r["Category"] ?? "").toLowerCase().includes("transmission")
        ? "transmission"
        : "engine"
      const model = String(r["Model"] ?? "").trim() || null
      const year = String(r["Year"] ?? "").trim() || null
      const imageUrl = String(r["Image URL"] ?? "").trim() || null
      const description = String(r["Description"] ?? "").trim() || null
      const slug = await uniqueSlug(brand, slugifyName(name))

      await client.query(
        `INSERT INTO manual_products (brand, slug, name, description, price, image_url, category, model, year, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'upload')`,
        [brand, slug, name, description, price, imageUrl, category, model, year],
      )
      inserted++
    }
    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
  return { inserted, skipped }
}

/** Loads this brand's manually-added products and layers them onto its sheet catalog for this request. */
export async function primeManualOverlay(brand: string): Promise<void> {
  try {
    const rows = await listManualProducts(brand)
    setManualOverlay(brand, rows.map(toBrandProduct))
  } catch (error) {
    console.error("[manual-products] overlay priming failed:", (error as Error).message)
  }
}
