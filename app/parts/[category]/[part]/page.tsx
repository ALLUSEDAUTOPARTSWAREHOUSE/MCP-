"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"

import { PART_CATEGORIES, CAR_MAKES, PHONE_DISPLAY, PHONE_SALES } from "@/lib/data"
import { ALL_PARTS } from "@/lib/parts-content"
import Link from "next/link"
import { Search, Phone, MessageSquare, Shield, Truck, Clock, ChevronDown, Wrench, ArrowRight } from "lucide-react"
import { useState } from "react"

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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function IndividualPartPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const partSlug = params.part as string
  
  const category = PART_CATEGORIES.find(c => c.id === categorySlug)
  
  // Find part info from ALL_PARTS or create a basic one from the category parts list
  const partInfo = ALL_PARTS.find(p => p.slug === partSlug || slugify(p.name) === partSlug)
  
  // If we can't find detailed info, check if this part exists in the category
  const categoryPartName = category?.parts.find(p => slugify(p) === partSlug)

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">This parts category was not found.</p>
            <Link href="/parts" className="text-primary hover:underline">View All Parts</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const partName = partInfo?.name || categoryPartName || partSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const partDescription = partInfo?.longDescription || `Quality used ${partName.toLowerCase()} parts from our network of 2,000+ verified salvage yards. Every part comes with warranty coverage and free shipping nationwide.`
  const partBenefits = partInfo?.benefits || ["Save 40-70% vs new parts", "All parts inspected and tested", "Up to 6-month warranty", "Free shipping to all 50 states", "24-hour quote response"]
  const partFaqs = partInfo?.faqs || [
    { q: `Where can I buy a used ${partName.toLowerCase()}?`, a: `AUAPW LLC connects you with 2,000+ verified salvage yards nationwide to find quality used ${partName.toLowerCase()} parts at competitive prices.` },
    { q: `How much does a used ${partName.toLowerCase()} cost?`, a: `Used ${partName.toLowerCase()} parts typically cost 40-70% less than new OEM parts. Contact us for a specific quote for your vehicle.` },
    { q: `Do used ${partName.toLowerCase()} parts come with a warranty?`, a: `Yes, all our used ${partName.toLowerCase()} parts come with warranty coverage ranging from 30 days to 6 months depending on the specific part.` },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Header */}
        <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/30">
          <div className="metal-line" />
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/parts" className="hover:text-foreground transition-colors">Parts</Link>
              <span>/</span>
              <Link href={`/parts/${categorySlug}`} className="hover:text-foreground transition-colors">{category.label}</Link>
              <span>/</span>
              <span className="text-foreground">{partName}</span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">{category.label}</span>
            </div>
            <h1 className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] font-bold text-foreground">Used {partName}</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-[520px]">
              {partInfo?.description || `Quality used ${partName.toLowerCase()} parts from verified salvage yards. Tested, inspected, and shipped with warranty.`}
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Up to 6-Month Warranty", desc: `Every ${partName.toLowerCase()} covered with full return & replacement` },
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

        {/* Part Description */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="embossed-col rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="metal-icon-wrap">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">About Used {partName}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{partDescription}</p>

            {/* Benefits */}
            <h3 className="text-sm font-bold text-foreground mb-4">Key Benefits:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {partBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/search?part=${encodeURIComponent(partName)}`} className="auapw-btn auapw-btn-blue metal-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <Search className="w-3.5 h-3.5" /> Search {partName}
              </Link>
              <Link href="/quote" className="auapw-btn auapw-btn-silver inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <MessageSquare className="w-3 h-3" /> Get Free Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Shop by Make */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-xl font-bold mb-6">Shop {partName} by Vehicle Make</h2>
          <div className="flex flex-wrap gap-2">
            {CAR_MAKES.map((make) => (
              <Link
                key={make}
                href={`/search?make=${encodeURIComponent(make)}&part=${encodeURIComponent(partName)}`}
                className="text-xs px-3 py-2 rounded embossed-col text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {make} {partName}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-xl font-bold mb-6">{partName} Frequently Asked Questions</h2>
          <div className="space-y-3">
            {partFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* Related Parts */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-xl font-bold mb-6">More {category.label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {category.parts.filter(p => slugify(p) !== partSlug).slice(0, 8).map((part) => (
              <Link
                key={part}
                href={`/parts/${categorySlug}/${slugify(part)}`}
                className="group embossed-col rounded-lg p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  {part}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="text-center embossed-col rounded-lg p-8">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Need Help Finding a {partName}?</h3>
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
