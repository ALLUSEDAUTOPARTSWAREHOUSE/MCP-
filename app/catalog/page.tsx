'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroBanner } from '@/components/hero-banner'
import { MaterialTabs } from '@/components/material-tabs'
import { Search, ShoppingCart, Heart, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useComparisonStore } from '@/lib/stores/comparison-store'
import { MaterialType, filterPartsByMaterial, countPartsByMaterial } from '@/lib/material-mapper'

// All parts catalog data
const ALL_PARTS = [
  // Engine & Transmission
  { id: 1, name: 'Engine', category: 'Engine & Transmission', price: 2500, status: 'In Stock' },
  { id: 2, name: 'Transmission', category: 'Engine & Transmission', price: 1800, status: 'In Stock' },
  { id: 3, name: 'Transfer Case', category: 'Engine & Transmission', price: 1200, status: 'In Stock' },
  // Electrical & Sensors
  { id: 4, name: 'ABS', category: 'Electrical & Sensors', price: 450, status: 'In Stock' },
  { id: 5, name: 'ABS Pump', category: 'Electrical & Sensors', price: 380, status: 'In Stock' },
  { id: 6, name: 'AC Compressor', category: 'Climate Control', price: 520, status: 'In Stock' },
  { id: 7, name: 'AC Condenser', category: 'Climate Control', price: 350, status: 'In Stock' },
  { id: 8, name: 'AC Evaporator', category: 'Climate Control', price: 280, status: 'In Stock' },
  { id: 9, name: 'Air Flow Meter', category: 'Electrical & Sensors', price: 220, status: 'In Stock' },
  // Brake System
  { id: 10, name: 'Anti Lock Braking System', category: 'Brake System', price: 650, status: 'In Stock' },
  { id: 11, name: 'Power Brake Booster', category: 'Brake System', price: 420, status: 'In Stock' },
  { id: 12, name: 'Brake Caliper', category: 'Brake System', price: 280, status: 'In Stock' },
  // Suspension & Steering
  { id: 13, name: 'Axle Assembly Front', category: 'Suspension & Steering', price: 850, status: 'In Stock' },
  { id: 14, name: 'Axle Assembly Rear', category: 'Suspension & Steering', price: 920, status: 'In Stock' },
  { id: 15, name: 'Axle Beam', category: 'Suspension & Steering', price: 480, status: 'In Stock' },
  { id: 16, name: 'Axle Shaft', category: 'Suspension & Steering', price: 320, status: 'In Stock' },
  { id: 17, name: 'Control Arm Front', category: 'Suspension & Steering', price: 190, status: 'In Stock' },
  { id: 18, name: 'Control Arm Rear', category: 'Suspension & Steering', price: 210, status: 'In Stock' },
  { id: 19, name: 'Steering Column', category: 'Suspension & Steering', price: 580, status: 'In Stock' },
  { id: 20, name: 'Steering Rack', category: 'Suspension & Steering', price: 750, status: 'In Stock' },
  { id: 21, name: 'Strut', category: 'Suspension & Steering', price: 420, status: 'In Stock' },
  { id: 22, name: 'Torsion Bar', category: 'Suspension & Steering', price: 260, status: 'In Stock' },
  { id: 23, name: 'Spindle', category: 'Suspension & Steering', price: 340, status: 'In Stock' },
  // Engine Components
  { id: 24, name: 'Bell Housing', category: 'Engine Components', price: 450, status: 'In Stock' },
  { id: 25, name: 'Blower Motor', category: 'Engine Components', price: 280, status: 'In Stock' },
  { id: 26, name: 'Carrier Assembly', category: 'Engine Components', price: 620, status: 'In Stock' },
  { id: 27, name: 'Cylinder Head', category: 'Engine Components', price: 950, status: 'In Stock' },
  { id: 28, name: 'Exhaust Manifold', category: 'Engine Components', price: 380, status: 'In Stock' },
  { id: 29, name: 'Fan Blade', category: 'Engine Components', price: 145, status: 'In Stock' },
  { id: 30, name: 'Flywheel', category: 'Engine Components', price: 420, status: 'In Stock' },
  { id: 31, name: 'Fuel Pump', category: 'Engine Components', price: 320, status: 'In Stock' },
  { id: 32, name: 'Intake Manifold', category: 'Engine Components', price: 410, status: 'In Stock' },
  { id: 33, name: 'Oil Pan Engine', category: 'Engine Components', price: 280, status: 'In Stock' },
  { id: 34, name: 'Timing Cover', category: 'Engine Components', price: 350, status: 'In Stock' },
  { id: 35, name: 'Turbo Charger', category: 'Engine Components', price: 1200, status: 'In Stock' },
  // Electrical
  { id: 36, name: 'Alternator', category: 'Electrical', price: 480, status: 'In Stock' },
  { id: 37, name: 'Starter Motor', category: 'Electrical', price: 520, status: 'In Stock' },
  { id: 38, name: 'ECU / PCM Module', category: 'Electrical', price: 680, status: 'In Stock' },
  { id: 39, name: 'Ignition Coil', category: 'Electrical', price: 180, status: 'In Stock' },
  { id: 40, name: 'Fuel Injector', category: 'Electrical', price: 140, status: 'In Stock' },
  // Cooling System
  { id: 41, name: 'Radiator', category: 'Cooling System', price: 420, status: 'In Stock' },
  { id: 42, name: 'Water Pump', category: 'Cooling System', price: 280, status: 'In Stock' },
  // Emissions
  { id: 43, name: 'Catalytic Converter', category: 'Emissions', price: 850, status: 'In Stock' },
  { id: 44, name: 'Oxygen Sensor', category: 'Emissions', price: 180, status: 'In Stock' },
  { id: 45, name: 'Mass Air Flow Sensor', category: 'Emissions', price: 240, status: 'In Stock' },
  // Drivetrain
  { id: 46, name: 'CV Axle', category: 'Drivetrain', price: 380, status: 'In Stock' },
  { id: 47, name: 'Drive Shaft Front', category: 'Drivetrain', price: 520, status: 'In Stock' },
  { id: 48, name: 'Drive Shaft Rear', category: 'Drivetrain', price: 580, status: 'In Stock' },
  { id: 49, name: 'Differential Assembly', category: 'Drivetrain', price: 980, status: 'In Stock' },
  { id: 50, name: 'Torque Converter', category: 'Drivetrain', price: 720, status: 'In Stock' },
  // Interior Components
  { id: 51, name: 'Clutch Master Cylinder', category: 'Interior Components', price: 310, status: 'In Stock' },
  { id: 52, name: 'Column Switch', category: 'Interior Components', price: 180, status: 'In Stock' },
  { id: 53, name: 'Convertible Top Motor', category: 'Interior Components', price: 450, status: 'In Stock' },
  { id: 54, name: 'Electric Door Motor', category: 'Interior Components', price: 320, status: 'In Stock' },
  { id: 55, name: 'Dashboard', category: 'Interior Components', price: 850, status: 'In Stock' },
  { id: 56, name: 'Seat Assembly', category: 'Interior Components', price: 620, status: 'In Stock' },
  { id: 57, name: 'Instrument Cluster', category: 'Interior Components', price: 480, status: 'In Stock' },
  { id: 58, name: 'GPS Screen', category: 'Interior Components', price: 580, status: 'In Stock' },
  { id: 59, name: 'Heater Controls', category: 'Interior Components', price: 240, status: 'In Stock' },
  { id: 60, name: 'Speedometer', category: 'Interior Components', price: 280, status: 'In Stock' },
  // Exterior Components
  { id: 61, name: 'Door Assembly', category: 'Exterior Components', price: 520, status: 'In Stock' },
  { id: 62, name: 'Hood', category: 'Exterior Components', price: 380, status: 'In Stock' },
  { id: 63, name: 'Front Bumper', category: 'Exterior Components', price: 480, status: 'In Stock' },
  { id: 64, name: 'Rear Bumper', category: 'Exterior Components', price: 450, status: 'In Stock' },
  { id: 65, name: 'Fender', category: 'Exterior Components', price: 380, status: 'In Stock' },
  { id: 66, name: 'Headlight Assembly', category: 'Exterior Components', price: 420, status: 'In Stock' },
  { id: 67, name: 'Tail Light Assembly', category: 'Exterior Components', price: 320, status: 'In Stock' },
  { id: 68, name: 'Door Mirror', category: 'Exterior Components', price: 280, status: 'In Stock' },
  { id: 69, name: 'Quarter Panel', category: 'Exterior Components', price: 620, status: 'In Stock' },
  { id: 70, name: 'Tailgate', category: 'Exterior Components', price: 480, status: 'In Stock' },
  // Safety & Glass
  { id: 71, name: 'Airbag Module', category: 'Safety & Glass', price: 580, status: 'In Stock' },
  { id: 72, name: 'Window Regulator Front', category: 'Safety & Glass', price: 240, status: 'In Stock' },
  { id: 73, name: 'Window Regulator Quarter', category: 'Safety & Glass', price: 220, status: 'In Stock' },
  { id: 74, name: 'Window Regulator Rear', category: 'Safety & Glass', price: 240, status: 'In Stock' },
  { id: 75, name: 'Wiper Motor', category: 'Safety & Glass', price: 180, status: 'In Stock' },
]

const CATEGORIES = [
  'All Parts',
  'Engine & Transmission',
  'Electrical & Sensors',
  'Climate Control',
  'Brake System',
  'Suspension & Steering',
  'Engine Components',
  'Electrical',
  'Cooling System',
  'Emissions',
  'Drivetrain',
  'Interior Components',
  'Exterior Components',
  'Safety & Glass',
]

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Parts')
  const [sortBy, setSortBy] = useState('name')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | 'all'>('all')
  const [flashingCard, setFlashingCard] = useState<number | null>(null)

  const addToCart = useCartStore((state) => state.addItem)
  const addToWishlist = useWishlistStore((state) => state.addItem)
  const addToComparison = useComparisonStore((state) => state.addItem)

  const handleCardClick = (partId: number, callback: () => void) => {
    setFlashingCard(partId)
    callback()
    setTimeout(() => setFlashingCard(null), 300)
  }

  // Filter and sort parts
  const filteredParts = useMemo(() => {
    let filtered = ALL_PARTS.filter((part) => {
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All Parts' || part.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Apply material filter
    filtered = filterPartsByMaterial(filtered, selectedMaterial)

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      // Default: alphabetical by name
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy, selectedMaterial])

  // Calculate material counts
  const materialCounts = useMemo(() => {
    const categoryFiltered = ALL_PARTS.filter((part) => {
      const matchesSearch = searchQuery === '' || part.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All Parts' || part.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    return countPartsByMaterial(categoryFiltered)
  }, [searchQuery, selectedCategory])

  const handleAddToCart = (part: typeof ALL_PARTS[0]) => {
    addToCart({
      id: String(part.id),
      name: part.name,
      price: part.price,
      quantity: 1,
      image: '',
      make: 'Universal',
      partType: part.category,
    })
  }

  const handleAddToWishlist = (part: typeof ALL_PARTS[0]) => {
    addToWishlist({
      id: String(part.id),
      name: part.name,
      price: part.price,
      image: '',
      make: 'Universal',
      partType: part.category,
      addedAt: Date.now(),
    })
  }

  const handleAddToComparison = (part: typeof ALL_PARTS[0]) => {
    addToComparison({
      id: String(part.id),
      name: part.name,
      price: part.price,
      make: 'Universal',
      partType: part.category,
    })
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Banner */}
        <HeroBanner
          title="Complete Parts Catalog"
          subtitle="Browse our selection of quality used auto parts with warranty"
          pathname="/catalog"
        />

        {/* Page Header */}
        <section className="py-12 sm:py-16 relative bg-gradient-to-b from-background to-background/50">
          <div className="metal-line absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2 text-balance font-sans text-3d-bold">
              Complete Parts Catalog
            </h1>
            <p className="text-foreground/70 text-lg sm:text-xl mb-6 max-w-2xl">
              Browse our extensive inventory of quality used auto parts for all vehicle makes and models
            </p>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <input
                type="text"
                placeholder="Search parts by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-foreground/50"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="text-sm text-foreground/70">
                Showing <span className="font-bold text-foreground">{filteredParts.length}</span> of{' '}
                <span className="font-bold text-foreground">{ALL_PARTS.length}</span> parts
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="auapw-btn auapw-btn-silver auapw-btn-sm"
              >
                <option value="name">Sort: A-Z</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
              </select>
            </div>
          </div>
          <div className="metal-line absolute bottom-0 left-0 right-0" />
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Categories */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="rounded-xl border border-border bg-card/60 p-3 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/60 px-2 mb-3">
                      Categories
                    </h3>
                    <div className="flex flex-col gap-1">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Grid */}
              <div className="flex-1">
                {/* Material Filter Tabs */}
                <div className="mb-8 pb-6 border-b border-border/40">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Filter by Material</h4>
                  <MaterialTabs
                    selected={selectedMaterial}
                    onSelect={setSelectedMaterial}
                    counts={materialCounts}
                  />
                </div>

                {filteredParts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-foreground/70 text-lg mb-4">No parts found matching your search.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('All Parts')
                      }}
                      className="auapw-btn auapw-btn-blue auapw-btn-lg"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredParts.map((part) => (
                      <div
                        key={part.id}
                        className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-xl p-4 sm:p-6 transition-all duration-300 flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.8)] hover:border-slate-500 ${
                          flashingCard === part.id ? 'animate-pulse scale-105' : ''
                        }`}
                      >
                        {/* Part Header */}
                        <div className="mb-3 flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                            {part.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wide">
                            {part.category}
                          </p>
                        </div>

                        {/* Status Button */}
                        <div className="mb-4">
                          <button
                            disabled
                            className="auapw-btn auapw-btn-green auapw-btn-sm auapw-btn-subtext w-full text-center opacity-70"
                          >
                            <div className="flex flex-col items-center w-full">
                              <span className="btn-main">{part.name}</span>
                              <span className="btn-sub">In Stock</span>
                            </div>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mb-4 pb-4 border-b border-border">
                          <p className="text-2xl font-black text-foreground">
                            ${part.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-auto">
                          <button
                            onClick={() => handleCardClick(part.id, () => handleAddToCart(part))}
                            className={`auapw-btn auapw-btn-blue w-full transition-all ${flashingCard === part.id ? 'animate-pulse' : ''}`}
                            aria-label={`Add ${part.name} to cart`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCardClick(part.id, () => handleAddToWishlist(part))}
                              className={`auapw-btn auapw-btn-red flex-1 transition-all ${flashingCard === part.id ? 'animate-pulse' : ''}`}
                              aria-label={`Add ${part.name} to wishlist`}
                              title="Add to wishlist"
                            >
                              <Heart className="w-4 h-4" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                            <button
                              onClick={() => handleCardClick(part.id, () => handleAddToComparison(part))}
                              className={`auapw-btn auapw-btn-silver flex-1 transition-all ${flashingCard === part.id ? 'animate-pulse' : ''}`}
                              aria-label={`Add ${part.name} to comparison`}
                              title="Add to comparison"
                            >
                              <BarChart3 className="w-4 h-4" />
                              <span className="hidden sm:inline">Compare</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
