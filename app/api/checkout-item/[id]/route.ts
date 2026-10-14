import { NextResponse } from 'next/server'
import { resolveFeedItemId, getEffectiveProduct } from '@/lib/merchant'
import { getBrandLabel } from '@/lib/brand-catalog'

const SHIPPING_COST = 240

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resolved = resolveFeedItemId(id)

  if (!resolved) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const { brand, product } = resolved
  const effective = getEffectiveProduct(brand, product, null)

  if (effective.price === null || effective.hidden) {
    return NextResponse.json({ error: 'Item not available' }, { status: 404 })
  }

  return NextResponse.json({
    item: {
      id: `${brand}/${product.canonicalSlug}`,
      name: effective.title,
      price: effective.price,
      image: effective.imageUrl,
      make: getBrandLabel(brand),
      partType: product.category,
      shippingCost: SHIPPING_COST,
    },
  })
}
