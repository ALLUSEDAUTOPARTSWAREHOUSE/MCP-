"use client"

import { getPartsSearchUrl } from '@/lib/parts-search-routing'

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { AppleStylePartsSearch, type SearchFilters } from "@/components/apple-style-parts-search"

import { PART_CATEGORIES, CAR_MAKES, PHONE_DISPLAY, PHONE_SALES } from "@/lib/data"
import Link from "next/link"
import { Search, Phone, MessageSquare, Shield, Truck, Clock, Zap } from "lucide-react"

const CATEGORY = PART_CATEGORIES.find(c => c.id === "electrical")!

export default function UsedElectricalPartsPage() {
  const router = useRouter()

  const handleSearch = (filters: SearchFilters) => {
    router.push(getPartsSearchUrl(filters))
  }

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Header */}
        <div className="relative border-b border-border/30 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(13,15,22,0.78), rgba(13,15,22,0.72), rgba(13,15,22,0.88)), url('/images/heroes/hero-electrical.png')" }}>
          <div className="metal-line" />
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/parts" className="hover:text-foreground transition-colors">Parts</Link>
              <span>/</span>
              <span className="text-foreground">Electrical</span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">Electrical Parts</span>
            </div>
            <h1 className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] font-bold text-foreground">Used Electrical Parts</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-[520px]">
              Alternators, starters, ECU modules, ABS modules, sensors, and all electrical components from 2,000+ verified salvage yards.
            </p>
          </div>
        </div>

        {/* Apple-style search form */}
        <AppleStylePartsSearch
          onSearch={handleSearch}
          title={`Find Your ${CATEGORY.label}`}
          subtitle="Search our network of 2,000+ salvage yards nationwide"
        />

        {/* Trust badges */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Up to 6-Month Warranty", desc: "Every electrical part covered with full return & replacement" },
              { icon: Truck, title: "Free Shipping USA", desc: "Ships to all 50 states, 1-3 business day processing" },
              { icon: Clock, title: "24-Hour Response", desc: "Get quotes within one business day" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="embossed-col rounded-lg p-5 flex items-start gap-3.5">
                <div className="metal-icon-wrap">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Electrical Parts */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">All Electrical Parts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY.parts.map((part) => (
              <Link
                key={part}
                href={`/search?part=${encodeURIComponent(part)}`}
                className="group embossed-col rounded-lg p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="metal-icon-wrap">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{part}</h3>
                    <p className="text-xs text-muted-foreground mb-3">Available from 2,000+ yards nationwide</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-semibold uppercase rounded-sm">In Stock</span>
                      <span className="px-2 py-1 bg-secondary border border-border/40 text-[10px] font-semibold text-muted-foreground rounded-sm">Warranty</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Shop by Make */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">Shop Electrical Parts by Make</h2>
          <div className="flex flex-wrap gap-2">
            {CAR_MAKES.map((make) => (
              <Link
                key={make}
                href={`/search?make=${encodeURIComponent(make)}&category=electrical`}
                className="text-xs px-3 py-2 rounded embossed-col text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {make} Electrical
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="text-center embossed-col rounded-lg p-8">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Need Help Finding an Electrical Part?</h3>
            <p className="text-sm text-muted-foreground mb-6">Our experts can help you find the exact part for your vehicle.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/search" className="auapw-btn auapw-btn-blue metal-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <Search className="w-3.5 h-3.5" /> Search Parts
              </Link>
              <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="auapw-btn auapw-btn-silver inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <Phone className="w-3 h-3" /> {PHONE_DISPLAY}
              </a>
              <Link href="/quote" className="auapw-btn auapw-btn-silver inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <MessageSquare className="w-3 h-3" /> Free Quote
              </Link>
            </div>
          </div>
        </div>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
