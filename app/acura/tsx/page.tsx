'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import Image from 'next/image'
import { Search, Grid3x3, List } from 'lucide-react'
import acuraData from '@/lib/acura-products.json'

export default function AcuraTsxPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  const tsxProducts = useMemo(() => {
    return acuraData.products.filter(p => p.name.includes('TSX'))
  }, [])

  const filteredProducts = useMemo(() => {
    return tsxProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, tsxProducts])

  return (
    <>
      <Navbar />
      <main>
        <section className="py-12 bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Acura TSX Parts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Browse {tsxProducts.length} quality used parts for Acura TSX compact sports sedan models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search TSX parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    {product.image && (
                      <div className="relative w-full h-48 bg-muted">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <Badge className="w-fit mb-2">{product.category}</Badge>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-primary">${product.price}</div>
                      <ProductCardActions
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.image}
                        productType={product.category}
                        make="Acura TSX"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex gap-6 p-6">
                      {product.image && (
                        <div className="relative w-32 h-32 bg-muted flex-shrink-0 rounded-lg">
                          <Image src={product.image} alt={product.name} fill className="object-cover rounded-lg" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Badge className="mb-2">{product.category}</Badge>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <div className="text-2xl font-bold text-primary mt-4">${product.price}</div>
                        <div className="mt-4">
                          <ProductCardActions
                            productId={product.id}
                            productName={product.name}
                            productPrice={product.price}
                            productImage={product.image}
                            productType={product.category}
                            make="Acura TSX"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <PartsDetails partType="Acura TSX" yearRange="2004-2014" mileageRange="0-150,000 miles" />
        <PartsHistory partType="Acura TSX Part" />
        <ShippingInfo />
        <ProductFAQ productType="Acura TSX Parts" />
      </main>
      <Footer />
    </>
  )
}
