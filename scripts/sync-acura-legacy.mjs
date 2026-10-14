// Rebuilds lib/acura-products.json (used by the Acura search widgets, sitemap
// and model history) from data/brands/acura.json, which is generated from the
// current master pricing sheet. Run after scripts/import-master-sheets.mjs.
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const source = JSON.parse(fs.readFileSync(path.join(root, "data/brands/acura.json"), "utf8"))

const products = source.products.map((p) => {
  const buyNow = p.salesMode === "buy_now" && p.tiers
  return {
    id: p.slug,
    name: p.name,
    slug: p.slug,
    brand: "Acura",
    description: p.description,
    price: buyNow ? p.price : 0,
    pricingTiers: buyNow ? { low: p.tiers.low, medium: p.tiers.medium, high: p.tiers.high } : undefined,
    salesMode: buyNow ? "buy_now" : "quote",
    imageSpec: p.name,
    category: `used ${p.category}`,
    compatibility: p.compatibility,
    condition: "used",
    availability: buyNow ? "in stock" : "call for availability",
    stock: 1,
    mpn: p.mpn || p.slug,
    modelName: p.modelClean || p.model,
    productUrl: `/brands/acura/${p.canonicalSlug || p.slug}`,
  }
})

const grouped = {}
for (const p of products) {
  const group = p.compatibility || p.name.split(" - ")[0]
  grouped[group] ??= {}
  ;(grouped[group][p.category] ??= []).push(p)
}

fs.writeFileSync(path.join(root, "lib/acura-products.json"), JSON.stringify({ products, grouped }))
console.log(`acura-products.json: ${products.length} products, ${Object.keys(grouped).length} groups`)
