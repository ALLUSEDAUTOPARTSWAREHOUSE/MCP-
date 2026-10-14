import { MetadataRoute } from 'next'
import { PART_CATEGORIES, CAR_MAKES } from '@/lib/data'

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

  // Combine all URLs
  const allUrls = [
    ...mainPages,
    ...partsCategories,
    ...categoryPages,
    ...partPages,
    ...makePages,
  ]

  return allUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: url === '' ? 'daily' : url.includes('/parts/') ? 'weekly' : 'monthly',
    priority: url === '' ? 1 : url.includes('/parts/') ? 0.8 : 0.6,
  }))
}
