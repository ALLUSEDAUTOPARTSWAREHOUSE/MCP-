import { NextResponse } from 'next/server'
import { resolveFeedItemId, getEffectiveProduct, getAllOverrides, isFeedEligible } from '@/lib/merchant'
import { getBrandLabel } from '@/lib/brand-catalog'

import { SHIPPING } from '@/lib/site-policy'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resolved = resolveFeedItemId(id)

  if (!resolved) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const { brand, product } = resolved
  let overrides: Awaited<ReturnType<typeof getAllOverrides>>
  try {
    overrides = await getAllOverrides()
  } catch {
    return NextResponse.json({ error: 'Unable to verify this item. Please try again.' }, { status: 503 })
  }
  const effective = getEffectiveProduct(brand, product, overrides.get(`${brand}/${product.canonicalSlug}`) ?? null)

  if (!isFeedEligible(effective) || effective.availability !== 'in_stock') {
    return NextResponse.json({ error: 'Item not available' }, { status: 404 })
  }

  return NextResponse.json({
    item: {
      id: product.canonicalSlug,
      name: effective.title,
      price: effective.price,
      image: effective.imageUrl,
      make: getBrandLabel(brand),
      partType: product.category,
      shippingCost: SHIPPING.price,
    },
  })
}
