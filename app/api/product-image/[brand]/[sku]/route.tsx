import { ImageResponse } from 'next/og'
import { getBrandLabel, getBrandProductBySlug, isValidBrand } from '@/lib/brand-catalog'

/** Deterministic 32-bit hash so every SKU gets a stable, distinct look. */
function hashCode(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const CATEGORY_HUES: Record<string, number> = {
  engine: 18,
  transmission: 205,
  electrical: 48,
  cooling: 190,
  suspension: 262,
  brakes: 0,
  body: 150,
  exhaust: 30,
  drivetrain: 280,
}

function categoryHue(category: string, fallback: number): number {
  const c = category.toLowerCase()
  for (const [key, hue] of Object.entries(CATEGORY_HUES)) {
    if (c.includes(key)) return hue
  }
  return fallback
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ brand: string; sku: string }> },
) {
  const { brand, sku } = await params
  if (!isValidBrand(brand)) {
    return new Response('Unknown brand', { status: 404 })
  }
  const product = getBrandProductBySlug(brand, sku)
  if (!product) {
    return new Response('Unknown product', { status: 404 })
  }



  const label = getBrandLabel(brand)
  const seed = hashCode(`${brand}:${product.canonicalSlug}`)
  const productName = product.name.toLowerCase()
  const inferredCategory = productName.includes('engine')
    ? 'engine'
    : productName.includes('transmission') || productName.includes('transaxle')
      ? 'transmission'
      : product.category || 'Used OEM Part'
  const hue = categoryHue(inferredCategory, seed % 360)
  const accent = `hsl(${hue} 72% 52%)`
  const accentSoft = `hsl(${hue} 60% 22%)`
  const bg = `hsl(${(hue + 210) % 360} 18% 10%)`
  const panel = `hsl(${(hue + 210) % 360} 16% 14%)`
  const skuLabel = (product.mpn || product.id || sku).toUpperCase()
  const vehicle = [product.year, label, product.model].filter(Boolean).join(' ')
  const category = inferredCategory.replace(/\b\w/g, (c) => c.toUpperCase())
  const transmissionPhoto = productName.includes('cvt')
    ? '/product-images/transmission/cvt-transmission-branded.png'
    : productName.includes('manual') || /\bmt\b/.test(productName)
      ? '/product-images/transmission/manual-transmission-branded.png'
      : '/product-images/transmission/automatic-transmission-branded.png'
  const mechanicalPhotoUrl = inferredCategory === 'transmission'
    ? new URL(transmissionPhoto, _req.url).toString()
    : null
  // Deterministic fingerprint for products that do not have a category photograph.
  const bars = Array.from({ length: 6 }, (_, i) => 36 + ((seed >> (i * 4)) % 96))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: bg,
          padding: 56,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: accent,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            <div style={{ width: 52, height: 8, backgroundColor: accent, borderRadius: 4 }} />
            {category.toUpperCase()}
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: accentSoft,
              color: 'white',
              borderRadius: 999,
              padding: '12px 28px',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            SKU {skuLabel}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div
            style={{
              width: 370,
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              overflow: 'hidden',
              backgroundColor: panel,
              borderRadius: 24,
              padding: mechanicalPhotoUrl ? 0 : '36px 32px',
            }}
          >
            {mechanicalPhotoUrl ? (
              <img
                src={mechanicalPhotoUrl}
                alt=""
                width={370}
                height={280}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: h,
                  backgroundColor: i % 2 === 0 ? accent : accentSoft,
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', color: 'white', fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>
              {vehicle || label}
            </div>
            <div style={{ display: 'flex', color: `hsl(${hue} 20% 72%)`, fontSize: 32, marginTop: 18, lineHeight: 1.3 }}>
              {product.name.length > 88 ? `${product.name.slice(0, 88)}…` : product.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', color: `hsl(${hue} 14% 60%)`, fontSize: 24, fontWeight: 600 }}>
            Illustrative image — not a photo of the actual unit. Verify VIN & fitment before purchase.
          </div>
          <div style={{ display: 'flex', color: accent, fontSize: 26, fontWeight: 800, letterSpacing: 3 }}>
            AUAPW
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 900,
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    },
  )
}
