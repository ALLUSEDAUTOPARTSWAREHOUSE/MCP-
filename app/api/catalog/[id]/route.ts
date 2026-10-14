import { NextResponse } from 'next/server'
import { getCatalogProductById, getRelatedCatalogProducts } from '@/lib/catalog-source'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const product = await getCatalogProductById(id)
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  const related = await getRelatedCatalogProducts(product)
  return NextResponse.json({ product, related })
}
