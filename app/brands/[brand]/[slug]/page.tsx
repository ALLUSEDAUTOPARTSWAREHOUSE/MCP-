import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import { SeoBacklinks } from '@/components/seo-backlinks'
import { BrandPurchasePanel } from '@/components/brands/brand-purchase-panel'
import { BrandProductImage } from '@/components/brands/brand-product-image'
import { BrandProductSearch } from '@/components/brands/brand-product-search'
import {
  getBrandLabel,
  getBrandPartTypeLabel,
  getBrandProductBySlug,
  getBrandProductUrl,
  getProductDisplayImage,
  getRelatedBrandProducts,
  isValidBrand,
  resolveBrandPartImage,
} from '@/lib/brand-catalog'
import { Star, ShieldCheck, Truck, BadgeCheck, ChevronRight, ImageIcon, ExternalLink } from 'lucide-react'

interface PageProps {
  params: Promise<{ brand: string; slug: string }>
}

const SITE_URL = 'https://www.auapw.org'
const WARRANTY = '90 Days'
const SHIPPING = '$240'

function getImageSearchUrl(name: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${name} used OEM part`)}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, slug } = await params
  if (!isValidBrand(brand)) return {}
  const product = getBrandProductBySlug(brand, slug)
  if (!product) return {}
  const label = getBrandLabel(brand)
  return {
    title: `${product.name} | Used OEM ${label} Part — $${product.price.toLocaleString()}`,
    description:
      product.description ||
      `Buy a tested used OEM ${product.name} with exact mileage-based pricing, ${WARRANTY} warranty, and nationwide shipping.`,
    alternates: { canonical: `${SITE_URL}${getBrandProductUrl(brand, product)}` },
  }
}

export default async function BrandProductPage({ params }: PageProps) {
  const { brand, slug } = await params
  if (!isValidBrand(brand)) notFound()
  const product = getBrandProductBySlug(brand, slug)
  if (!product) notFound()

  const label = getBrandLabel(brand)
  const related = getRelatedBrandProducts(brand, product)
  const fallbackImage = resolveBrandPartImage(product)
  const displayImage = getProductDisplayImage(brand, product)
  const partTypeHeading = getBrandPartTypeLabel(product)
  const imageSearchUrl = getImageSearchUrl(product.name)
  const fitmentYear = product.year || '1990-Present'
  const canonicalUrl = product.productUrl || `${SITE_URL}${getBrandProductUrl(brand, product)}`

  // Structured data: exact sheet prices as an AggregateOffer across the three
  // mileage tiers (single Offer when the sheet has one price).
  const tiers = product.tiers
  const lowPrice = tiers ? Math.min(tiers.low, tiers.medium, tiers.high) : product.price
  const highPrice = tiers ? Math.max(tiers.low, tiers.medium, tiers.high) : product.price
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [
      displayImage.illustrative ? `${SITE_URL}${displayImage.generatedSrc}` : displayImage.src,
      `${SITE_URL}${fallbackImage}`,
    ].filter(Boolean),
    description: product.description || product.name,
    sku: product.mpn || product.id,
    mpn: product.mpn || product.id,
    brand: { '@type': 'Brand', name: label },
    category: partTypeHeading,
    url: canonicalUrl,
    offers: tiers
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice,
          highPrice,
          offerCount: 3,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/UsedCondition',
          url: canonicalUrl,
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.price,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/UsedCondition',
          url: canonicalUrl,
        },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/brands/${brand}`} className="hover:text-primary transition-colors">{label} Parts</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
              {/* Image */}
              <div className="relative w-full aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border/40 shadow-lg lg:sticky lg:top-28">
                <BrandProductImage
                  src={displayImage.src}
                  generatedSrc={displayImage.generatedSrc}
                  illustrative={displayImage.illustrative}
                  fallbackSrc={fallbackImage}
                  alt={product.name}
                  sku={product.mpn || product.id}
                  brand={label}
                  year={product.year}
                  model={product.model}
                  category={product.category}
                  priority
                />
                <Badge className="absolute top-4 left-4 capitalize">{product.category || 'Part'}</Badge>
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">In Stock</Badge>

              </div>

              {/* Details */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {partTypeHeading}
                    </span>
                    <a
                      href={imageSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Search this part on Google
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground text-balance">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-foreground">4.8</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Verified seller</span>
                    <span className="text-sm text-muted-foreground">SKU: {product.mpn || product.id}</span>
                  </div>
                </div>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                )}

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-semibold text-foreground">Used</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Warranty</div>
                    <div className="font-semibold text-foreground">{WARRANTY}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Shipping</div>
                    <div className="font-semibold text-foreground">{SHIPPING}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Fits</div>
                    <div className="font-semibold text-foreground text-sm">
                      {product.compatibility || `${label} ${product.model} ${product.year}`.trim()}
                    </div>
                  </div>
                </div>

                {/* Mileage tier pricing + Call/Message/Quote/Cart actions */}
                <BrandPurchasePanel
                  productId={product.id}
                  productName={product.name}
                  basePrice={product.price}
                  tiers={product.tiers}
                  productImage={product.imageUrl || fallbackImage}
                  productType={product.category || 'Part'}
                  make={product.compatibility || label}
                  shipping={SHIPPING}
                />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{WARRANTY} warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <span>{SHIPPING} shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>Fully tested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

  {/* Search another part */}
  <section className="border-y border-border/50 bg-card/20 py-10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mb-6 text-center">
  <h2 className="text-2xl font-black text-foreground">Looking for another {label} part?</h2>
  <p className="mt-2 text-sm text-muted-foreground">
  Search by vehicle and part type, or{' '}
  <Link href="/quote" className="font-medium text-primary hover:underline">
  request a free quote
  </Link>{' '}
  if you can&apos;t find it.
  </p>
  </div>
  <BrandProductSearch defaultMake={label} />
  </div>
  </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-12 bg-card/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black text-foreground mb-6">Related {label} Parts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((rp) => (
                  <Link key={rp.canonicalSlug} href={getBrandProductUrl(brand, rp)}>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden h-full">
                      <div className="relative w-full h-40 bg-muted">
                      <BrandProductImage
                        src={getProductDisplayImage(brand, rp).src}
                        generatedSrc={getProductDisplayImage(brand, rp).generatedSrc}
                        illustrative={getProductDisplayImage(brand, rp).illustrative}
                        fallbackSrc={resolveBrandPartImage(rp)}
                        alt={rp.name}
                          sku={rp.mpn || rp.id}
                          brand={label}
                          year={rp.year}
                          model={rp.model}
                          category={rp.category}
                          compact
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge className="w-fit mb-1 capitalize">{rp.category || 'Part'}</Badge>
                        <CardTitle className="text-sm line-clamp-2">{rp.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-lg font-bold text-primary">${rp.price.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Parts Details */}
        <PartsDetails
          partType={(product.category || 'Part').replace(/^used\s+/i, '')}
          condition="Used - Good Condition"
          yearRange={fitmentYear}
          mileageRange="0-200,000 miles"
        />

        {/* Parts History */}
        <PartsHistory partType={product.category || 'Part'} />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* FAQ */}
        <ProductFAQ productType={product.category || 'Part'} />

        {/* Keyword-rich internal backlinks for Google indexing */}
        <SeoBacklinks make={label} partType={product.category || 'Part'} />
      </main>
      <Footer />
    </>
  )
}
