'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Shield, Truck, MapPin, Phone, MessageSquare } from 'lucide-react'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock product data - in production, fetch from API based on params.id
  const product = {
    id: params.id,
    name: 'Complete Engine Assembly',
    category: 'Engine',
    make: 'Honda',
    model: 'Civic',
    year: '2015',
    sku: 'ENG-2015-CIVIC-001',
    condition: 'Used - Excellent',
    mileage: '45,000 miles',
    price: 1299.99,
    originalPrice: 1599.99,
    inStock: true,
    rating: 4.8,
    reviews: 124,
    image: '/images/product-engine-1.png',
    description: 'High-quality used 1.8L 4-cylinder engine from a 2015 Honda Civic. Fully tested and inspected. Includes engine block, heads, and all core components.',
    specifications: {
      type: '4-Cylinder',
      displacement: '1800cc',
      horsepower: '140 HP',
      torque: '127 lb-ft',
      fuelType: 'Gasoline',
      compression: '10.5:1',
      valveConfiguration: 'DOHC',
    },
    warranty: '90 Days',
    shipping: 'Free',
    insurance: '$2M Transit Insurance',
    tags: ['Engine', 'Honda', 'Civic', '2015', 'Used', 'Complete'],
  }

  const relatedProducts = [
    { id: 1, name: 'Transmission Assembly', price: 849.99, image: '/images/product-transmission-1.png' },
    { id: 2, name: 'Radiator Cooling System', price: 199.99, image: '/images/product-radiator-1.png' },
    { id: 3, name: 'Alternator Unit', price: 149.99, image: '/images/product-alternator-1.png' },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <section className="py-4 bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/parts/engines" className="hover:text-foreground">Parts</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/parts/${product.category.toLowerCase()}s`} className="hover:text-foreground">
                {product.category}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Header */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Product Image */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <button key={i} className="aspect-square bg-muted rounded border-2 border-transparent hover:border-primary transition-colors">
                      <Image src={product.image} alt={`View ${i}`} fill className="object-cover rounded" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-6">
                {/* Title & Rating */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.condition}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
                  </div>

                  {/* Vehicle Info */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Year</p>
                      <p className="font-semibold text-foreground">{product.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Make</p>
                      <p className="font-semibold text-foreground">{product.make}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Model</p>
                      <p className="font-semibold text-foreground">{product.model}</p>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="flex items-center gap-2 p-3 bg-background border border-border rounded mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm">{product.mileage}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">${product.price}</span>
                    <span className="text-lg line-through text-muted-foreground">${product.originalPrice}</span>
                    <span className="text-sm font-semibold text-green-600">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-green-600 font-medium">In Stock - Ready to Ship</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <ProductCardActions
                    productId={product.id}
                    productName={product.name}
                    productPrice={product.price}
                    productImage={product.image}
                    productType={product.category}
                    make={product.make}
                  />
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">90-Day<br/>Warranty</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">Free<br/>Shipping</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">$2M<br/>Insurance</p>
                  </div>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call (888) 818-5001
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 bg-background border-t border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">SKU</p>
                        <p className="font-semibold">{product.sku}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Condition</p>
                        <p className="font-semibold">{product.condition}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Warranty</p>
                        <p className="font-semibold">{product.warranty}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Shipping</p>
                        <p className="font-semibold">{product.shipping}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6 mt-6">
                <ShippingInfo />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>Based on {product.reviews} verified purchases</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">Great quality part</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellent condition and fast shipping. Part arrived safely and installed perfectly in my {product.year} {product.make} {product.model}.
                        </p>
                        <p className="text-xs text-muted-foreground">By John D. - Verified Purchase</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-12 bg-background border-t border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(prod => (
                <Card key={prod.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <p className="font-semibold text-foreground">{prod.name}</p>
                    <p className="text-lg font-bold text-primary mt-2">${prod.price}</p>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/products/${prod.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Parts Details */}
        <PartsDetails 
          partType={product.category}
          yearRange="1990-Present"
          mileageRange="0-200,000 miles"
        />

        {/* Parts History */}
        <PartsHistory partType={product.category} />

        {/* FAQ */}
        <ProductFAQ productType={product.category} />
      </main>
      <Footer />
    </>
  )
}
