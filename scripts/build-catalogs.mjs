// Robust brand-catalog builder.
//
// Root-cause fix: every sheet row is a DISTINCT product listing (unique
// product_url). Earlier builds deduplicated by the category-level `slug`,
// collapsing e.g. 14,095 Ford listings down to 2,134 and losing ~85% of
// inventory. This builder keeps one product per row, assigns a unique
// canonicalSlug (so each product gets its own page AND its own generated
// image), and stores mileage tiers as the { low, medium, high } object the
// app expects.
//
// Run: node scripts/build-catalogs.mjs

import { read, utils } from "xlsx"
import fs from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), "data")
const OUT_DIR = path.join(DATA_DIR, "brands")

// Brand-column value -> canonical slug (defaults to lowercased, spaces->dashes).
const BRAND_SLUG = {
  Chevy: "chevrolet",
  Chevrolet: "chevrolet",
  Mercedes: "mercedes-benz",
  "Mercedes-Benz": "mercedes-benz",
  LandRover: "land-rover",
  "Land Rover": "land-rover",
  Alfa: "alfa-romeo",
  "Alfa Romeo": "alfa-romeo",
  Volkswagen: "volkswagen",
  VW: "volkswagen",
}

const LABEL = {
  acura: "Acura", "alfa-romeo": "Alfa Romeo", amc: "AMC", audi: "Audi", bmw: "BMW",
  buick: "Buick", cadillac: "Cadillac", chevrolet: "Chevrolet", chrysler: "Chrysler",
  daewoo: "Daewoo", daihatsu: "Daihatsu", dodge: "Dodge", eagle: "Eagle", fiat: "Fiat",
  ford: "Ford", geo: "Geo", gmc: "GMC", honda: "Honda", hummer: "Hummer", hyundai: "Hyundai",
  infiniti: "Infiniti", isuzu: "Isuzu", jaguar: "Jaguar", jeep: "Jeep", kia: "Kia",
  "land-rover": "Land Rover", lexus: "Lexus", lincoln: "Lincoln", mazda: "Mazda",
  "mercedes-benz": "Mercedes-Benz", mercury: "Mercury", mini: "Mini", mitsubishi: "Mitsubishi",
  nissan: "Nissan", oldsmobile: "Oldsmobile", opel: "Opel", peugeot: "Peugeot",
  plymouth: "Plymouth", pontiac: "Pontiac", porsche: "Porsche", renault: "Renault",
  saab: "Saab", saturn: "Saturn", scion: "Scion", subaru: "Subaru", suzuki: "Suzuki",
  toyota: "Toyota", triumph: "Triumph", volkswagen: "Volkswagen", volvo: "Volvo",
}

const slugForBrand = (b) => BRAND_SLUG[b] || String(b || "").toLowerCase().trim().replace(/\s+/g, "-")
const slugify = (s) =>
  String(s || "").toLowerCase().replace(/[^\w\s-]+/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-")
const num = (v) => {
  const m = String(v ?? "").match(/[\d.]+/)
  return m ? Number(m[0]) : NaN
}
const extractYear = (n) => (String(n || "").match(/\b(19|20)\d{2}\b/) || [])[0] || ""
const extractModel = (n) => {
  const cleaned = String(n || "").replace(/\b(19|20)\d{2}\s+/i, "").split(" - ")[0]
  return cleaned.split(/\s+/).slice(1, 3).join(" ") || ""
}
const categoryOf = (name, productType = "") => {
  const s = `${productType} ${name}`.toLowerCase()
  if (s.includes("transmission") || /\btrans\b/.test(s)) return "transmission"
  if (s.includes("engine") || s.includes("motor")) return "engine"
  if (s.includes("transfer case") || s.includes("axle") || s.includes("differential")) return "drivetrain"
  if (s.includes("abs") || s.includes("brake")) return "brakes"
  if (s.includes("radiator") || s.includes("cooling")) return "cooling"
  if (s.includes("alternator") || s.includes("starter") || s.includes("ecu") || s.includes("module")) return "electrical"
  return "engine"
}

// Build a product record from a per-brand pricing sheet row.
function fromPricingRow(row, sku) {
  const name = String(row.name || "").trim()
  const price = num(row.price ?? row.medium_mileage_reference_price)
  if (!name || !(price > 0)) return null
  const low = num(row.low_mileage_reference_price)
  const med = num(row.medium_mileage_reference_price) || price
  const high = num(row.high_mileage_reference_price)
  return {
    id: sku,
    mpn: sku,
    name,
    baseSlug: slugify(row.slug || name),
    price: Math.round(price * 100) / 100,
    tiers: {
      low: Math.round((Number.isFinite(low) ? low : price * 1.25) * 100) / 100,
      medium: Math.round(med * 100) / 100,
      high: Math.round((Number.isFinite(high) ? high : price * 0.75) * 100) / 100,
    },
    imageUrl: row.image_url || undefined,
    productUrl: row.product_url || undefined,
    category: categoryOf(name),
    year: extractYear(name),
    model: extractModel(name),
    description: String(row.description || "").slice(0, 600),
    partNumber: sku,
    compatibility: "",
  }
}

// Build a product record from the GMC master Google-Merchant feed row.
function fromFeedRow(row, sku) {
  const name = String(row.title || "").trim()
  const price = num(row.price)
  if (!name || !(price > 0)) return null
  return {
    id: sku,
    mpn: sku,
    name,
    baseSlug: slugify(name),
    price: Math.round(price * 100) / 100,
    tiers: {
      low: Math.round(price * 1.18 * 100) / 100,
      medium: Math.round(price * 100) / 100,
      high: Math.round(price * 0.84 * 100) / 100,
    },
    imageUrl: row.image_link || undefined,
    productUrl: row.link || undefined,
    category: categoryOf(name, row.product_type),
    year: extractYear(name),
    model: extractModel(name),
    description: String(row.description || "").slice(0, 600),
    partNumber: sku,
    compatibility: "",
  }
}

// Assign unique canonicalSlugs across a brand's products.
function assignSlugs(products) {
  const used = new Map()
  for (const p of products) {
    const base = p.baseSlug || "part"
    const n = (used.get(base) || 0) + 1
    used.set(base, n)
    p.canonicalSlug = n === 1 ? base : `${base}-p-${n}`
    p.slug = p.canonicalSlug
    delete p.baseSlug
  }
  return products
}

function readSheet(file) {
  const wb = read(fs.readFileSync(path.join(DATA_DIR, file)))
  return utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null })
}

// --- Resolve one dedicated sheet per brand (ignore the GMC master feed here) ---
const allXlsx = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".xlsx"))
const isFeed = (f) => /^GMC-/i.test(f)

// Dominant brand slug of a sheet = most common valid brand-column value.
function dominantBrand(rows) {
  const counts = new Map()
  for (const r of rows) {
    const slug = slugForBrand(r.brand)
    if (!LABEL[slug]) continue
    counts.set(slug, (counts.get(slug) || 0) + 1)
  }
  let best = null
  let bestN = 0
  for (const [slug, n] of counts) if (n > bestN) [best, bestN] = [slug, n]
  return best
}

// Keep only the newest sheet per resolved brand (so ACURA-SHEET and
// ACURA-PRICING-SHEET don't both ingest and double the catalog).
const bestSheetForBrand = new Map() // slug -> { file, rows, mt }
for (const f of allXlsx) {
  if (isFeed(f)) continue
  const rows = readSheet(f)
  if (!rows.length) continue
  const slug = dominantBrand(rows)
  if (!slug) continue
  const mt = fs.statSync(path.join(DATA_DIR, f)).mtimeMs
  const cur = bestSheetForBrand.get(slug)
  if (!cur || mt > cur.mt) bestSheetForBrand.set(slug, { file: f, rows, mt })
}

const catalogs = new Map() // slug -> products[]
const built = new Set()

// 1) Dedicated per-brand pricing sheets (one product per row).
for (const [slug, { rows }] of bestSheetForBrand) {
  const seenUrl = new Set()
  const products = []
  let i = 0
  for (const r of rows) {
    // A dedicated sheet belongs to one brand; skip stray/junk brand rows.
    if (r.brand && LABEL[slugForBrand(r.brand)] && slugForBrand(r.brand) !== slug) continue
    const key = r.product_url || `${r.name}|${r.price}|${i}`
    if (seenUrl.has(key)) continue
    seenUrl.add(key)
    const p = fromPricingRow(r, `P-${i + 1}`)
    if (p) {
      products.push(p)
      i++
    }
  }
  if (products.length) {
    catalogs.set(slug, products)
    built.add(slug)
  }
}

// 2) GMC master feed — only for brands with no dedicated sheet.
const feedFile = allXlsx.filter(isFeed).sort((a, b) =>
  fs.statSync(path.join(DATA_DIR, b)).mtimeMs - fs.statSync(path.join(DATA_DIR, a)).mtimeMs
)[0]
if (feedFile) {
  const rows = readSheet(feedFile)
  const perBrand = new Map()
  for (const r of rows) {
    const slug = slugForBrand(r.brand)
    if (!slug || !LABEL[slug] || built.has(slug)) continue // known brands only; dedicated sheet wins
    if (!perBrand.has(slug)) perBrand.set(slug, [])
    perBrand.get(slug).push(r)
  }
  for (const [slug, brandRows] of perBrand) {
    const seenId = new Set()
    const products = []
    let i = 0
    for (const r of brandRows) {
      const key = r.id || r.link
      if (key && seenId.has(key)) continue
      if (key) seenId.add(key)
      const p = fromFeedRow(r, `P-${i + 1}`)
      if (p) {
        products.push(p)
        i++
      }
    }
    if (products.length) catalogs.set(slug, products)
  }
}

// 3) Assign unique slugs, write catalogs, build manifest.
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
const manifest = []
let grand = 0
for (const [slug, products] of [...catalogs.entries()].sort()) {
  if (!products.length) continue
  assignSlugs(products)
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.json`), JSON.stringify({ brand: slug, products }, null, 2))
  manifest.push({ slug, label: LABEL[slug] || slug, count: products.length })
  grand += products.length
}
manifest.sort((a, b) => a.label.localeCompare(b.label))
fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2))

console.log(`Built ${manifest.length} brands, ${grand.toLocaleString()} products total`)
for (const m of manifest) console.log(`  ${m.label.padEnd(16)} ${m.count.toLocaleString()}`)
