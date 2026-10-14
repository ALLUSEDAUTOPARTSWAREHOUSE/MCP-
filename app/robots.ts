import { MetadataRoute } from 'next'
import { BRAND_DIRECTORY } from '@/lib/brand-catalog'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.auapw.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/wishlist', '/comparison', '/api/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      ...BRAND_DIRECTORY.map((brand) => `${baseUrl}/sitemaps/${brand.slug}`),
    ],
  }
}
