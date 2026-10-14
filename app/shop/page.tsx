'use client'

import { useState } from 'react'
import { Search, Grid, List, ChevronRight, Settings, Wrench } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AppleStylePartsSearch, type SearchFilters } from '@/components/apple-style-parts-search'
import brandManifest from '@/data/brands/manifest.json'
import { BRAND_COLORS, getBrandLogoUrl } from '@/lib/data'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

const INVENTORY_BRANDS = brandManifest.filter((brand) => brand.count > 0)

function makeToSlug(make: string): string {
  return make.toLowerCase().replace(/\s+/g, '-')
}

function getInitials(brand: string): string {
  const words = brand.split(/[\s-]+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return brand.substring(0, brand.length > 4 ? 3 : brand.length).toUpperCase()
}

function getCountBadgeColor(count: number): string {
  if (count >= 2000) return 'bg-green-900 text-green-200'
  if (count >= 500) return 'bg-yellow-900 text-yellow-200'
  return 'bg-red-900 text-red-200'
}

function BrandLogo({ brand, size = 'sm' }: { brand: string; size?: 'sm' | 'lg' }) {
  const [imgFailed, setImgFailed] = useState(false)
  const logoUrl = getBrandLogoUrl(brand)
  const color = BRAND_COLORS[brand] || '#333'
  const initials = getInitials(brand)
  const w = size === 'lg' ? 'w-[88px] h-[56px]' : 'w-[72px] h-[48px]'
  const textSize = size === 'lg' ? 'text-lg' : 'text-[13px]'
  return (
    <div className={`${w} luxury-logo-tile flex items-center justify-center rounded-lg shrink-0 overflow-hidden`}>
      {logoUrl && !imgFailed ? (
        <img
          src={logoUrl}
          alt={`${brand} logo`}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd, ${color}88)` }}>
          <span className={`${textSize} font-black text-white/90 uppercase tracking-wider leading-none select-none`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.1)' }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}

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
  const router = useRouter()
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Engines', 'Transmissions', 'Electrical', 'Cooling', 'Drivetrain']

  const handleSearch = (filters: SearchFilters) => {
    router.push(getPartsSearchUrl(filters))
  }

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
      <main className="bg-background pt-24 lg:pt-28">
        {/* Header */}
        <div className="relative border-b border-border/20 bg-cover bg-center py-20" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(13,15,22,0.9), rgba(13,15,22,0.7), rgba(13,15,22,0.88)), url('/images/heroes/hero-warehouse.png')" }}>
          <div className="mx-auto max-w-[1280px] px-6">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">Shop Quality Auto Parts</h1>
            <p className="text-slate-200/90">Browse our selection of premium used auto parts with warranty</p>
          </div>
        </div>

        {/* Apple-style search form */}
        <AppleStylePartsSearch
          onSearch={handleSearch}
          title="Find Your Parts"
          subtitle="Search across 2,000+ salvage yards nationwide"
        />

        <section className="border-b border-border/20 bg-background py-12" aria-labelledby="shop-by-brand-heading">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Live Inventory</p>
              <h2 id="shop-by-brand-heading" className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                Shop Used Parts by Brand
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Choose a brand to browse available engines, transmissions, and OEM parts with exact inventory pricing.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {INVENTORY_BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group relative flex flex-col gap-4 p-6 rounded-xl border-2 transition-all cursor-pointer border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.6)] hover:border-slate-500 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.8)]"
                >
                  {/* Header: Logo + Brand Name + Parts Count */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-wider leading-tight mb-1 text-white">
                        {brand.label}
                      </h3>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${getCountBadgeColor(brand.count)}`}>
                        {brand.count.toLocaleString()} parts
                      </div>
                    </div>
                    <BrandLogo brand={brand.label} size="sm" />
                  </div>

                  {/* Icons: Engines & Transmissions */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 shrink-0" />
                      <span>Used Engines</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      <span>Transmissions</span>
                    </div>
                  </div>

                  {/* Browse Link */}
                  <div className="text-sm font-bold flex items-center gap-1.5 text-white">
                    <span className="group-hover:underline">Browse {brand.label} parts</span>
                    <span className="text-lg group-hover:translate-x-0.5 transition-transform">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
