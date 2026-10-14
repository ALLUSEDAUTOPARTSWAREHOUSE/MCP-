"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { PART_CATEGORIES, CAR_MAKES } from "@/lib/data"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function SitemapPage() {
  const mainPages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Search Parts", href: "/search" },
    { label: "Inventory", href: "/inventory" },
    { label: "Blog", href: "/blog" },
    { label: "All Makes", href: "/makes" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Compare Parts", href: "/comparison" },
  ]

  const partsPages = [
    { label: "All Parts", href: "/parts" },
    { label: "Used Engines", href: "/used-engines" },
    { label: "Used Transmissions", href: "/used-transmissions" },
    { label: "Engine Parts", href: "/used-engines-parts" },
    { label: "Transmission Parts", href: "/used-transmissions-parts" },
    { label: "Drivetrain Parts", href: "/used-drivetrain-parts" },
    { label: "Electrical Parts", href: "/used-electrical-parts" },
    { label: "Cooling & Climate Parts", href: "/used-cooling-parts" },
    { label: "Brakes & Safety Parts", href: "/used-brakes-parts" },
    { label: "Suspension & Steering Parts", href: "/used-suspension-parts" },
    { label: "Body & Interior Parts", href: "/used-body-parts" },
    { label: "Exhaust System Parts", href: "/used-exhaust-parts" },
  ]

  const legalPages = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Acceptable Use", href: "/acceptable-use" },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px] min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <h1 className="font-serif text-3xl font-bold mb-8">Sitemap</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div className="embossed-col rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 text-primary">Main Pages</h2>
              <ul className="space-y-2">
                {mainPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="w-3 h-3" />
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Parts Pages */}
            <div className="embossed-col rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 text-primary">Parts Pages</h2>
              <ul className="space-y-2">
                {partsPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="w-3 h-3" />
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Pages */}
            <div className="embossed-col rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4 text-primary">Legal & Policies</h2>
              <ul className="space-y-2">
                {legalPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="w-3 h-3" />
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Parts Categories Detail */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold mb-6">All Parts by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PART_CATEGORIES.map((category) => (
                <div key={category.id} className="embossed-col rounded-lg p-6">
                  <Link href={`/parts/${category.id}`} className="font-bold text-lg mb-4 text-primary block hover:underline">
                    {category.label}
                  </Link>
                  <ul className="space-y-1.5">
                    {category.parts.map((part) => (
                      <li key={part}>
                        <Link 
                          href={`/parts/${category.id}/${slugify(part)}`} 
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronRight className="w-2.5 h-2.5" />
                          {part}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Shop by Make */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold mb-6">Shop Parts by Vehicle Make</h2>
            <div className="flex flex-wrap gap-2">
              {CAR_MAKES.map((make) => (
                <Link
                  key={make}
                  href={`/makes/${slugify(make)}`}
                  className="text-xs px-3 py-2 rounded embossed-col text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {make}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
