import { MetadataRoute } from 'next'
import { PART_CATEGORIES, CAR_MAKES } from '@/lib/data'
import { acuraProducts, getAcuraProductUrl } from '@/lib/acura-data'
import { ACURA_MODEL_DIRECTORY } from '@/lib/acura-model-history'
import { BRAND_DIRECTORY } from '@/lib/brand-catalog'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.auapw.com'

  // Main pages
  const mainPages = [
    '',
    '/about',
    '/contact',
    '/quote',
    '/search',
    '/inventory',
    '/blog',
    '/makes',
    '/parts',
    '/used-engines',
    '/used-transmissions',
    '/cart',
    '/wishlist',
    '/comparison',
    '/privacy-policy',
    '/terms',
    '/return-policy',
    '/shipping-policy',
    '/disclaimer',
    '/cookie-policy',
    '/acceptable-use',
    '/sitemap-page',
  ]

  // Parts category pages
  const partsCategories = [
    '/used-engines-parts',
    '/used-transmissions-parts',
    '/used-drivetrain-parts',
    '/used-electrical-parts',
    '/used-cooling-parts',
    '/used-brakes-parts',
    '/used-suspension-parts',
    '/used-body-parts',
    '/used-exhaust-parts',
  ]

  // Dynamic category pages
  const categoryPages = PART_CATEGORIES.map((cat) => `/parts/${cat.id}`)

  // Individual part pages (all parts from all categories)
  const partPages = PART_CATEGORIES.flatMap((cat) =>
    cat.parts.map((part) => `/parts/${cat.id}/${slugify(part)}`)
  )

  // Make pages
  const makePages = CAR_MAKES.map((make) => `/makes/${slugify(make)}`)

  // Acura model guides and all product pages from the pricing sheet so Google
  // can crawl every history hub, model index, engine, transmission, and part URL.
  const acuraModelPages = ACURA_MODEL_DIRECTORY.map((model) => model.href)
  const acuraProductPages = acuraProducts.map((product) => getAcuraProductUrl(product))

  // Brand directory + per-brand catalog pages. Individual brand product URLs
  // (50k+) live in dedicated per-brand XML sitemaps at /sitemaps/<brand>,
  // referenced from robots.txt so they stay under the 50k-per-file limit.
  const brandPages = ['/brands', ...BRAND_DIRECTORY.map((b) => `/brands/${b.slug}`)]

  // De-duplicate the final route set so every canonical URL appears once.
  const allUrls = [...new Set([
    ...mainPages,
    ...partsCategories,
    ...categoryPages,
    ...partPages,
    ...makePages,
    ...acuraModelPages,
    ...acuraProductPages,
    ...brandPages,
  ])]

  return allUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency:
      url === ''
        ? 'daily'
        : url.includes('/parts/') || url.startsWith('/acura/') || url.startsWith('/brands')
          ? 'weekly'
          : 'monthly',
    priority:
      url === ''
        ? 1
        : url.includes('/parts/') || url.startsWith('/acura/') || url.startsWith('/brands')
          ? 0.8
          : 0.6,
  }))
}
