'use client'

import { use } from 'react'
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
import { PartRecommendations } from '@/components/ai/part-recommendations'
import { getAcuraProductBySlug, getRelatedAcuraProducts, resolveAcuraImage } from '@/lib/acura-data'
import { Star, ShieldCheck, Truck, BadgeCheck, ChevronRight } from 'lucide-react'

export default function AcuraProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getAcuraProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = getRelatedAcuraProducts(product)
  const productImage = resolveAcuraImage(product)
  const priceDisplay = `$${product.price.toLocaleString()}`

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/acura" className="hover:text-primary transition-colors">Acura Parts</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
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
                  src={productImage}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 left-4 capitalize">{product.category}</Badge>
                {product.availability && (
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white capitalize">{product.availability}</Badge>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground text-balance">{product.name}</h1>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-foreground">4.8</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Verified seller</span>
                    <span className="text-sm text-muted-foreground">SKU: {product.mpn}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-semibold text-foreground capitalize">{product.condition || 'Used'}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Warranty</div>
                    <div className="font-semibold text-foreground">{product.warranty || '90 Days'}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Shipping</div>
                    <div className="font-semibold text-foreground">{product.shipping || 'Free Shipping'}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Fits</div>
                    <div className="font-semibold text-foreground text-sm">{product.compatibility}</div>
                  </div>
                </div>

                {/* Pricing by mileage */}
                <div className="rounded-lg border border-border/40 bg-card/50 p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Pricing by Mileage</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Low</div>
                      <div className="font-bold text-foreground">${(product.pricingTiers?.low ?? product.price).toLocaleString()}</div>
                    </div>
                    <div className="border-x border-border/40">
                      <div className="text-xs text-muted-foreground">Medium</div>
                      <div className="font-bold text-primary">${(product.pricingTiers?.medium ?? product.price).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">High</div>
                      <div className="font-bold text-foreground">${(product.pricingTiers?.high ?? product.price).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-primary">{priceDisplay}</span>
                  <span className="text-sm text-muted-foreground">+ free shipping</span>
                </div>

                {/* Actions */}
                <ProductCardActions
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price}
                  productImage={productImage}
                  productType={product.category}
                  make={product.compatibility || 'Acura'}
                  shipping={product.shipping}
                />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{product.warranty || '90 Days'} warranty</span>
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

        {/* AI-Powered Recommendations */}
        <section className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PartRecommendations productId={product.id} />
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-12 bg-card/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black text-foreground mb-6">Related Acura Parts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((rp) => (
                  <Link key={rp.id} href={`/acura/${rp.slug}`}>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden h-full">
                      <div className="relative w-full h-40 bg-muted">
                        <Image src={resolveAcuraImage(rp)} alt={rp.name} fill unoptimized className="object-cover" />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge className="w-fit mb-1 capitalize">{rp.category}</Badge>
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
        <PartsDetails partType={product.category} yearRange="1990-Present" mileageRange="0-200,000 miles" />

        {/* Parts History */}
        <PartsHistory partType={product.category} />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* FAQ */}
        <ProductFAQ productType={product.category} />
      </main>
      <Footer />
    </>
  )
}
