"use client"

import { BRAND_LOGOS, BRAND_COLORS, getBrandLogoUrl } from "@/lib/data"
import Link from "next/link"
import { useState } from "react"
import { Eye } from "lucide-react"

function getInitials(brand: string): string {
  const words = brand.split(/[\s-]+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return brand.substring(0, brand.length > 4 ? 3 : brand.length).toUpperCase()
}

function BrandLogo({ brand }: { brand: string }) {
  const [imgFailed, setImgFailed] = useState(false)
  const logoUrl = getBrandLogoUrl(brand)
  const color = BRAND_COLORS[brand] || "#1a1d28"
  const initials = getInitials(brand)

  return (
    <div
      className="luxury-logo-tile w-full h-[56px] flex items-center justify-center overflow-hidden rounded-lg"
      aria-label={`${brand} logo`}
    >
      {logoUrl && !imgFailed ? (
        <img
          src={logoUrl}
          alt={`${brand} logo`}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center rounded-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}dd, ${color}88)` }}
        >
          <span className="text-[14px] font-black text-white/90 uppercase tracking-wider leading-none select-none" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.1)" }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}

function BrandCard({ brand }: { brand: string }) {
  return (
    <Link
      href={`/makes/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, "-"))}`}
      aria-label={`View ${brand} parts`}
      className="group relative flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300
        border border-border/20
        hover:border-primary/40 hover:shadow-[0_12pt_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,232,232,0.2)] hover:-translate-y-1.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      style={{ background: "rgba(16,19,28,0.85)", backdropFilter: "blur(16px)" }}
    >
      {/* Chrome highlight edge */}
      <div className="absolute top-0 left-3 right-3 h-px rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
      <div className="relative w-full overflow-hidden rounded-lg">
        <BrandLogo brand={brand} />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 rounded-lg transition-all duration-300">
          <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
      <span className="text-[10px] font-bold text-center leading-tight text-muted-foreground/70 group-hover:text-foreground transition-colors tracking-wide uppercase">
        {brand}
      </span>
    </Link>
  )
}

export function BrandLogosSection() {
  const allBrands = Object.keys(BRAND_LOGOS).sort()

  // Build letter index
  const letters = Array.from(new Set(allBrands.map((b) => b[0].toUpperCase()))).sort()
  const tabs = ["All", ...letters]
  const [activeTab, setActiveTab] = useState("All")

  const filtered =
    activeTab === "All"
      ? allBrands
      : allBrands.filter((b) => b[0].toUpperCase() === activeTab)

  return (
    <section
      aria-label="Shop by vehicle brand"
      className="border-t border-b border-border/20 py-14 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(10,12,20,0.95) 0%, rgba(12,14,22,1) 100%)" }}
    >
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary mb-3">All Vehicle Makes</p>
          <h2 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-foreground mb-2">Shop by Brand</h2>
          <p className="text-muted-foreground text-sm max-w-[460px] mx-auto">
            Quality used parts for every make &mdash; {allBrands.length} brands, 2,000+ verified yards
          </p>
        </div>

        {/* A–Z Tab Bar */}
        <div className="flex flex-wrap justify-center gap-1 mb-8" role="tablist" aria-label="Filter brands by letter">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
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

        {/* Brand Grid */}
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2.5 list-none p-0 m-0"
          role="tabpanel"
          aria-label={`Brands starting with ${activeTab}`}
        >
          {filtered.map((brand) => (
            <li key={brand}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-10">
            No brands found for &ldquo;{activeTab}&rdquo;.
          </p>
        )}
      </div>
    </section>
  )
}
