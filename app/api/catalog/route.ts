import { NextResponse } from 'next/server'
import { getCatalogProducts } from '@/lib/catalog-source'

export const dynamic = 'force-dynamic'

/**
 * Public catalog feed for the storefront. Returns in-stock products by
 * default so listings mirror what the portal publishes. Pass `?all=1` to
 * include out-of-stock items.
 */
export async function GET(request: Request) {
  const includeAll = new URL(request.url).searchParams.get('all') === '1'
  const products = await getCatalogProducts()
  return NextResponse.json({
    products: includeAll ? products : products.filter((product) => product.inStock),
  })
}
