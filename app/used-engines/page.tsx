import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"
import { UsedEnginesContent } from "@/components/used-engines-content"

export const metadata: Metadata = {
  title: "Buy Quality Used Engines | Used Engines for Sale | AUAPW LLC",
  description: "Find quality used engines for sale from 2,000+ verified junkyards. Free shipping, 30-180 day warranty. Get a quote in under 24 hours.",
}

export default function UsedEnginesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <UsedEnginesContent />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
