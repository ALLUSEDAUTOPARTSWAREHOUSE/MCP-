import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"
import { PageHero } from "@/components/page-hero"
import Link from "next/link"
import { Search, Zap, Package, MapPin } from "lucide-react"

export const metadata = {
  title: "Inventory | AUAPW LLC",
  description: "Browse our current inventory of used auto parts. Real-time stock from 2,000+ verified yards nationwide.",
}

export default function InventoryPage() {
  const inventory = [
    { category: "Engines", inStock: 1200, brand: "Toyota", year: 2015 },
    { category: "Transmissions", inStock: 850, brand: "Honda", year: 2016 },
    { category: "Alternators", inStock: 340, brand: "Ford", year: 2014 },
    { category: "Starter Motors", inStock: 290, brand: "Chevrolet", year: 2017 },
    { category: "Radiators", inStock: 520, brand: "BMW", year: 2013 },
    { category: "Control Arms", inStock: 680, brand: "Nissan", year: 2015 },
    { category: "Door Assemblies", inStock: 920, brand: "Mazda", year: 2016 },
    { category: "Transmissions", inStock: 450, brand: "Subaru", year: 2014 },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <PageHero
          image="salvage"
          align="left"
          eyebrow="Live Inventory"
          title="Real-Time Inventory"
          subtitle="Access live inventory data from our network of 2,000+ verified automotive recycling yards. Every part is inspected and tested before listing."
        />
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="flex flex-col gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Real-Time Inventory Management
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                Access live inventory data from our network of 2,000+ verified automotive recycling yards. Every part is inspected and tested before listing.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
                >
                  <Search className="w-5 h-5" />
                  Search Parts
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[
                { icon: Package, label: "Parts in Stock", value: "8,500+" },
                { icon: MapPin, label: "Verified Yards", value: "2,000+" },
                { icon: Zap, label: "Daily Updates", value: "24/7" },
                { icon: Package, label: "Brands", value: "40+" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass-card p-4 sm:p-6 rounded-lg flex flex-col gap-2 sm:gap-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">{value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-semibold tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Popular Categories</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">In Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Latest Addition</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.category + item.brand} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-4 font-semibold">{item.category}</td>
                      <td className="text-right py-4 px-4">{item.inStock}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.brand} {item.year}</td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">Available</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-secondary/40 border border-border/50 rounded-lg p-5 sm:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Looking for a Specific Part?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Contact our team and we&apos;ll search our entire network to find exactly what you need.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
