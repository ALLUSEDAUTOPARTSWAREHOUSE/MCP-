import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"

import { BrandWordmark } from "@/components/brand-wordmark"
import { GearBackground } from "@/components/gear-background"
import { Logo } from "@/components/logo"
import Link from "next/link"

export const metadata = {
  title: "About Us - AUAPW LLC | Quality Used Auto Parts",
  description: "Learn about AUAPW LLC - Your trusted source for quality used auto parts. 2,000+ verified yards, 6-month warranty, ASE-certified team.",
}

export default function AboutPage() {
  const values = [
    { num: "01", title: "Quality Guaranteed", desc: "Every part is inspected and comes with a 6-month return & replacement warranty." },
    { num: "02", title: "Verified Network", desc: "We partner with 2,000+ vetted junkyards and salvage yards meeting our strict standards." },
    { num: "03", title: "Speed & Efficiency", desc: "Every request is answered within 24 hours -- no waiting, no runaround." },
    { num: "04", title: "Fair Pricing", desc: "We connect you directly with dealers with no inflated middleman markup." },
    { num: "05", title: "Nationwide Coverage", desc: "We serve all 50 states. Parts ship directly from any yard to your door." },
    { num: "06", title: "Expert Support", desc: "Our ASE-certified team helps you identify the exact part before and after purchase." },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Hero */}
        <section className="py-24 relative overflow-hidden bg-[#0d0f16]">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <GearBackground />
          <div className="metal-line absolute top-0 left-0 right-0" />
          <div className="metal-line absolute bottom-0 left-0 right-0" />
          <div className="mx-auto max-w-[1280px] px-6 relative z-10 text-center">
            <div className="flex justify-center mb-8">
              <Logo size="lg" variant="medallion" showGlow />
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-border" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-muted-foreground">Our Story</span>
              <div className="h-px w-10 bg-border" />
            </div>
            <div className="mb-6">
              <BrandWordmark size="about" />
            </div>
            <p className="text-muted-foreground text-base max-w-[600px] mx-auto leading-relaxed">
              A US-based platform connecting vehicle owners and mechanics with premium quality used auto parts from the best junkyards and salvage yards nationwide.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                  <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">Our Purpose</span>
                </div>
                <h2 className="font-serif text-[clamp(1.75rem,3vw,3rem)] font-bold text-foreground mb-6">Our Mission</h2>
                <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
                  <p>Quality auto parts should be accessible and affordable for everyone. Taking care of your vehicle should not mean breaking the bank -- used parts can save thousands while delivering the same performance as new.</p>
                  <p>AUAPW LLC serves as the bridge between you and our network of verified dealers. We do the hard work of searching thousands of inventory yards so you do not have to.</p>
                  <p>With a simple search, you get access to 2,000+ verified inventory yards across all 50 states -- and a response within 24 hours with the best available options and pricing.</p>
                </div>
                <div className="flex gap-3 mt-8 flex-wrap">
                  <Link href="/search" className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">Search Parts</Link>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">Contact Us</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { val: "2,000+", label: "Inventory Yards" },
                  { val: "50", label: "States Served" },
                  { val: "< 24hrs", label: "Response Time" },
                  { val: "6-Mo", label: "Warranty" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-sm p-5 sm:p-8 lg:p-10 flex flex-col items-center text-center gap-2">
                    <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">{s.val}</span>
                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-secondary/30 border-t border-border/30 border-b border-b-border/30">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">What We Stand For</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <h2 className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] font-bold text-foreground">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {values.map((v) => (
                <div key={v.num} className="glass-card rounded-sm p-7 flex flex-col gap-4">
                  <span className="font-serif text-[2.5rem] font-semibold text-foreground/10 leading-none">{v.num}</span>
                  <h3 className="text-sm font-bold tracking-wide text-foreground">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-[900px] px-6">
            <h2 className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] font-bold text-foreground mb-4">Work With Us</h2>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed">Search our parts database or get a free quote from our team today. We respond within 24 hours.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/search" className="auapw-btn auapw-btn-blue inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">Search Parts</Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">Get in Touch</Link>
            </div>
          </div>
        </section>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
