import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { HeroSection } from "@/components/home/hero-section"
import { HeroGallery } from "@/components/home/hero-gallery"
import { PartsShowcase } from "@/components/home/parts-showcase"
import { ContentSection } from "@/components/home/content-section"
import { BrandValuesSection } from "@/components/home/brand-values-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"
import { AppleStylePartsSearch } from "@/components/apple-style-parts-search"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#3a3d44]">
        <HeroSection />
        <HeroGallery />
        <PartsShowcase />
        <AppleStylePartsSearch 
          title="Find Your Parts"
          subtitle="Search across 2,000+ salvage yards nationwide"
        />
        <ContentSection />
        <BrandValuesSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
