'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Grid3x3, List } from 'lucide-react'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'

const TRANSMISSION_PARTS = [
  { id: 'automatic-tx', name: 'Automatic Transmission', description: 'Complete automatic transmission assembly', type: 'automatic', avgPrice: 1299 },
  { id: 'manual-tx', name: 'Manual Transmission', description: 'Complete manual transmission assembly', type: 'manual', avgPrice: 899 },
  { id: 'cvt-tx', name: 'CVT Transmission', description: 'Continuously Variable Transmission', type: 'cvt', avgPrice: 1099 },
  { id: 'transfer-case', name: 'Transfer Case', description: 'AWD/4WD transfer case assembly', type: 'transfer', avgPrice: 749 },
  { id: 'torque-converter', name: 'Torque Converter', description: 'OEM torque converter', type: 'component', avgPrice: 399 },
  { id: 'transaxle', name: 'Transaxle Assembly', description: 'Integrated transmission and differential', type: 'component', avgPrice: 1199 },
  { id: 'clutch-kit', name: 'Clutch Kit', description: 'Complete clutch assembly', type: 'component', avgPrice: 299 },
  { id: 'clutch-master', name: 'Clutch Master Cylinder', description: 'Hydraulic clutch master cylinder', type: 'component', avgPrice: 149 },
  { id: 'bell-housing', name: 'Bell Housing', description: 'Transmission bell housing', type: 'component', avgPrice: 199 },
  { id: 'transmission-pan', name: 'Transmission Pan', description: 'OEM transmission oil pan', type: 'component', avgPrice: 99 },
]

const TRANSMISSION_IMAGES: Record<string, string> = {
  'automatic-tx': '/images/acura/transmissions/acura-cl-transmission-automatic.png',
  'manual-tx': '/images/acura/transmissions/acura-cl-transmission-manual.png',
  'cvt-tx': '/images/product-transmission-1.png',
  'transfer-case': '/images/product-transmission-1.png',
  'torque-converter': '/images/product-transmission-1.png',
  'transaxle': '/images/product-transmission-1.png',
  'clutch-kit': '/images/product-transmission-1.png',
  'clutch-master': '/images/product-transmission-1.png',
  'bell-housing': '/images/product-transmission-1.png',
  'transmission-pan': '/images/product-transmission-1.png',
}

export default function TransmissionsProductPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')

  const filteredProducts = useMemo(() => {
    let filtered = TRANSMISSION_PARTS

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType)
    }

    filtered = filtered.filter(p => p.avgPrice >= priceRange[0] && p.avgPrice <= priceRange[1])

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.avgPrice - b.avgPrice)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.avgPrice - a.avgPrice)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchTerm, selectedType, priceRange, sortBy])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-card/50 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-black mb-3 text-foreground">Transmission Parts & Components</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                High-quality used transmissions and components. Automatic, manual, CVT, and all components for reliable performance.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search transmission parts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                    <SelectItem value="transfer">Transfer Case</SelectItem>
                    <SelectItem value="component">Components</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="outline" className="w-full col-span-2 sm:col-span-1" asChild>
                  <Link href="/quote">Get Quote</Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {TRANSMISSION_PARTS.length} products
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((part) => (
                  <Card key={part.id} className="overflow-hidden hover:border-primary/50 transition-all duration-200 group">
                    <div className="relative aspect-square bg-card overflow-hidden">
                      <Image
                        src={TRANSMISSION_IMAGES[part.id] || '/images/product-transmission-1.png'}
                        alt={part.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary/90">In Stock</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{part.name}</CardTitle>
                      <CardDescription className="text-xs">{part.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-primary">${part.avgPrice}</span>
                        <span className="text-xs text-muted-foreground">avg price</span>
                      </div>
                      <ProductCardActions
                        productId={part.id}
                        productName={part.name}
                        productPrice={part.avgPrice}
                        productImage={TRANSMISSION_IMAGES[part.id]}
                        productType={part.type}
                        make="Multi-Make"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((part) => (
                  <Card key={part.id} className="hover:border-primary/50 transition-all duration-200">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-card rounded overflow-hidden">
                        <Image
                          src={TRANSMISSION_IMAGES[part.id] || '/images/product-transmission-1.png'}
                          alt={part.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{part.name}</h3>
                          <p className="text-sm text-muted-foreground">{part.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${part.avgPrice}</span>
                          <Badge>In Stock</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ProductCardActions
                          productId={part.id}
                          productName={part.name}
                          productPrice={part.avgPrice}
                          productImage={TRANSMISSION_IMAGES[part.id]}
                          productType={part.type}
                          make="Multi-Make"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Parts Details Section */}
        <PartsDetails 
          partType="Transmission"
          yearRange="1990-Present"
          mileageRange="0-150,000 miles"
        />

        {/* Parts History Section */}
        <PartsHistory partType="Transmission" />

        {/* Shipping Info Section */}
        <ShippingInfo />

        {/* FAQ Section */}
        <ProductFAQ productType="Transmission" />
      </main>
      <Footer />
    </>
  )
}
