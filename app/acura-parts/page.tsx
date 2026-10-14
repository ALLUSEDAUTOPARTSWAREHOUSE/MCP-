'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShoppingCart, Heart, Search, Filter, X, Phone, Mail, ArrowRight, Tag, CheckCircle, Shield } from 'lucide-react'
import { ACURA_PARTS, ACURA_MODELS, ACURA_PART_TYPES, ACURA_YEARS, type AcuraPart } from '@/lib/acura-parts-data'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

export default function AcuraPartsPage() {
  const [search, setSearch] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedPartType, setSelectedPartType] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const addToCart = useCartStore((state) => state.addItem)
  const addToWishlist = useWishlistStore((state) => state.addItem)

  const filteredParts = useMemo(() => {
    return ACURA_PARTS.filter((part) => {
      const matchesSearch = search === '' || 
        part.title.toLowerCase().includes(search.toLowerCase()) ||
        part.partType.toLowerCase().includes(search.toLowerCase())
      const matchesModel = selectedModel === '' || part.model === selectedModel
      const matchesPartType = selectedPartType === '' || part.partType === selectedPartType
      const matchesYear = selectedYear === '' || part.year === selectedYear
      return matchesSearch && matchesModel && matchesPartType && matchesYear
    })
  }, [search, selectedModel, selectedPartType, selectedYear])

  const handleAddToCart = (part: AcuraPart) => {
    addToCart({
      id: part.id,
      name: part.title,
      price: part.price,
      quantity: 1,
      image: part.image,
      make: 'Acura',
      partType: part.partType,
    })
  }

  const handleAddToWishlist = (part: AcuraPart) => {
    addToWishlist({
      id: part.id,
      name: part.title,
      price: part.price,
      image: part.image,
      make: 'Acura',
      partType: part.partType,
      addedAt: Date.now(),
    })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedModel('')
    setSelectedPartType('')
    setSelectedYear('')
  }

  const hasFilters = search || selectedModel || selectedPartType || selectedYear

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[58px]">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] border-b border-border/30">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
          </div>
          <div className="metal-line" />
          <div className="relative mx-auto max-w-[1280px] px-6 py-16 md:py-20">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-red-500/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-red-400">Acura OEM Parts</span>
            </div>
            <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] font-bold text-foreground mb-4">
              <span className="text-red-400">Acura</span> Used Auto Parts
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Quality recycled OEM parts for Acura MDX, RDX, TLX, ILX and more. All parts professionally inspected with 15% savings. Verify VIN/fitment before ordering.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400">Professionally Inspected</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400">OEM Quality</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">USED PARTS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Acura parts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-red-500" />}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-3">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="">All Models</option>
                {ACURA_MODELS.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <select
                value={selectedPartType}
                onChange={(e) => setSelectedPartType(e.target.value)}
                className="px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="">All Part Types</option>
                {ACURA_PART_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="">All Years</option>
                {ACURA_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 rounded-lg bg-card border border-border/50 space-y-4">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground"
              >
                <option value="">All Models</option>
                {ACURA_MODELS.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <select
                value={selectedPartType}
                onChange={(e) => setSelectedPartType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground"
              >
                <option value="">All Part Types</option>
                {ACURA_PART_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border/50 text-foreground"
              >
                <option value="">All Years</option>
                {ACURA_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredParts.length}</span> Acura parts
            </p>
          </div>

          {/* Parts Grid */}
          {filteredParts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No parts found matching your criteria</p>
              <button onClick={clearFilters} className="text-red-400 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredParts.map((part) => (
                <article key={part.id} className="group relative flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden hover:border-red-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                  {/* USED badge */}
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded bg-amber-500/90 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                    Used Part
                  </div>
                  
                  {/* Recycled OEM badge - top right */}
                  <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-red-600/90 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                    OEM
                  </div>
                  
                  {/* Image */}
                  <Link href={`/acura-parts/${part.id}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
                    <Image
                      src={part.image}
                      alt={part.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* USED PARTS watermark overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="rotate-[-15deg] opacity-15">
                        <span className="text-3xl font-black uppercase tracking-widest text-white whitespace-nowrap">USED</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-semibold text-white/80 uppercase tracking-wide">
                      {part.partType}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-red-400">{part.model} {part.year}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold">In Stock</span>
                    </div>
                    
                    <Link href={`/acura-parts/${part.id}`}>
                      <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {part.title}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{part.description.slice(0, 80)}...</p>
                    
                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-foreground">${part.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground line-through">${part.originalPrice.toFixed(2)}</span>
                        <span className="text-xs text-green-400 font-semibold">Save 15%</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(part)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleAddToWishlist(part)}
                          className="p-2 rounded-lg border border-border/50 hover:bg-card hover:border-red-500/40 transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-red-500/10 via-card to-red-500/5 border border-red-500/20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-3">Need a Different Acura Part?</h2>
              <p className="text-muted-foreground mb-6">
                Our network of 2,000+ verified yards can source any Acura part. Get a free quote today — no obligation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/quote" className="auapw-btn auapw-btn-amber">
                  <Mail className="w-4 h-4" />
                  GET QUOTE
                </Link>
                <a href="tel:8888185001" className="auapw-btn auapw-btn-green">
                  <Phone className="w-4 h-4" />
                  (888) 818-5001
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
