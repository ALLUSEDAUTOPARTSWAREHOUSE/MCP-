"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { CAR_MAKES, CAR_MODELS, BRAND_COLORS, PART_CATEGORIES, MODEL_YEAR_RANGES, getBrandLogoUrl, getBrandCarImageUrl, PHONE_SALES, PHONE_DISPLAY } from "@/lib/data"
import { ALL_PARTS, getBrandContent } from "@/lib/parts-content"
import { Search, Phone, ArrowLeft, Shield, Clock, Truck, Star, ChevronDown, Package, Undo2, Globe, Headphones } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"

function BrandHeroBanner({ brand, color }: { brand: string; color: string }) {
  const logoUrl = getBrandLogoUrl(brand)
  const carImageUrl = getBrandCarImageUrl(brand)
  const [imgFailed, setImgFailed] = useState(false)
  const [carImgFailed, setCarImgFailed] = useState(false)
  const initials = brand.split(/[\s-]+/).map(w => w[0]).join("").slice(0, 3).toUpperCase()

  return (
    <div 
      className="relative min-h-[320px] md:min-h-[450px] lg:min-h-[500px] flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color}ee 0%, ${color}cc 50%, ${color}99 100%)` }}
    >
      {carImageUrl && !carImgFailed && (
        <Image src={carImageUrl} alt={`${brand} vehicle`} fill className="object-cover opacity-40" onError={() => setCarImgFailed(true)} priority />
      )}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="relative z-10 text-center px-6 py-12">
        <div className="mb-6 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
            {logoUrl && !imgFailed ? (
              <Image src={logoUrl} alt={`${brand} logo`} width={160} height={160} className="w-full h-full object-cover" onError={() => setImgFailed(true)} priority />
            ) : (
              <span className="text-4xl md:text-5xl font-black text-white/90 tracking-wider">{initials}</span>
            )}
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight text-balance">{brand}</h1>
        <p className="text-xl md:text-2xl text-white/80 font-medium mb-6">Used Auto Parts</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: Shield, text: "6-Month Warranty" },
            { icon: Truck, text: "Free Shipping" },
            { icon: Clock, text: "24-HR Response" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
              <Icon className="w-4 h-4" /><span>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/search?make=${encodeURIComponent(brand)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-white/90 transition-all shadow-lg">
            <Search className="w-5 h-5" /> Search {brand} Parts
          </Link>
          <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg hover:bg-white/20 transition-all">
            <Phone className="w-5 h-5" /> Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-card/80 transition-colors">
        <span className="font-semibold text-sm">{question}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</div>}
    </div>
  )
}

function ModelYearBadge({ model, yearRange }: { model: string; yearRange?: [number, number] }) {
  const currentYear = new Date().getFullYear()
  const start = yearRange?.[0] || 0
  const end = yearRange?.[1] || 0
  const label = start && end ? `${start}--${end}` : start ? `${start}--Present` : ""
  const isActive = end === 0 || end >= currentYear
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-medium">{model}</span>
      {label && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground"}`}>
          {label}
        </span>
      )}
    </div>
  )
}

export default function BrandPage() {
  const params = useParams()
  const brandSlug = params.brand as string
  const brand = useMemo(() => {
    const normalized = brandSlug.toLowerCase().replace(/-/g, " ")
    return CAR_MAKES.find(m => m.toLowerCase() === normalized) || 
           CAR_MAKES.find(m => m.toLowerCase().replace(/\s+/g, "-") === brandSlug) ||
           brandSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  }, [brandSlug])

  const models = CAR_MODELS[brand] || []
  const color = BRAND_COLORS[brand] || "#333333"
  const yearRanges = MODEL_YEAR_RANGES[brand] || {}
  const brandContent = getBrandContent(brand)

  // Generate dynamic FAQ data
  const faqItems = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const activeModels = models.filter(m => {
      const yr = yearRanges[m]
      return yr && (yr[1] === 0 || yr[1] >= currentYear - 2)
    })
    const discontinuedModels = models.filter(m => {
      const yr = yearRanges[m]
      return yr && yr[1] !== 0 && yr[1] < currentYear - 2
    })
    const modelList = models.join(", ")
    const activeList = activeModels.length > 0 ? activeModels.join(", ") : "various models"
    const minYear = Object.values(yearRanges).map(r => r[0]).filter(Boolean)
    const earliestDecade = minYear.length > 0 ? `${Math.floor(Math.min(...minYear) / 10) * 10}s` : "1990s"

    return [
      {
        q: `What ${brand} models do you carry used parts for?`,
        a: `We carry used OEM parts for all ${brand} models including: ${modelList}. Our inventory spans parts from the earliest production years to the latest models, sourced from our network of 2,000+ verified auto recycling yards across the USA.`,
      },
      {
        q: `What year range of ${brand} parts are available?`,
        a: `We stock used parts for ${brand} vehicles spanning from the ${earliestDecade} to present day (${currentYear}). Whether you need parts for a classic ${brand} or a late-model vehicle, our nationwide network can source what you need with a 6-month warranty included.`,
      },
      {
        q: `How do I find the right used part for my ${brand}?`,
        a: `Use our search tool at the top of the page -- select your ${brand} model, year, and the specific part you need. You can also call us at ${PHONE_DISPLAY} for personalized assistance. Our specialists will match the correct OEM part number, verify fitment, and provide you with competitive pricing from multiple yards.`,
      },
      {
        q: `Do you offer warranties on used ${brand} parts?`,
        a: `Yes! Every used ${brand} part we sell comes with a minimum 30-day warranty, with most parts covered by our standard 6-month warranty. Engines and transmissions may include extended 90-day to 6-month coverage. All parts are inspected and tested before shipping to ensure quality and proper function.`,
      },
      {
        q: `Can you ship used ${brand} parts nationwide?`,
        a: `Absolutely. We ship used ${brand} parts to all 50 states. Many orders qualify for free shipping, and most parts ship within 1-3 business days. For large components like engines and transmissions, we use freight carriers with full insurance coverage. Expedited shipping is also available upon request.`,
      },
      ...(activeModels.length > 0 ? [{
        q: `Which ${brand} models are currently in production?`,
        a: `Currently in production ${brand} models include: ${activeList}. We carry the latest OEM parts for these vehicles as well as all prior model years.${discontinuedModels.length > 0 ? ` Discontinued models we also support include: ${discontinuedModels.join(", ")}.` : ""}`,
      }] : []),
      {
        q: `How much do used ${brand} parts cost?`,
        a: `Used ${brand} OEM parts typically cost 40-70% less than new dealer parts. Pricing varies by part type, condition, and mileage. For example, a used ${brand} engine may range from $800-$3,500 depending on the model and condition. Request a free quote for exact pricing on the specific part you need.`,
      },
      {
        q: `What are the most commonly replaced ${brand} parts?`,
        a: `The most frequently requested used ${brand} parts include: engines, transmissions, alternators, starter motors, A/C compressors, radiators, control arms, door assemblies, headlight assemblies, and ECU/PCM modules. We maintain deep inventory across all ${PART_CATEGORIES.length} major part categories for every ${brand} model.`,
      },
      {
        q: `Is it better to buy used or new ${brand} parts?`,
        a: `Used OEM ${brand} parts offer the best value for most repairs. They are genuine manufacturer parts with proven durability at 40-70% less cost. For critical safety components, we ensure every part meets OEM specifications. New parts make sense only when used alternatives are unavailable.`,
      },
      {
        q: `How quickly will I receive my used ${brand} part?`,
        a: `After placing your request, you will receive a quote within 24 hours. Once ordered, most parts ship within 1-3 business days. Standard delivery takes 5-7 business days, with expedited options available. Large components like engines may take 7-10 business days via freight.`,
      },
    ]
  }, [brand, models, yearRanges])

  const brandExists = CAR_MAKES.some(m => m.toLowerCase() === brand.toLowerCase())

  if (!brandExists) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
            <p className="text-muted-foreground mb-8">The brand &quot;{brand}&quot; was not found in our inventory.</p>
            <Link href="/makes" className="inline-flex items-center gap-2 text-primary hover:underline"><ArrowLeft className="w-4 h-4" /> View All Brands</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <BrandHeroBanner brand={brand} color={color} />

        {/* Breadcrumb + Back */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/makes" className="hover:text-foreground transition-colors">All Brands</Link>
            <span>/</span>
            <span className="text-foreground">{brand} Used Auto Parts</span>
          </div>
        </div>

        {/* Brand Introduction - like old site */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{brand} Used Auto Parts</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{brandContent.intro}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{brandContent.detailedDescription}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              After you place your request with your contact information, you will get a response from junkyard or salvage yard dealers within 24 hours. If they have your requested parts they will send you an email with all the required information. If you need any support to buy {brand.toLowerCase()} used auto parts, we are here to help you. Our auto part specialist executives are waiting right next to the phone for your call. Need support? Call {PHONE_DISPLAY}.
            </p>
          </div>
        </section>

        {/* Complete Parts List - matching old site's "{Brand} other parts" section */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">{brand} Parts Catalog</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{brand} Available Parts</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">{brandContent.partsIntro}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_PARTS.map((part) => (
              <div
                key={part.slug}
                className="flex items-center gap-2 px-3 py-3 rounded-lg border border-border/50 bg-card hover:bg-card/80 hover:border-primary/30 transition-all group"
              >
                <Package className="w-4 h-4 text-primary flex-shrink-0" />
                <Link
                  href={`/search?make=${encodeURIComponent(brand)}&part=${encodeURIComponent(part.name)}`}
                  className="text-sm font-medium group-hover:text-primary transition-colors flex-1 min-w-0 truncate"
                >
                  {part.name}
                </Link>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                  {/* Compact GET QUOTE button */}
                  <Link
                    href={`/quote?make=${encodeURIComponent(brand)}&part=${encodeURIComponent(part.name)}`}
                    className="parts-quote-btn"
                    title="Get a quote"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Quote</span>
                  </Link>
                  {/* Compact chrome call button */}
                  <a
                    href={`tel:${PHONE_SALES.replace(/-/g, "")}`}
                    className="parts-call-btn"
                    title={`Call ${PHONE_DISPLAY}`}
                    aria-label="Call us"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Models Section with Year Ranges */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">{models.length} Models Available</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Available {brand} Models</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            Browse used OEM parts for every {brand} model ever produced. Year ranges shown indicate production history.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {models.map((model) => {
              const yr = yearRanges[model]
              return (
                <Link key={model} href={`/search?make=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`} className="px-4 py-3.5 rounded-lg border border-border/50 bg-card hover:bg-card/80 hover:border-primary/30 hover:-translate-y-0.5 transition-all">
                  <ModelYearBadge model={model} yearRange={yr} />
                </Link>
              )
            })}
          </div>
          {models.length === 0 && (
            <p className="text-muted-foreground">No specific models listed. Search for any {brand} part below.</p>
          )}
        </section>

        {/* Parts Categories */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <h2 className="text-2xl font-bold mb-6">{brand} Parts by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PART_CATEGORIES.map((cat) => (
              <div key={cat.id} className="p-5 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-all flex flex-col gap-3">
                <Link href={`/parts/${cat.id}`} className="hover:text-primary transition-colors">
                  <h3 className="text-lg font-bold">{cat.label}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{cat.parts.length} part types available</p>
                <div className="flex flex-wrap gap-1">
                  {cat.parts.slice(0, 4).map((part) => (
                    <span key={part} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{part}</span>
                  ))}
                  {cat.parts.length > 4 && <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">+{cat.parts.length - 4} more</span>}
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-auto pt-1">
                  <Link
                    href={`/quote?make=${encodeURIComponent(brand)}&category=${encodeURIComponent(cat.label)}`}
                    className="auapw-btn auapw-btn-amber flex-1 justify-center text-xs py-2 px-3"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', letterSpacing: '0.06em' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    GET QUOTE
                  </Link>
                  <a
                    href={`tel:${PHONE_SALES.replace(/-/g, "")}`}
                    className="brand-chrome-call-btn"
                    style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem' }}
                    title={`Call ${PHONE_DISPLAY}`}
                    aria-label="Call us"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Order / Shipping / Warranty / Return - like old site */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Search className="w-5 h-5 text-primary" /></div>
                <h3 className="text-lg font-bold">How do I order a used part?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{brandContent.orderingProcess}</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
                <h3 className="text-lg font-bold">Free Shipping in the USA</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{brandContent.shippingInfo}</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
                <h3 className="text-lg font-bold">Do we provide a warranty?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{brandContent.warrantyInfo}</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Undo2 className="w-5 h-5 text-primary" /></div>
                <h3 className="text-lg font-bold">Can I return the order?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{brandContent.returnPolicy}</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Globe className="w-5 h-5 text-primary" /></div>
                <h3 className="text-lg font-bold">Is it better to buy online?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{brandContent.whyBuyOnline}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Used {brand} Parts FAQ</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            Everything you need to know about buying used {brand} auto parts from our nationwide network.
          </p>
          <div className="grid gap-3 max-w-3xl">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-2xl p-8 md:p-12 text-center" style={{ background: `linear-gradient(135deg, ${color}dd, ${color}aa)` }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need a Specific {brand} Part?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Our team can source any {brand} part from our network of 2,000+ verified yards. Get a free quote today — no obligation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              {/* Premium metallic GET QUOTE button */}
              <Link href="/quote" className="auapw-btn auapw-btn-amber">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                  <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                GET QUOTE
              </Link>
              {/* Chrome phone button */}
              <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="brand-chrome-call-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="mx-auto max-w-7xl px-6 pb-16 text-center">
          <p className="text-sm text-muted-foreground">
            For more information about {brand} used auto parts, call us at{" "}
            <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="text-primary font-semibold hover:underline">{PHONE_DISPLAY}</a>.
          </p>
        </section>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
