'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import { AppleStylePartsSearch, type SearchFilters } from '@/components/apple-style-parts-search'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { SeoBacklinks } from '@/components/seo-backlinks'
import { getProductById, getRelatedProducts } from '@/lib/products-catalog'
import { Star, ShieldCheck, Truck, BadgeCheck, ChevronRight } from 'lucide-react'

import { getPartsSearchUrl } from '@/lib/parts-search-routing'
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const product = getProductById(Number(id))
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product)

  const handleSearch = (filters: SearchFilters) => {
    router.push(getPartsSearchUrl(filters))
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Image */}
              <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden border border-border/40">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 left-4">{product.category}</Badge>
                {product.inStock && (
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">In Stock</Badge>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-foreground text-balance">{product.name}</h1>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-foreground">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-semibold text-foreground">{product.condition}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Mileage</div>
                    <div className="font-semibold text-foreground">{product.mileage}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Warranty</div>
                    <div className="font-semibold text-foreground">{product.warranty}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Fits</div>
                    <div className="font-semibold text-foreground text-sm">{product.fits}</div>
                  </div>
                </div>

                {/* Price — tier picker renders only when real sheet tiers exist */}
                <MileagePriceSelector
                  basePrice={product.price}
                  onTierChange={(_, price) => setSelectedPrice(price)}
                />

                {/* Actions */}
                <ProductCardActions
                  productId={String(product.id)}
                  productName={product.name}
                  productPrice={selectedPrice ?? product.price}
                  productImage={product.image}
                  productType={product.category}
                  make={product.fits}
                />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{product.warranty} warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <span>Free shipping</span>
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

        {/* Apple-style search form */}
        <AppleStylePartsSearch
          onSearch={handleSearch}
          title="Find Another Part"
          subtitle="Browse our complete inventory of quality used auto parts"
        />

        {/* Related Products */}
        <section className="py-12 bg-card/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-foreground mb-6">Related Parts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link key={rp.id} href={`/product/${rp.id}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full">
                    <div className="relative w-full h-40 bg-muted">
                      <Image src={rp.image || "/placeholder.svg"} alt={rp.name} fill className="object-cover" />
                    </div>
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-1">{rp.category}</Badge>
                      <CardTitle className="text-sm">{rp.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-lg font-bold text-primary">{rp.priceDisplay}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Parts Details */}
        <PartsDetails partType={product.category} yearRange="1990-Present" mileageRange="0-200,000 miles" />

        {/* Parts History */}
        <PartsHistory partType={product.category} />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* FAQ */}
        <ProductFAQ productType={product.category} />

        {/* Keyword-rich internal backlinks for Google indexing */}
        <SeoBacklinks make={product.fits} partType={product.category} />
      </main>
      <Footer />
    </>
  )
}
