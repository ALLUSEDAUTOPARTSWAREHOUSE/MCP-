/**
 * Builds data/catalog-index.json from data/brands/*.json — the compact index
 * the homepage finder, make pages and category pages read, so the site can
 * never drift from the catalogue.
 *
 * Usage: node scripts/build-catalog-index.mjs   (Node 23.6+ for .ts import)
 */
import fs from "node:fs"
import path from "node:path"
import { deriveFields, slugifyModel } from "../lib/catalog-fields.ts"

const BRANDS_DIR = path.join("data", "brands")
const OUT_FILE = path.join("data", "catalog-index.json")

const manifest = JSON.parse(fs.readFileSync(path.join(BRANDS_DIR, "manifest.json"), "utf8"))

const POPULAR_MAKES = ["ford", "chevrolet", "toyota", "honda", "nissan", "dodge", "jeep", "bmw"]
const POPULAR_MODEL_HINTS = {
  ford: ["F150", "F-150", "Explorer", "Mustang"],
  chevrolet: ["Silverado", "Tahoe", "Impala"],
  toyota: ["Camry", "Tacoma", "Corolla"],
  honda: ["Accord", "Civic", "CR-V"],
  nissan: ["Altima", "Frontier", "Maxima"],
  dodge: ["Ram", "Charger", "Durango"],
  jeep: ["Wrangler", "Grand Cherokee", "Cherokee"],
  bmw: ["328i", "X5", "330i"],
}

const totals = { parts: 0, buyNow: 0, quote: 0, engines: 0, transmissions: 0, makes: 0 }
const makes = []
const popular = []

for (const entry of manifest) {
  const file = path.join(BRANDS_DIR, `${entry.slug}.json`)
  if (!fs.existsSync(file)) continue
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"))
  const models = new Map()
  const stats = { buyNow: 0, quote: 0, engines: 0, transmissions: 0, yearMin: Infinity, yearMax: -Infinity }
  const popularCandidates = []

  for (const p of catalog.products) {
    const d = deriveFields(p, entry.label)
    if (d.salesMode === "buy_now") stats.buyNow++
    else stats.quote++
    if (d.partType === "engine") stats.engines++
    else stats.transmissions++
    if (d.yearNumber) {
      stats.yearMin = Math.min(stats.yearMin, d.yearNumber)
      stats.yearMax = Math.max(stats.yearMax, d.yearNumber)
    }

    const key = d.modelName
    let m = models.get(key)
    if (!m) {
      m = { name: key, slug: slugifyModel(key), count: 0, engines: 0, transmissions: 0, years: new Set() }
      models.set(key, m)
    }
    m.count++
    if (d.partType === "engine") m.engines++
    else m.transmissions++
    if (d.yearNumber) m.years.add(d.yearNumber)

    if (
      POPULAR_MAKES.includes(entry.slug) &&
      d.salesMode === "buy_now" &&
      d.partType === "engine" &&
      d.yearNumber &&
      d.yearNumber >= 2000 &&
      d.yearNumber <= 2018 &&
      d.priceTiers.standard < 6000
    ) {
      popularCandidates.push({ p, d })
    }
  }

  const hints = POPULAR_MODEL_HINTS[entry.slug] ?? []
  popularCandidates.sort((a, b) => {
    const ah = hints.findIndex((h) => a.d.modelName.toLowerCase().startsWith(h.toLowerCase()))
    const bh = hints.findIndex((h) => b.d.modelName.toLowerCase().startsWith(h.toLowerCase()))
    const ar = ah === -1 ? 99 : ah
    const br = bh === -1 ? 99 : bh
    return ar - br || (b.d.yearNumber ?? 0) - (a.d.yearNumber ?? 0)
  })
  const pick = popularCandidates[0]
  if (pick) {
    popular.push({
      brand: entry.slug,
      brandLabel: entry.label,
      slug: pick.p.canonicalSlug,
      name: pick.p.name,
      year: pick.d.yearNumber,
      model: pick.d.modelName,
      variant: pick.d.variant,
      engineSize: pick.d.engineSize ?? null,
      priceTiers: pick.d.priceTiers,
    })
  }

  const modelList = [...models.values()]
    .map((m) => {
      const years = [...m.years].sort((a, b) => a - b)
      return {
        name: m.name,
        slug: m.slug,
        count: m.count,
        engines: m.engines,
        transmissions: m.transmissions,
        years,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  makes.push({
    slug: entry.slug,
    label: entry.label,
    count: catalog.products.length,
    buyNow: stats.buyNow,
    quote: stats.quote,
    engines: stats.engines,
    transmissions: stats.transmissions,
    yearMin: Number.isFinite(stats.yearMin) ? stats.yearMin : null,
    yearMax: Number.isFinite(stats.yearMax) ? stats.yearMax : null,
    models: modelList,
  })

  totals.parts += catalog.products.length
  totals.buyNow += stats.buyNow
  totals.quote += stats.quote
  totals.engines += stats.engines
  totals.transmissions += stats.transmissions
}

totals.makes = makes.length
makes.sort((a, b) => a.label.localeCompare(b.label))

fs.writeFileSync(OUT_FILE, JSON.stringify({ totals, makes, popular }))
console.log(`Wrote ${OUT_FILE}:`, totals, `popular=${popular.length}`)
