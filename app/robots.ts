import { MetadataRoute } from 'next'
import { BRAND_DIRECTORY } from '@/lib/brand-catalog'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.allusedautopartswarehouse.com'

  return {
    rules: [
      {
        userAgent: '*',
        // Product images are served from /api/product-image and referenced by
        // the product JSON-LD and the Google Shopping feed, so crawlers need them.
        allow: ['/', '/api/product-image/'],
        disallow: [
          '/cart',
          '/wishlist',
          '/api/',
          '/admin',
          '/dashboard',
          '/customer',
          '/checkout',
          '/seller',
          '/buyer',
          '/portal',
          '/chat',
          '/test-plan',
          '/responsive-preview',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      ...BRAND_DIRECTORY.map((brand) => `${baseUrl}/sitemaps/${brand.slug}`),
    ],
  }
}
