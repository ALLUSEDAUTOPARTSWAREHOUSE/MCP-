import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { read, utils } from 'xlsx'

const files = process.argv.slice(2)
assert.ok(files.length, 'Pass the uploaded master workbook paths to verify')
const aliases = { landrover: 'land-rover', mercedes: 'mercedes-benz', chevy: 'chevrolet', alfa: 'alfa-romeo' }
const manifest = JSON.parse(fs.readFileSync('data/brands/manifest.json', 'utf8'))
const index = JSON.parse(fs.readFileSync('data/catalog-index.json', 'utf8'))
const totals = { brands: 0, products: 0, buyNow: 0, quote: 0 }

for (const file of files) {
  const workbook = read(fs.readFileSync(file))
  assert.ok(workbook.Sheets.Products, `${file}: missing Products sheet`)
  const rows = utils.sheet_to_json(workbook.Sheets.Products)
  assert.ok(rows.length, `${file}: empty Products sheet`)
  const make = String(rows[0].Make).trim().toLowerCase()
  const brand = aliases[make] ?? make.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const catalog = JSON.parse(fs.readFileSync(path.join('data/brands', `${brand}.json`), 'utf8'))
  const products = new Map(catalog.products.map((product) => [product.canonicalSlug, product]))
  assert.equal(products.size, catalog.products.length, `${brand}: duplicate product IDs`)
  const unique = new Map()
  for (const row of rows) {
    if (!String(row['Product Name'] ?? '').trim()) continue
    const slug = new URL(row['Product URL']).pathname.split('/').filter(Boolean).at(-1).toLowerCase()
    if (!unique.has(slug)) unique.set(slug, row)
  }
  assert.equal(catalog.count, unique.size, `${brand}: imported row count`)
  assert.equal(catalog.products.length, unique.size, `${brand}: products length`)
  assert.equal(manifest.find((entry) => entry.slug === brand)?.count, unique.size, `${brand}: manifest count`)
  const summary = index.makes.find((entry) => entry.slug === brand)
  assert.equal(summary?.count, unique.size, `${brand}: search index count`)
  let buyNow = 0
  let quote = 0
  for (const [slug, row] of unique) {
    const product = products.get(slug)
    assert.ok(product, `${brand}/${slug}: missing product`)
    const rawPrice = typeof row.Price === 'number' ? row.Price : Number.parseFloat(String(row.Price ?? '').replace(/[^0-9.]/g, ''))
    const isQuote = !Number.isFinite(rawPrice) || rawPrice <= 0 || rawPrice === 799
    const expected = isQuote ? 0 : Math.round(rawPrice * 100) / 100
    assert.equal(product.price, expected, `${brand}/${slug}: exact sheet price`)
    assert.equal(product.salesMode, isQuote ? 'quote' : 'buy_now', `${brand}/${slug}: sales mode`)
    assert.equal(product.name, row['Product Name'].trim(), `${brand}/${slug}: name`)
    for (const [field, column] of [['imageUrl', 'Image URL'], ['productUrl', 'Product URL']]) {
      const expectedUrl = row[column] ? String(row[column]).replace(/^https?:\/\/(?:www\.)?auapw\.com(?=\/|[?#]|$)/i, 'https://www.allusedautopartswarehouse.com') : undefined
      assert.equal(product[field], expectedUrl, `${brand}/${slug}: normalized ${field}`)
      assert.ok(!/^https?:\/\/(?:www\.)?auapw\.com(?:\/|[?#]|$)/i.test(product[field] ?? ''), `${brand}/${slug}: legacy domain`)
    }
    if (isQuote) {
      quote++
      assert.equal(product.tiers, undefined, `${brand}/${slug}: quote must not publish tiers`)
    } else {
      buyNow++
      assert.equal(product.tiers.medium, expected, `${brand}/${slug}: standard tier precision`)
      assert.equal(product.tiers.low, Math.round(expected * 1.0833), `${brand}/${slug}: existing premium rule`)
      assert.equal(product.tiers.high, Math.round(expected * 0.8333), `${brand}/${slug}: existing saver rule`)
    }
  }
  assert.equal(summary.buyNow, buyNow, `${brand}: indexed buy-now count`)
  assert.equal(summary.quote, quote, `${brand}: indexed quote count`)
  totals.brands++
  totals.products += unique.size
  totals.buyNow += buyNow
  totals.quote += quote
}
console.log('Verified every uploaded row, price, tier, image reference, and index count:', totals)
