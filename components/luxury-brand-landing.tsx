'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Shield, Truck, Clock, ArrowRight } from 'lucide-react'
import { SearchForm } from '@/components/search-form'

interface LuxuryBrandLandingProps {
  brand: string
  label: string
  productCount: number
  description?: string
}

interface BrandIdentity {
  /** Brand color as an "r, g, b" string, tuned to read well on a dark background. */
  rgb: string
  /** Founding year shown under the logo. */
  founded?: string
}

// One tuned brand color per manufacturer. Everything else (gradients, borders,
// logo, buttons, cards) is derived from this at runtime via inline styles so
// the colors reliably render for every brand.
const BRAND_IDENTITY: Record<string, BrandIdentity> = {
  acura: { rgb: '220, 60, 70', founded: '1986' },
  'alfa-romeo': { rgb: '214, 65, 78', founded: '1910' },
  amc: { rgb: '205, 70, 78', founded: '1954' },
  audi: { rgb: '235, 70, 75', founded: '1909' },
  bmw: { rgb: '72, 148, 226', founded: '1916' },
  buick: { rgb: '206, 165, 96', founded: '1899' },
  cadillac: { rgb: '208, 74, 98', founded: '1902' },
  chevrolet: { rgb: '248, 191, 48', founded: '1911' },
  chrysler: { rgb: '120, 182, 224', founded: '1925' },
  daewoo: { rgb: '74, 140, 210', founded: '1937' },
  daihatsu: { rgb: '226, 74, 74', founded: '1907' },
  dodge: { rgb: '228, 62, 62', founded: '1900' },
  eagle: { rgb: '150, 168, 190', founded: '1988' },
  fiat: { rgb: '214, 74, 92', founded: '1899' },
  ford: { rgb: '66, 128, 235', founded: '1903' },
  geo: { rgb: '64, 176, 132', founded: '1989' },
  gmc: { rgb: '212, 68, 68', founded: '1911' },
  honda: { rgb: '230, 66, 66', founded: '1948' },
  hummer: { rgb: '176, 184, 120', founded: '1992' },
  hyundai: { rgb: '86, 138, 210', founded: '1967' },
  infiniti: { rgb: '172, 182, 194', founded: '1989' },
  isuzu: { rgb: '224, 66, 76', founded: '1916' },
  jaguar: { rgb: '86, 172, 124', founded: '1935' },
  jeep: { rgb: '104, 168, 108', founded: '1943' },
  kia: { rgb: '224, 72, 92', founded: '1944' },
  'land-rover': { rgb: '78, 166, 118', founded: '1948' },
  lexus: { rgb: '184, 194, 206', founded: '1989' },
  lincoln: { rgb: '176, 190, 214', founded: '1917' },
  mazda: { rgb: '226, 66, 86', founded: '1920' },
  'mercedes-benz': { rgb: '196, 202, 208', founded: '1926' },
  mercury: { rgb: '150, 164, 188', founded: '1938' },
  mini: { rgb: '224, 68, 76', founded: '1959' },
  mitsubishi: { rgb: '230, 70, 80', founded: '1917' },
  nissan: { rgb: '224, 60, 60', founded: '1933' },
  oldsmobile: { rgb: '206, 76, 86', founded: '1897' },
  opel: { rgb: '244, 206, 60', founded: '1862' },
  peugeot: { rgb: '80, 130, 210', founded: '1810' },
  plymouth: { rgb: '76, 150, 210', founded: '1928' },
  pontiac: { rgb: '214, 78, 78', founded: '1926' },
  porsche: { rgb: '218, 76, 76', founded: '1931' },
  renault: { rgb: '246, 212, 66', founded: '1899' },
  saab: { rgb: '76, 152, 206', founded: '1945' },
  saturn: { rgb: '212, 76, 82', founded: '1985' },
  scion: { rgb: '178, 188, 200', founded: '2003' },
  subaru: { rgb: '84, 146, 224', founded: '1953' },
  suzuki: { rgb: '228, 68, 84', founded: '1909' },
  toyota: { rgb: '228, 64, 72', founded: '1937' },
  triumph: { rgb: '80, 140, 210', founded: '1885' },
  volkswagen: { rgb: '74, 146, 220', founded: '1937' },
  volvo: { rgb: '92, 154, 214', founded: '1927' },
}

// Real brand logo files in /public/logos (extensions vary per file).
const BRAND_LOGO: Record<string, string> = {
  acura: '/logos/acura.png',
  'alfa-romeo': '/logos/alfa-romeo.png',
  amc: '/logos/amc.png',
  'aston-martin': '/logos/aston-martin.png',
  audi: '/logos/audi.png',
  austin: '/logos/austin.png',
  bmw: '/logos/bmw.png',
  buick: '/logos/buick.png',
  cadillac: '/logos/cadillac.png',
  chevrolet: '/logos/chevrolet.png',
  chrysler: '/logos/chrysler.png',
  daewoo: '/logos/daewoo.png',
  daihatsu: '/logos/daihatsu.png',
  dodge: '/logos/dodge.png',
  eagle: '/logos/eagle.png',
  fiat: '/logos/fiat.png',
  ford: '/logos/ford.png',
  geo: '/logos/geo.png',
  gmc: '/logos/gmc.png',
  honda: '/logos/honda.png',
  hummer: '/logos/hummer.png',
  hyundai: '/logos/hyundai.png',
  infiniti: '/logos/infiniti.png',
  isuzu: '/logos/isuzu.png',
  jaguar: '/logos/jaguar.png',
  jeep: '/logos/jeep.png',
  kia: '/logos/kia.png',
  'land-rover': '/logos/land-rover.png',
  lexus: '/logos/lexus.png',
  lincoln: '/logos/lincoln.png',
  mazda: '/logos/mazda.png',
  'mercedes-benz': '/logos/mercedes-benz.png',
  mercury: '/logos/mercury.png',
  mini: '/logos/mini.png',
  mitsubishi: '/logos/mitsubishi.png',
  nissan: '/logos/nissan.png',
  oldsmobile: '/logos/oldsmobile.png',
  opel: '/logos/opel.png',
  peugeot: '/logos/peugeot.png',
  plymouth: '/logos/plymouth.png',
  pontiac: '/logos/pontiac.png',
  porsche: '/logos/porsche.png',
  renault: '/logos/renault.png',
  saab: '/logos/saab.png',
  saturn: '/logos/saturn.png',
  scion: '/logos/scion.png',
  subaru: '/logos/subaru.png',
  suzuki: '/logos/suzuki.png',
  toyota: '/logos/toyota.png',
  triumph: '/logos/triumph.png',
  volkswagen: '/logos/volkswagen.png',
  volvo: '/logos/volvo.png',
}

// Brands that have a real hero curve image in /public/brand-curves.
const BRANDS_WITH_IMAGE = new Set([
  'bmw',
  'chevrolet',
  'ford',
  'mercedes-benz',
  'porsche',
  'toyota',
  'honda',
  'nissan',
  'dodge',
  'audi',
  'jeep',
  'volkswagen',
  'lexus',
  'hyundai',
])

// Brands that have a real hero car photograph in /public/brand-cars.
const BRANDS_WITH_CAR = new Set([
  'acura',
  'alfa-romeo',
  'amc',
  'audi',
  'bmw',
  'buick',
  'cadillac',
  'chevrolet',
  'chrysler',
  'daewoo',
  'daihatsu',
  'dodge',
  'eagle',
  'fiat',
  'ford',
  'geo',
  'gmc',
  'honda',
  'hummer',
  'hyundai',
  'infiniti',
  'isuzu',
  'jaguar',
  'jeep',
  'kia',
  'land-rover',
  'lexus',
  'lincoln',
  'mazda',
  'mercedes-benz',
  'mercury',
  'mini',
  'mitsubishi',
  'nissan',
  'oldsmobile',
  'opel',
  'peugeot',
  'plymouth',
  'pontiac',
  'porsche',
  'renault',
  'saab',
  'saturn',
  'scion',
  'subaru',
  'suzuki',
  'toyota',
  'triumph',
  'volkswagen',
  'volvo',
])

const DEFAULT_IDENTITY: BrandIdentity = { rgb: '210, 170, 80' }

function readableTextColor(rgb: string): string {
  const [r, g, b] = rgb.split(',').map((n) => Number.parseInt(n.trim(), 10))
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  // If the brand color is very bright (e.g. yellows), dark text reads better.
  return luminance > 175 ? '#0f172a' : '#ffffff'
}

export function LuxuryBrandLanding({
  brand,
  label,
  productCount,
  description,
}: LuxuryBrandLandingProps) {
  const identity = BRAND_IDENTITY[brand] || DEFAULT_IDENTITY
  const rgb = identity.rgb
  const accent = `rgb(${rgb})`
  const onAccentText = readableTextColor(rgb)
  const hasImage = BRANDS_WITH_IMAGE.has(brand)
  const curveImage = `/brand-curves/${brand}-curves.png`
  const hasCar = BRANDS_WITH_CAR.has(brand)
  const carImage = `/brand-cars/${brand}-car.png`
  const logoSrc = BRAND_LOGO[brand]

  const heroBackground = `linear-gradient(135deg, #0f172a 0%, rgba(${rgb}, 0.22) 50%, #0f172a 100%)`
  const logoGradient = `linear-gradient(135deg, rgb(${rgb}) 0%, rgba(${rgb}, 0.65) 100%)`
  const softBorder = `rgba(${rgb}, 0.3)`
  const cardBorder = `rgba(${rgb}, 0.22)`

  const trust = [
    { icon: Shield, label: 'Certified OEM' },
    { icon: Truck, label: 'Fast Shipping' },
    { icon: Clock, label: '24/7 Support' },
    { icon: Star, label: '4.8 Rating' },
  ]

  const featured = [
    { label: 'Engine', note: 'Tested & compression-checked', image: '/product-images/showcase/featured-engine.png' },
    { label: 'Transmission', note: 'Complete assembly, ready to fit', image: '/product-images/showcase/featured-transmission.png' },
    { label: 'Assembly', note: 'Genuine OEM component', image: '/product-images/showcase/featured-assembly.png' },
  ]

  return (
    <div>
      {/* PRIMARY HERO BANNER */}
      <section className="relative overflow-hidden" style={{ background: heroBackground }}>
        {/* Brand car photograph (preferred), falling back to the curve artwork */}
        {(hasCar || hasImage) && (
          <div className={hasCar ? 'absolute inset-0 opacity-50' : 'absolute inset-0 opacity-30'}>
            <Image
              src={hasCar ? carImage : curveImage}
              alt={hasCar ? `${label} vehicle` : `${label} styling`}
              fill
              className="object-cover object-center"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 55%, rgba(15,23,42,0.25) 100%)',
              }}
            />
          </div>
        )}

        {/* Color glow accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl"
            style={{ background: `rgba(${rgb}, 0.18)` }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full blur-3xl"
            style={{ background: `rgba(${rgb}, 0.12)` }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Brand info with logo */}
            <div className="space-y-6">
              {/* Brand logo */}
              <div className="flex items-center gap-4">
                {logoSrc ? (
                  <Image
                    src={logoSrc || "/placeholder.svg"}
                    alt={`${label} logo`}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
                    priority
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-xl border-2 shadow-lg"
                    style={{ background: logoGradient, borderColor: accent }}
                  >
                    <span className="text-3xl font-black" style={{ color: onAccentText }}>
                      {label.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: accent }}
                  >
                    Premium Parts
                  </p>
                  {identity.founded && (
                    <p className="text-sm text-slate-300/70">Since {identity.founded}</p>
                  )}
                </div>
              </div>

              {/* Title + description */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white text-balance">
                  {label}
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-slate-300/80">
                  {description ||
                    `Discover our exclusive collection of premium ${label} engines, transmissions, and OEM parts. Every component is carefully selected for quality and authenticity.`}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  className="rounded-lg border bg-slate-900/50 p-4 backdrop-blur"
                  style={{ borderColor: cardBorder }}
                >
                  <p className="text-2xl font-black" style={{ color: accent }}>
                    {(productCount / 1000).toFixed(1)}K+
                  </p>
                  <p className="mt-1 text-xs text-slate-300/70">Parts Available</p>
                </div>
                <div
                  className="rounded-lg border bg-slate-900/50 p-4 backdrop-blur"
                  style={{ borderColor: cardBorder }}
                >
                  <p className="text-2xl font-black" style={{ color: accent }}>
                    90
                  </p>
                  <p className="mt-1 text-xs text-slate-300/70">Day Warranty</p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {trust.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 flex-shrink-0" style={{ color: accent }} />
                    <span className="text-xs text-slate-300/80">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                <Link
                  href={`#${brand}-products`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-opacity hover:opacity-90"
                  style={{ background: accent, color: onAccentText }}
                >
                  Explore All Parts
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center rounded-lg border px-6 py-3 font-bold text-white transition-colors hover:bg-white/5"
                  style={{ borderColor: softBorder }}
                >
                  Request Quote
                </Link>
              </div>
            </div>

            {/* Right: Car photo showcase with logo badge */}
            <div className="relative hidden lg:block">
              {hasCar ? (
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-2xl"
                  style={{ borderColor: softBorder }}
                >
                  <Image
                    src={carImage || "/placeholder.svg"}
                    alt={`${label} vehicle`}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(15,23,42,0) 40%, rgba(15,23,42,0.75) 100%)',
                    }}
                  />
                  {/* Logo badge over the car */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    {logoSrc ? (
                      <Image
                        src={logoSrc || "/placeholder.svg"}
                        alt={`${label} logo`}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                      />
                    ) : (
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-lg"
                        style={{ background: logoGradient, borderColor: accent }}
                      >
                        <span className="text-2xl font-black" style={{ color: onAccentText }}>
                          {label.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-white">{label}</p>
                      <p className="text-xs text-slate-300/80">Genuine OEM Parts</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative aspect-square overflow-hidden rounded-2xl border p-8 backdrop-blur-sm"
                  style={{
                    borderColor: softBorder,
                    background: `linear-gradient(135deg, rgba(${rgb}, 0.18) 0%, rgba(${rgb}, 0.06) 100%)`,
                  }}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute right-8 top-8 h-32 w-32 rounded-full border-2"
                      style={{ borderColor: accent }}
                    />
                    <div
                      className="absolute bottom-12 left-12 h-40 w-40 rounded-full border-2"
                      style={{ borderColor: softBorder }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                      style={{ borderColor: cardBorder }}
                    />
                  </div>
                  <div className="relative flex h-full items-center justify-center">
                    {logoSrc ? (
                      <Image
                        src={logoSrc || "/placeholder.svg"}
                        alt={`${label} logo`}
                        width={224}
                        height={224}
                        className="h-56 w-56 object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                        priority
                      />
                    ) : (
                      <div
                        className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 shadow-2xl"
                        style={{ background: logoGradient, borderColor: accent }}
                      >
                        <span className="text-8xl font-black" style={{ color: onAccentText }}>
                          {label.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FIND YOUR PARTS SEARCH BANNER */}
      <section
        className="relative border-t"
        style={{ background: heroBackground, borderColor: softBorder }}
        aria-label={`Search ${label} parts`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="absolute left-0 top-1/2 h-64 w-64 rounded-full blur-3xl"
            style={{ background: accent }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black uppercase tracking-[0.15em] text-white lg:text-4xl text-balance">
              Find Your Parts
            </h2>
            <p className="mt-2 text-slate-300/70">
              Search across 2,000+ salvage yards nationwide
            </p>
          </div>
          <SearchForm compact />
        </div>
      </section>

      {/* SECONDARY FEATURED PRODUCTS BANNER */}
      <section
        className="relative border-b border-t"
        style={{ background: heroBackground, borderColor: softBorder }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div
            className="absolute right-0 top-1/2 h-64 w-64 rounded-full blur-3xl"
            style={{ background: accent }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white lg:text-4xl text-balance">
              Featured {label} Components
            </h2>
            <p className="mt-2 text-slate-300/70">
              Premium engines, transmissions, and essential parts
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.label}
                href={`#${brand}-products`}
                className="group relative overflow-hidden rounded-xl border transition-all hover:-translate-y-1"
                style={{ borderColor: cardBorder }}
              >
                <div className="space-y-4 bg-slate-900/60 p-6">
                  <div
                    className="relative flex aspect-video items-center justify-center rounded-lg border overflow-hidden transition-transform group-hover:scale-[1.02]"
                    style={{
                      borderColor: cardBorder,
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={`${label} ${item.label}`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : logoSrc ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, rgba(${rgb}, 0.2) 0%, rgba(${rgb}, 0.06) 100%)`,
                        }}
                      >
                        <Image
                          src={logoSrc}
                          alt={`${label} logo`}
                          width={120}
                          height={64}
                          className="h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
                        />
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, rgba(${rgb}, 0.2) 0%, rgba(${rgb}, 0.06) 100%)`,
                        }}
                      >
                        <span className="text-2xl font-black text-white/80">{label}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-bold text-white">
                        {label} {item.label}
                      </h3>
                      <span
                        className="rounded px-2 py-1 text-xs font-bold"
                        style={{ background: `rgba(${rgb}, 0.15)`, color: accent }}
                      >
                        OEM
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/70">{item.note}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-black" style={{ color: accent }}>
                        Explore →
                      </span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((s) => (
                          <Star key={s} className="h-3 w-3" style={{ color: accent, fill: accent }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={`#${brand}-products`}
              className="inline-flex items-center gap-2 text-lg font-bold transition-opacity hover:opacity-80"
              style={{ color: accent }}
            >
              View All {label} Parts ({(productCount / 1000).toFixed(1)}K+)
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
