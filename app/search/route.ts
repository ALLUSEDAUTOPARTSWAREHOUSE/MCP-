import { NextRequest, NextResponse } from 'next/server'
import { resolveMake } from '@/lib/ai-catalog'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

// /search used to show sample salvage-yard listings with made-up prices. Old
// links (many pages still pass ?make=&model=&part=) now land on the real
// catalog: the make's brand page when a known make is given, else /brands.
export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const brand = resolveMake(sp.get('make'))
  const target = brand
    ? getPartsSearchUrl({
        make: brand,
        model: sp.get('model') ?? undefined,
        year: sp.get('year') ?? undefined,
        partType: sp.get('part') ?? sp.get('category') ?? undefined,
      })
    : '/brands'
  return NextResponse.redirect(new URL(target, request.url), 308)
}
