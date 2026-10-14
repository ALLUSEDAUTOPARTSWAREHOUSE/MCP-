import { randomUUID } from 'node:crypto'
import { read, utils } from 'xlsx'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts } from '@/lib/db/schema'

const normalize = (value: unknown) => String(value ?? '').trim()
const pick = (row: Record<string, unknown>, names: string[]) => {
  const key = Object.keys(row).find((candidate) => names.includes(candidate.toLowerCase().replace(/[^a-z0-9]/g, '')))
  return key ? normalize(row[key]) : ''
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  return !process.env.ADMIN_EMAIL || session.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Upload an XLSX file.' }, { status: 400 })
  if (!file.name.toLowerCase().endsWith('.xlsx')) return NextResponse.json({ error: 'Only standard .xlsx files are supported.' }, { status: 400 })

  const workbook = read(Buffer.from(await file.arrayBuffer()), { cellDates: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return NextResponse.json({ error: 'Workbook has no sheets.' }, { status: 400 })
  const rows = utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: '' })
  if (!rows.length) return NextResponse.json({ error: 'The first sheet has no rows with visible headers.' }, { status: 400 })

  const batchId = randomUUID()
  const products = rows.map((row, index) => {
    const name = pick(row, ['name', 'productname', 'title', 'producttitle']) || `Imported product ${index + 1}`
    const priceText = pick(row, ['price', 'saleprice', 'productprice']).replace(/[^0-9.]/g, '')
    const price = Number(priceText) || 0
    const brand = pick(row, ['brand', 'make', 'manufacturer']) || 'Unknown'
    const sku = pick(row, ['sku', 'mpn', 'partnumber', 'partno', 'gtin']) || `${brand}-${index + 1}`
    const image = pick(row, ['image', 'imageurl', 'image_url', 'link', 'producturl']) || '/images/product-engine-1.png'
    const category = pick(row, ['category', 'productcategory', 'type']) || 'Other'
    const stock = pick(row, ['stock', 'quantity', 'stockquantity', 'availability']).toLowerCase()
    return {
      id: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 240),
      name, category, price: String(price), priceDisplay: `$${price.toLocaleString()}`, mileage: pick(row, ['mileage', 'miles']) || 'N/A',
      condition: pick(row, ['condition']) || 'Used', warranty: pick(row, ['warranty']) || '90 days', rating: '5', reviews: 0,
      image, description: pick(row, ['description', 'productdescription']) || name, fits: pick(row, ['fits', 'fitment', 'compatibility', 'vehicle']) || brand,
      sku, inStock: stock ? !['0', 'false', 'outofstock', 'unavailable'].includes(stock.replace(/\s/g, '')) : true,
      brand, fitment: pick(row, ['fitment', 'compatibility', 'vehicle']), imageGallery: image.startsWith('http') ? [image] : [],
      mpn: pick(row, ['mpn', 'partnumber', 'partno']), gtin: pick(row, ['gtin', 'upc', 'ean']), supplier: pick(row, ['supplier', 'vendor']),
      sourceUrl: pick(row, ['sourceurl', 'producturl', 'link']), importBatchId: batchId,
    }
  })

  let imported = 0
  for (const product of products) {
    await db.insert(catalogProducts).values(product).onConflictDoNothing()
    imported += 1
  }
  return NextResponse.json({ imported, batchId, sheet: sheetName, headers: Object.keys(rows[0]) })
}
POST.displayName = 'importCatalog'
