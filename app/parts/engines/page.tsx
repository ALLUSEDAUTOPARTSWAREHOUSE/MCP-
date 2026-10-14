'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCardActions } from '@/components/products/product-card-actions'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, Grid3x3, List, ChevronDown } from 'lucide-react'
import { CAR_MAKES } from '@/lib/data'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'

const ENGINE_PARTS = [
  { id: 'complete-engine', name: 'Complete Engine', description: 'Fully assembled ready-to-run engines', category: 'engine', avgPrice: 899 },
  { id: 'long-block', name: 'Long Block Engine', description: 'Engine block with heads, valves, and manifolds', category: 'engine', avgPrice: 749 },
  { id: 'short-block', name: 'Short Block Engine', description: 'Core engine block with crank and pistons', category: 'engine', avgPrice: 599 },
  { id: 'cylinder-head', name: 'Cylinder Head', description: 'Complete cylinder head assembly', category: 'engine', avgPrice: 349 },
  { id: 'engine-block', name: 'Engine Block', description: 'Bare engine block', category: 'engine', avgPrice: 299 },
  { id: 'crankshaft', name: 'Crankshaft', description: 'OEM crankshaft assembly', category: 'engine', avgPrice: 199 },
  { id: 'camshaft', name: 'Camshaft', description: 'Performance or OEM camshaft', category: 'engine', avgPrice: 149 },
  { id: 'pistons', name: 'Pistons & Rings', description: 'Complete piston and ring sets', category: 'engine', avgPrice: 199 },
  { id: 'timing-chain', name: 'Timing Chain Kit', description: 'Complete timing chain assembly with tensioners', category: 'engine', avgPrice: 249 },
  { id: 'oil-pump', name: 'Oil Pump', description: 'Engine oil pump assembly', category: 'engine', avgPrice: 129 },
]

const ENGINE_IMAGES: Record<string, string> = {
  'complete-engine': '/images/acura/engines/acura-cl-engine-v6-3.2l.png',
  'long-block': '/images/acura/engines/acura-ilx-engine.png',
  'short-block': '/images/acura/engines/acura-rdx-engine.png',
  'cylinder-head': '/images/acura/engines/acura-mdx-engine.png',
  'engine-block': '/images/product-engine-1.png',
  'crankshaft': '/images/product-engine-1.png',
  'camshaft': '/images/product-engine-1.png',
  'pistons': '/images/product-engine-1.png',
  'timing-chain': '/images/product-engine-1.png',
  'oil-pump': '/images/product-engine-1.png',
}

export default function EnginesProductPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMake, setSelectedMake] = useState('all')
  const [selectedPartType, setSelectedPartType] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = ENGINE_PARTS

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedPartType !== 'all') {
      filtered = filtered.filter(p => p.id === selectedPartType)
    }

    filtered = filtered.filter(p => p.avgPrice >= priceRange[0] && p.avgPrice <= priceRange[1])

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.avgPrice - b.avgPrice)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.avgPrice - a.avgPrice)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchTerm, selectedPartType, priceRange, sortBy])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-card/50 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-black mb-3 text-foreground">Engine Parts & Components</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium quality used engine parts from our 2,000+ yard network. Complete engines, blocks, heads, and components for all makes and models.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Main Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search engine parts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Select value={selectedPartType} onValueChange={setSelectedPartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Part Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Part Types</SelectItem>
                    {ENGINE_PARTS.map(part => (
                      <SelectItem key={part.id} value={part.id}>{part.name}</SelectItem>
                    ))}
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

                <div className="col-span-2 sm:col-span-1">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/quote">
                      <Filter className="w-4 h-4 mr-2" />
                      Get Quote
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {ENGINE_PARTS.length} parts
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No parts found matching your criteria.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((part) => (
                  <Card key={part.id} className="overflow-hidden hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                    <div className="relative aspect-square bg-card overflow-hidden">
                      <Image
                        src={ENGINE_IMAGES[part.id] || '/images/product-engine-1.png'}
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
                        productImage={ENGINE_IMAGES[part.id]}
                        productType={part.category}
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
                          src={ENGINE_IMAGES[part.id] || '/images/product-engine-1.png'}
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
                          productImage={ENGINE_IMAGES[part.id]}
                          productType={part.category}
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
          partType="Engine"
          yearRange="1990-Present"
          mileageRange="0-200,000 miles"
        />

        {/* Parts History Section */}
        <PartsHistory partType="Engine" />

        {/* Shipping Info Section */}
        <ShippingInfo />

        {/* FAQ Section */}
        <ProductFAQ productType="Engine" />
      </main>
      <Footer />
    </>
  )
}
