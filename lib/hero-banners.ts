/**
 * Hero Banner Configuration
 * Maps routes to background images for consistent cinematic automotive aesthetic
 */

const HERO_BANNERS = [
  '/images/hero-banner-1.png',
  '/images/hero-banner-2.png',
  '/images/hero-banner-3.png',
  '/images/hero-banner-4.png',
  '/images/hero-banner-5.png',
  '/images/hero-banner-6.png',
  '/images/hero-banner-7.png',
  '/images/hero-banner-8.png',
  '/images/hero-banner-9.png',
]

/**
 * Cinematic category hero images. Each parts/content route resolves to the most
 * relevant one so banners visually match the page content.
 */
const CATEGORY_HERO: Array<{ test: RegExp; src: string }> = [
  { test: /(engine|motor)/, src: '/images/heroes/hero-engines.png' },
  { test: /(transmission|gearbox)/, src: '/images/heroes/hero-transmissions.png' },
  { test: /brake/, src: '/images/heroes/hero-brakes.png' },
  { test: /(cool|radiator)/, src: '/images/heroes/hero-cooling.png' },
  { test: /(drivetrain|axle|differential)/, src: '/images/heroes/hero-drivetrain.png' },
  { test: /(electric|sensor|alternator)/, src: '/images/heroes/hero-electrical.png' },
  { test: /exhaust/, src: '/images/heroes/hero-exhaust.png' },
  { test: /suspension/, src: '/images/heroes/hero-suspension.png' },
  { test: /body/, src: '/images/heroes/hero-body.png' },
  { test: /(brand|make|acura)/, src: '/images/heroes/hero-brands.png' },
  { test: /(contact|support|help|quote)/, src: '/images/heroes/hero-support.png' },
  { test: /(inventory|salvage|yard)/, src: '/images/heroes/hero-salvage.png' },
  { test: /(about|shop|blog|garage)/, src: '/images/heroes/hero-garage.png' },
  { test: /(catalog|parts|search|product)/, src: '/images/heroes/hero-warehouse.png' },
]

/**
 * Get hero banner image for a specific page.
 * Resolves by route keyword to a relevant cinematic image, falling back to a
 * stable hash-based pick so every page has a banner.
 */
export function getHeroBanner(pathname: string): string {
  const normalized = pathname.toLowerCase()
  for (const { test, src } of CATEGORY_HERO) {
    if (test.test(normalized)) return src
  }
  const hash = pathname
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
  const index = Math.abs(hash) % HERO_BANNERS.length
  return HERO_BANNERS[index]
}

/**
 * Get a random hero banner (for pages that should vary)
 */
export function getRandomHeroBanner(): string {
  const randomIndex = Math.floor(Math.random() * HERO_BANNERS.length)
  return HERO_BANNERS[randomIndex]
}

/**
 * Get a specific hero banner by index
 */
export function getHeroBannerByIndex(index: number): string {
  return HERO_BANNERS[index % HERO_BANNERS.length]
}
