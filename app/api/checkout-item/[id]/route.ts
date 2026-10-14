import { NextResponse } from 'next/server'
import { resolveFeedItemId, getEffectiveProduct, getAllOverrides, isFeedEligible } from '@/lib/merchant'
import { BRAND_DIRECTORY, getBrandLabel } from '@/lib/brand-catalog'
import { primeManualOverlay } from '@/lib/manual-products'

import { SHIPPING } from '@/lib/site-policy'

// Feed ids are "<brand slug, first 12 chars>-<16 hex>" (feedItemId in lib/merchant).
const FEED_ITEM_ID = /^[a-z-]{1,12}-[0-9a-f]{16}$/

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Reject malformed ids before any database work or catalog scan.
  if (!FEED_ITEM_ID.test(id)) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }
  // Admin-added products are in the feed too; load the matching brand's before resolving.
  const prefix = id.slice(0, id.lastIndexOf('-'))
  await Promise.all(
    BRAND_DIRECTORY.filter((b) => b.slug.slice(0, 12) === prefix).map((b) => primeManualOverlay(b.slug)),
  )
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
