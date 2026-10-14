/**
 * Imports the per-brand AUAPW_FINAL_MASTER exports (workbooks with a
 * "Products" tab + "Crawl Summary" tab) and REPLACES that brand's catalog in
 * data/brands/<slug>.json. Brands without a master sheet keep their existing
 * catalog. Re-run after uploading more sheets, then run
 * scripts/build-catalog-index.mjs.
 *
 * Pricing rules (from the build spec):
 * - Numeric Price            -> sales_mode=buy_now, price is the standard tier.
 * - "Call for price" / $799  -> sales_mode=quote, no price is ever published.
 * - Mileage tiers use the catalogue's established ratios around the standard
 *   price: low-mileage premium +8.33%, high-mileage saver -16.67%.
 *
 * Usage: node scripts/import-master-sheets.mjs
 */
import { read, utils } from "xlsx"
import fs from "node:fs"
import path from "node:path"

const DATA_DIR = "data"
const BRANDS_DIR = path.join(DATA_DIR, "brands")
const MANIFEST = path.join(BRANDS_DIR, "manifest.json")
const PLACEHOLDER_PRICE = 799

/** Sheet "Make" value (lowercased) -> catalog slug + display label. */
const MAKE_ALIASES = {
  chevy: { slug: "chevrolet", label: "Chevrolet" },
  chevrolet: { slug: "chevrolet", label: "Chevrolet" },
  alfa: { slug: "alfa-romeo", label: "Alfa Romeo" },
  "alfa romeo": { slug: "alfa-romeo", label: "Alfa Romeo" },
  mercedes: { slug: "mercedes-benz", label: "Mercedes-Benz" },
  "mercedes-benz": { slug: "mercedes-benz", label: "Mercedes-Benz" },
  "mercedes benz": { slug: "mercedes-benz", label: "Mercedes-Benz" },
  landrover: { slug: "land-rover", label: "Land Rover" },
  "land rover": { slug: "land-rover", label: "Land Rover" },
  vw: { slug: "volkswagen", label: "Volkswagen" },
  volkswagen: { slug: "volkswagen", label: "Volkswagen" },
  "aston martin": { slug: "aston-martin", label: "Aston Martin" },
  lincon: { slug: "lincoln", label: "Lincoln" },
  jagur: { slug: "jaguar", label: "Jaguar" },
  cadilac: { slug: "cadillac", label: "Cadillac" },
}

const UPPERCASE_LABELS = new Set(["amc", "bmw", "gmc", "mini"])

function resolveMake(rawMake, manifest) {
  const key = String(rawMake || "").trim().toLowerCase()
  if (MAKE_ALIASES[key]) return MAKE_ALIASES[key]
  const slug = key.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const existing = manifest.find((m) => m.slug === slug)
  if (existing) return { slug, label: existing.label }
  const label = UPPERCASE_LABELS.has(key)
    ? key.toUpperCase()
    : key.replace(/\b\w/g, (c) => c.toUpperCase())
  return { slug, label }
}

function isMasterWorkbook(wb) {
  if (!wb.SheetNames.includes("Products") || !wb.SheetNames.includes("Crawl Summary")) return false
  const first = utils.sheet_to_json(wb.Sheets.Products, { range: 0 })[0]
  return Boolean(first && "Product Name" in first && "Price" in first)
}

function parsePrice(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const n = Number.parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""))
  return Number.isFinite(n) ? n : null
}

function slugFromUrl(url, fallback) {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean).pop()
    if (seg) return seg.toLowerCase()
  } catch {}
  return fallback
}

const round = (n) => Math.round(n)

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : []

// Newest master workbook per brand wins, so re-uploads replace older ones.
const files = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.toLowerCase().endsWith(".xlsx"))
  .map((f) => ({ f, mtime: fs.statSync(path.join(DATA_DIR, f)).mtimeMs }))
  .sort((a, b) => a.mtime - b.mtime)

const byBrand = new Map()
for (const { f } of files) {
  const wb = read(fs.readFileSync(path.join(DATA_DIR, f)))
  if (!isMasterWorkbook(wb)) continue
  const rows = utils.sheet_to_json(wb.Sheets.Products)
  if (!rows.length) continue
  const make = resolveMake(rows[0].Make, manifest)
  byBrand.set(make.slug, { file: f, make, rows })
}

for (const [slug, { file, make, rows }] of byBrand) {
  const seen = new Set()
  const products = []
  let buyNow = 0
  let quote = 0
  for (const r of rows) {
    const name = String(r["Product Name"] || "").trim()
    if (!name) continue
    const canonicalSlug = slugFromUrl(r["Product URL"], name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    if (seen.has(canonicalSlug)) continue
    seen.add(canonicalSlug)

    const sheetPrice = parsePrice(r.Price)
    const isQuote = sheetPrice === null || sheetPrice <= 0 || sheetPrice === PLACEHOLDER_PRICE
    const standard = isQuote ? 0 : round(sheetPrice)
    if (isQuote) quote++
    else buyNow++

    const partType = String(r["Product Type"] || "").toLowerCase().includes("transmission")
      ? "transmission"
      : "engine"
    const year = String(r.Year ?? "").trim()
    const model = String(r.Model ?? "").trim()
    const variant = name.includes(" - ") ? name.slice(name.indexOf(" - ") + 3) : ""

    products.push({
      id: canonicalSlug,
      mpn: canonicalSlug,
      partNumber: canonicalSlug,
      name,
      slug: canonicalSlug,
      canonicalSlug,
      category: partType,
      year,
      model,
      modelClean: model,
      salesMode: isQuote ? "quote" : "buy_now",
      price: standard,
      tiers: isQuote
        ? undefined
        : { low: round(standard * 1.0833), medium: standard, high: round(standard * 0.8333) },
      imageUrl: r["Image URL"] || undefined,
      productUrl: r["Product URL"] || undefined,
      compatibility: `${year} ${make.label} ${model}`.trim(),
      description: `Tested used ${partType} for the ${year} ${make.label} ${model}${
        variant ? ` (${variant})` : ""
      }. Matched to the exact VIN variant, compression and leak-down tested before dispatch.`,
    })
  }

  fs.writeFileSync(
    path.join(BRANDS_DIR, `${slug}.json`),
    JSON.stringify({ brand: slug, slug, count: products.length, products }),
  )
  const entry = manifest.find((m) => m.slug === slug)
  if (entry) {
    entry.count = products.length
    entry.label = make.label
  } else {
    manifest.push({ slug, label: make.label, count: products.length })
  }
  console.log(`${slug.padEnd(14)} ${String(products.length).padStart(6)} parts  buy_now=${buyNow}  quote=${quote}  <- ${file}`)
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug))
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
console.log(`Imported ${byBrand.size} master sheet(s); manifest has ${manifest.length} brands.`)
