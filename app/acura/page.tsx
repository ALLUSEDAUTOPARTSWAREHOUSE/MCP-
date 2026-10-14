'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import acuraData from '@/lib/acura-products.json'
import { resolveAcuraImage } from '@/lib/acura-data'
import { ProductCardActions } from '@/components/products/product-card-actions'

// Extract the base model name (e.g. "CL") from a full year-model key
// (e.g. "2003 Acura CL"). Falls back to the last word.
function baseModelName(key: string): string {
  const cleaned = key.replace(/\b(19|20)\d{2}\b/g, '').replace(/acura/i, '').trim()
  return cleaned || key.split(' ').pop() || key
}

export default function AcuraProductsPage() {
  const acuraProducts = useMemo(() => acuraData as any, [])

  // Consolidate the 173 year-model keys into unique base models (CL, MDX, TL...),
  // merging each model's products by category across all years.
  const { modelsList, byModel } = useMemo(() => {
    const grouped = (acuraProducts.grouped as any) || {}
    const byModel: Record<string, Record<string, any[]>> = {}
    for (const fullKey of Object.keys(grouped)) {
      const model = baseModelName(fullKey)
      byModel[model] = byModel[model] || {}
      const cats = grouped[fullKey] || {}
      for (const cat of Object.keys(cats)) {
        byModel[model][cat] = (byModel[model][cat] || []).concat(cats[cat] || [])
      }
    }
    return { modelsList: Object.keys(byModel).sort(), byModel }
  }, [acuraProducts])

  const [selectedModel, setSelectedModel] = useState(modelsList[0] || 'Acura')
  const currentModelData = useMemo(() => byModel[selectedModel] || {}, [selectedModel, byModel])
  const categories = Object.keys(currentModelData)

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            𝐀𝐂𝐔𝐑𝐀 Used Auto Parts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium quality used Acura parts from our 2,000+ yard network. Browse {acuraProducts.products?.length || 0} products across {modelsList.length} vehicle models with verified pricing and warranty.
          </p>
        </div>

        {/* Model Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2 bg-card/50 rounded-lg">
            {modelsList.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => setSelectedModel(model)}
                aria-pressed={selectedModel === model}
                className={`text-xs sm:text-sm whitespace-nowrap rounded-md px-2 py-2 font-semibold transition-colors ${
                  selectedModel === model
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          {/* Products Display */}
          <div className="mt-8">
              <div className="space-y-6">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="border-t border-border/50 pt-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6 capitalize">
                        {category}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(currentModelData[category] as any[] || []).map((product: any) => {
                          const resolvedImage = resolveAcuraImage(product)
                          return (
                          <Card 
                            key={product.id} 
                            className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden flex flex-col"
                          >
                            {/* Product Image */}
                            <Link href={`/acura/${product.slug}`} className="relative h-48 w-full bg-muted overflow-hidden block">
                              <Image
                                src={resolvedImage}
                                alt={product.name}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover hover:scale-105 transition-transform"
                              />
                            </Link>
                            
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {product.condition || 'Used'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {product.availability || 'In Stock'}
                                </Badge>
                              </div>
                              <Link href={`/acura/${product.slug}`}>
                                <CardTitle className="text-base line-clamp-2 hover:text-primary transition-colors">
                                  {product.name}
                                </CardTitle>
                              </Link>
                              {product.compatibility && (
                                <CardDescription className="text-xs">
                                  Fits: {product.compatibility}
                                </CardDescription>
                              )}
                            </CardHeader>

                            <CardContent className="flex-1 pb-4">
                              {/* Pricing Tiers */}
                              <div className="mb-4 p-3 bg-card/50 rounded-lg border border-border/50">
                                <p className="text-sm font-semibold text-foreground mb-2">
                                  Pricing by Mileage:
                                </p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <p>
                                    <span className="font-medium">Low:</span> ${product.pricingTiers?.low || 'N/A'}
                                  </p>
                                  <p>
                                    <span className="font-medium">Medium:</span> ${product.price}
                                  </p>
                                  <p>
                                    <span className="font-medium">High:</span> ${product.pricingTiers?.high || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              {/* Warranty & Shipping */}
                              <div className="space-y-1 text-xs">
                                {product.warranty && (
                                  <p className="text-muted-foreground">
                                    <span className="font-medium">Warranty:</span> {product.warranty}
                                  </p>
                                )}
                                {product.shipping && (
                                  <p className="text-muted-foreground">
                                    <span className="font-medium">Shipping:</span> {product.shipping}
                                  </p>
                                )}
                              </div>
                            </CardContent>

                            {/* Full Action Buttons: Add to Cart, Buy Now, Call, Message, Quote, Details */}
                            <div className="px-4 pb-4">
                              <ProductCardActions
                                productId={String(product.id)}
                                productName={product.name}
                                productPrice={Number(product.price) || 0}
                                productImage={product.image}
                                productType={category}
                                make="Acura"
                                shipping={product.shipping}
                                detailsHref={`/acura/${product.slug}`}
                              />
                            </div>
                          </Card>
                          )
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products available for this model.</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </main>
  )
}
