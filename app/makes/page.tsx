"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"
import { CAR_MAKES, CAR_MODELS, BRAND_COLORS, PART_CATEGORIES, getBrandLogoUrl } from "@/lib/data"
import { Search, Phone, Eye } from "lucide-react"

function getInitials(brand: string): string {
  const words = brand.split(/[\s-]+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return brand.substring(0, brand.length > 4 ? 3 : brand.length).toUpperCase()
}

function MakeLogo({ brand, size = "sm" }: { brand: string; size?: "sm" | "lg" }) {
  const [imgFailed, setImgFailed] = useState(false)
  const logoUrl = getBrandLogoUrl(brand)
  const color = BRAND_COLORS[brand] || "#333"
  const initials = getInitials(brand)
  const w = size === "lg" ? "w-[88px] h-[56px]" : "w-[72px] h-[48px]"
  const textSize = size === "lg" ? "text-lg" : "text-[13px]"

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
          <span className={`${textSize} font-black text-white/90 uppercase tracking-wider leading-none select-none`} style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.1)" }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}

export default function MakesPage() {
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const models = selectedMake ? CAR_MODELS[selectedMake] || [] : []

  const allMakes = CAR_MAKES.slice().sort()
  const letters = Array.from(new Set(allMakes.map((m) => m[0].toUpperCase()))).sort()
  const tabs = ["All", ...letters]
  const [activeTab, setActiveTab] = useState("All")
  const filteredMakes = activeTab === "All" ? allMakes : allMakes.filter((m) => m[0].toUpperCase() === activeTab)

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Header */}
        <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/30">
          <div className="metal-line" />
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 sm:py-14">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">All Makes & Models</span>
            </div>
            <h1 className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] font-bold text-foreground">Car Brands</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-[520px]">
              Select a brand to see available models and search for specific parts. We carry parts for all major makes.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 sm:py-12">
          {/* A–Z Tab Bar */}
          <div className="flex flex-wrap gap-1 mb-4 sm:mb-6" role="tablist" aria-label="Filter brands by letter">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => { setActiveTab(tab); setSelectedMake(null) }}
                className={`min-w-[36px] h-8 px-2.5 rounded text-[11px] font-bold tracking-wide transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-12" role="tabpanel">
            {filteredMakes.map((make) => {
              const isActive = selectedMake === make
              return (
                <Link
                  key={make}
                  href={`/makes/${encodeURIComponent(make.toLowerCase().replace(/\s+/g, "-"))}`}
                  onClick={(e) => {
                    if (isActive) {
                      e.preventDefault()
                      setSelectedMake(null)
                    } else {
                      setSelectedMake(make)
                    }
                  }}
                  className={`group relative flex flex-col items-center gap-2 py-4 px-3 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary/15 border-primary/60 -translate-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                      : "bg-card border-border/40 hover:-translate-y-0.5 hover:border-primary/30"
                  }`}
                >
                  <div className="relative">
                    <MakeLogo brand={make} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-md transition-all duration-200">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold text-center leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {make}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Featured: Acura Parts full catalog link — after all makes */}
          <Link
            href="/acura"
            className="group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 sm:p-6 mb-8 sm:mb-12 hover:border-primary/70 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <MakeLogo brand="Acura" size="lg" />
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Acura Parts Catalog</h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  Browse our full Acura inventory with detailed product listings, pricing, and every available model.
                </p>
              </div>
            </div>
            <span className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm shrink-0">
              <Eye className="w-3.5 h-3.5" /> View Acura Parts
            </span>
          </Link>

          {/* Selected Make Detail */}
          {selectedMake && (
            <div className="glass-card rounded-lg p-4 sm:p-8 mb-8 sm:mb-12">
              <div className="metal-line mb-4 sm:mb-6" />
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <MakeLogo brand={selectedMake} size="lg" />
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">{selectedMake}</h2>
                  <p className="text-xs text-muted-foreground">{models.length} models available</p>
                </div>
              </div>

              <h3 className="text-sm font-bold tracking-wide text-foreground mb-4 uppercase">Available Models</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {models.map((model) => (
                  <Link
                    key={model}
                    href={`/search?make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(model)}`}
                    className="inline-flex items-center px-4 py-2 border border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground rounded-sm hover:bg-primary/10 hover:border-primary/40 hover:text-foreground transition-all"
                  >
                    {model}
                  </Link>
                ))}
              </div>

              <h3 className="text-sm font-bold tracking-wide text-foreground mb-4 uppercase">Parts Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PART_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?make=${encodeURIComponent(selectedMake)}&part=${encodeURIComponent(cat.parts[0])}`}
                    className="glass-card rounded-sm p-4 hover:-translate-y-0.5 transition-all hover:border-primary/30"
                  >
                    <div className="text-sm font-bold text-foreground mb-1">{cat.label}</div>
                    <div className="text-[10px] text-muted-foreground">{cat.parts.length} parts</div>
                  </Link>
                ))}
              </div>

              <div className="flex gap-3 mt-8 flex-wrap">
                <Link href={`/search?make=${encodeURIComponent(selectedMake)}`} className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                  <Search className="w-3.5 h-3.5" /> Search {selectedMake} Parts
                </Link>
                <a href="tel:8888185001" className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">
                  <Phone className="w-3 h-3" /> Call (888) 818-5001
                </a>
              </div>
            </div>
          )}

          {!selectedMake && (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-sm">Select a brand above to see available models and search for parts.</p>
            </div>
          )}
        </div>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
