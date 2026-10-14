/**
 * Sync product JSON from a brand pricing sheet (.xlsx).
 *
 * Reusable for every brand sheet (Acura today, 55 brands coming):
 *   node scripts/sync-pricing-sheet.mjs <sheet.xlsx> <products.json>
 * Defaults to the Acura sheet + JSON when run without args.
 *
 * Pricing is copied EXACTLY from the sheet — no markup, no clamping:
 *   price                          -> price
 *   low_mileage_reference_price    -> pricingTiers.low
 *   medium_mileage_reference_price -> pricingTiers.medium
 *   high_mileage_reference_price   -> pricingTiers.high
 *   product_url                    -> productUrl (canonical, indexed)
 *   image_url                      -> imageUrl   (indexed for Google Images)
 */
import { read, utils } from 'xlsx'
import fs from 'node:fs'

const sheetPath = process.argv[2] || 'data/ACURA-SHEET-37991f.xlsx'
const jsonPath = process.argv[3] || 'lib/acura-products.json'

const wb = read(fs.readFileSync(sheetPath))
// Use the first sheet that actually has rows.
let rows = []
for (const name of wb.SheetNames) {
  rows = utils.sheet_to_json(wb.Sheets[name], { defval: null })
  if (rows.length > 0) break
}
if (rows.length === 0) {
  console.error('No data rows found in', sheetPath)
  process.exit(1)
}

const byMpn = new Map(rows.map((r) => [String(r.mpn ?? r.part_number), r]))

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const products = data.products || data

let matched = 0
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : undefined)

function applyRow(p, row) {
  p.price = num(row.price) ?? p.price
  p.pricingTiers = {
    low: num(row.low_mileage_reference_price),
    medium: num(row.medium_mileage_reference_price) ?? num(row.price),
    high: num(row.high_mileage_reference_price),
  }
  p.productUrl = row.product_url || p.productUrl || null
  p.imageUrl = row.image_url || row.image_preview || p.imageUrl || null
  if (row.description) p.description = row.description
  if (row.category_id) p.category = row.category_id
  if (row.compatibility) p.compatibility = row.compatibility
  if (row.gtin) p.gtin = row.gtin
}

for (const p of products) {
  const row = byMpn.get(String(p.mpn))
  if (row) {
    applyRow(p, row)
    matched++
  }
}

// The grouped map embeds product copies — sync those too so both stay identical.
if (data.grouped) {
  for (const categories of Object.values(data.grouped)) {
    for (const list of Object.values(categories)) {
      for (const p of list) {
        const row = byMpn.get(String(p.mpn))
        if (row) applyRow(p, row)
      }
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 1))
console.log(`Synced ${matched}/${products.length} products in ${jsonPath} from ${sheetPath}`)
