'use client'

import { useState } from 'react'
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const SHOP_PRODUCTS = [
  {
    id: 1,
    name: '2018 Acura MDX Complete Engine',
    category: 'Engines',
    price: '$1,299',
    mileage: '82,000',
    condition: 'Excellent',
    warranty: '180 days',
    rating: 4.8,
    reviews: 24,
    image: '/images/product-engine-1.png',
  },
  {
    id: 2,
    name: 'Automatic Transmission Assembly',
    category: 'Transmissions',
    price: '$899',
    mileage: '91,000',
    condition: 'Good',
    warranty: '90 days',
    rating: 4.9,
    reviews: 18,
    image: '/images/product-transmission-1.png',
  },
  {
    id: 3,
    name: 'High-Quality Alternator',
    category: 'Electrical',
    price: '$249',
    mileage: '75,000',
    condition: 'Excellent',
    warranty: '90 days',
    rating: 4.7,
    reviews: 31,
    image: '/images/product-alternator-1.png',
  },
  {
    id: 4,
    name: 'Complete Radiator Assembly',
    category: 'Cooling',
    price: '$399',
    mileage: '85,000',
    condition: 'Excellent',
    warranty: '180 days',
    rating: 5.0,
    reviews: 12,
    image: '/images/product-radiator-1.png',
  },
]

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Engines', 'Transmissions', 'Electrical', 'Cooling', 'Drivetrain']

  const filteredProducts = SHOP_PRODUCTS.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = parseInt(product.price.replace('$', '').replace(',', '')) >= priceRange[0] && 
                        parseInt(product.price.replace('$', '').replace(',', '')) <= priceRange[1]
    return matchesCategory && matchesSearch && matchesPrice
  })

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-card/50 to-background border-b border-border/20 py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <h1 className="text-4xl font-black text-foreground text-3d-section mb-2">Shop Quality Auto Parts</h1>
            <p className="text-muted-foreground">Browse our selection of premium used auto parts with warranty</p>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 block">Categories</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory
                          ? 'bg-primary/20 text-primary border border-primary/50'
                          : 'bg-card/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary/20 text-primary border border-primary/50'
                            : 'bg-card/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 block">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/20">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {SHOP_PRODUCTS.length} products
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewType === 'grid'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-card/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewType === 'list'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-card/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className={viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredProducts.map(product => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className={`group cursor-pointer glass-card rounded-lg overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg ${
                        viewType === 'list' ? 'flex gap-4 p-4' : ''
                      }`}>
                        {/* Image */}
                        <div className={`relative ${viewType === 'list' ? 'w-32 h-32 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-card to-background overflow-hidden`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className={viewType === 'list' ? 'flex-1 flex flex-col justify-between' : 'p-4'}>
                          <div>
                            <div className="text-[11px] font-bold text-primary mb-2 uppercase tracking-wider">{product.category}</div>
                            <h3 className="font-bold text-foreground text-sm leading-tight mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Mileage: {product.mileage} miles</div>
                              <div>Condition: {product.condition}</div>
                              <div>Warranty: {product.warranty}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-lg font-black text-primary">{product.price}</span>
                            <div className="text-xs text-muted-foreground">⭐ {product.rating}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
