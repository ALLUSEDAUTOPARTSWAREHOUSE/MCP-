import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"

import { SearchPageContent } from "@/components/search/search-page-content"
import { Suspense } from "react"

export const metadata = {
  title: "Search Parts - AUAPW LLC",
  description: "Search our nationwide inventory of used auto parts from 2,000+ verified yards.",
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <SearchPageContent />
        </Suspense>
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
