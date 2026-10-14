import { NextResponse } from 'next/server'
import { BRAND_DIRECTORY, loadBrandCatalog, getBrandProductUrl } from '@/lib/brand-catalog'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return BRAND_DIRECTORY.map((brand) => ({ brand: brand.slug }))
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(_request: Request, { params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params
  const entry = BRAND_DIRECTORY.find((b) => b.slug === brand)
  if (!entry) {
    return new NextResponse('Not found', { status: 404 })
  }

  const baseUrl = 'https://www.auapw.com'
  const lastMod = new Date().toISOString().split('T')[0]
  const products = loadBrandCatalog(entry.slug)?.products ?? []

  const urls = products
    .map((product) => {
      const loc = escapeXml(`${baseUrl}${getBrandProductUrl(entry.slug, product)}`)
      return `<url><loc>${loc}</loc><lastmod>${lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
