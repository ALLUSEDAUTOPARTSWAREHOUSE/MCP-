"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { PageHero } from "@/components/page-hero"

import { PART_CATEGORIES, CAR_MAKES, PHONE_DISPLAY, PHONE_SALES } from "@/lib/data"
import { ALL_PARTS, getPartsByCategory } from "@/lib/parts-content"
import Link from "next/link"
import { Search, Phone, MessageSquare, ChevronDown, Shield, Truck, Clock, Package } from "lucide-react"
import { useState, useMemo } from "react"

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

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const cat = PART_CATEGORIES.find((c) => c.id === category)
  const categoryParts = useMemo(() => getPartsByCategory(category), [category])

  if (!cat) {
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

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Header */}
        <PageHero
          image={category}
          align="left"
          eyebrow="Parts Category"
          title={cat.label}
          subtitle={`Quality used ${cat.label.toLowerCase()} from our network of 2,000+ verified yards. Every part comes with a warranty and free shipping.`}
        >
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/parts" className="hover:text-white transition-colors">Parts</Link>
            <span>/</span>
            <span className="text-white">{cat.label}</span>
          </div>
        </PageHero>

        {/* Trust badges */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Up to 6-Month Warranty", desc: "Every part covered with full return & replacement" },
              { icon: Truck, title: "Free Shipping USA", desc: "Ships to all 50 states, 1-3 business day processing" },
              { icon: Clock, title: "24-Hour Response", desc: "Get quotes within one business day" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-sm p-5 flex items-start gap-3.5">
                <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Parts in this Category */}
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">All {cat.label} Parts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.parts.map((part) => {
              const partInfo = ALL_PARTS.find(p => p.name.toLowerCase() === part.toLowerCase())
              return (
                <Link
                  key={part}
                  href={`/search?part=${encodeURIComponent(part)}`}
                  className="group glass-card rounded-sm p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{part}</h3>
                      {partInfo && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{partInfo.description}</p>}
                      {!partInfo && <p className="text-xs text-muted-foreground mb-3">Available from 2,000+ yards nationwide</p>}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-semibold uppercase rounded-sm">In Stock</span>
                        <span className="px-2 py-1 bg-secondary border border-border/40 text-[10px] font-semibold text-muted-foreground rounded-sm">Warranty</span>
                        <span className="px-2 py-1 bg-secondary border border-border/40 text-[10px] font-semibold text-muted-foreground rounded-sm">Free Ship</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Detailed Part Information with FAQs */}
        {categoryParts.length > 0 && (
          <div className="mx-auto max-w-[1280px] px-6 py-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">Detailed Information</span>
            </div>
            <h2 className="text-2xl font-bold mb-8">{cat.label} Part Details & FAQs</h2>

            <div className="space-y-8">
              {categoryParts.map((partInfo) => (
                <div key={partInfo.slug} id={partInfo.slug} className="glass-card rounded-lg p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3">{partInfo.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{partInfo.longDescription}</p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-foreground mb-3">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {partInfo.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available for all brands */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-foreground mb-3">Available for All Makes:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {CAR_MAKES.slice(0, 20).map((brand) => (
                        <Link
                          key={brand}
                          href={`/search?make=${encodeURIComponent(brand)}&part=${encodeURIComponent(partInfo.name)}`}
                          className="text-[10px] px-2 py-1 rounded bg-secondary border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                        >
                          {brand}
                        </Link>
                      ))}
                      <span className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">+{CAR_MAKES.length - 20} more</span>
                    </div>
                  </div>

                  {/* FAQs for this part */}
                  {partInfo.faqs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3">Frequently Asked Questions:</h4>
                      <div className="space-y-2">
                        {partInfo.faqs.map((faq, i) => (
                          <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA for this part */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/search?part=${encodeURIComponent(partInfo.name)}`} className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.65rem] font-bold tracking-[0.15em] uppercase rounded-sm">
                      <Search className="w-3.5 h-3.5" /> Search {partInfo.name}
                    </Link>
                    <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.65rem] font-bold tracking-[0.15em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">
                      <MessageSquare className="w-3 h-3" /> Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="text-center">
            <div className="metal-line mb-8" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Ready to find your {cat.label.toLowerCase()} part?</h3>
            <p className="text-sm text-muted-foreground mb-6">Search by vehicle for specific pricing or request a quote from our team.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/search" className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <Search className="w-3.5 h-3.5" /> Search Parts
              </Link>
              <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">
                <Phone className="w-3 h-3" /> {PHONE_DISPLAY}
              </a>
              <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">
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
