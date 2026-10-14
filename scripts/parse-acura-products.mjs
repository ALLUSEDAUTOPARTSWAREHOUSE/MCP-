import { read, utils } from 'xlsx'
import fs from 'fs'
import path from 'path'

const filePath = 'data/ACURA-PRICING-SHEET-d1fbaa.xlsx'
const outputDir = 'lib'
const outputFile = path.join(outputDir, 'acura-products.json')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Read and parse the Excel file
const workbook = read(fs.readFileSync(filePath))
const data = utils.sheet_to_json(workbook.Sheets['Acura2'])

// Transform the data to match app structure
const products = data.map((row) => ({
  id: row.part_number || row.mpn,
  name: row.name,
  slug: row.slug,
  brand: row.brand || 'Acura',
  description: row.description,
  price: row.price,
  pricingTiers: {
    low: row.low_mileage_reference_price,
    medium: row.medium_mileage_reference_price,
    high: row.high_mileage_reference_price,
  },
  image: row.image_url,
  imageSpec: row.image_specification,
  category: row.category_id,
  compatibility: row.compatibility,
  warranty: row.warranty,
  shipping: row.shipping,
  condition: row.condition,
  availability: row.availability,
  stock: row.stock_quantity,
  gtin: row.gtin,
  mpn: row.mpn,
}))

// Group products by model and part type
const grouped = products.reduce((acc, product) => {
  const model = product.compatibility || 'Unknown'
  const category = product.category || 'Other'
  
  if (!acc[model]) {
    acc[model] = {}
  }
  if (!acc[model][category]) {
    acc[model][category] = []
  }
  
  acc[model][category].push(product)
  return acc
}, {})

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify({ products, grouped }, null, 2))

console.log(`✓ Parsed ${products.length} Acura products from spreadsheet`)
console.log(`✓ Grouped by ${Object.keys(grouped).length} vehicle models`)
console.log(`✓ Output saved to ${outputFile}`)
