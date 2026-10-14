import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { HeroSection } from "@/components/home/hero-section"
import { ContentSection } from "@/components/home/content-section"
import { BrandValuesSection } from "@/components/home/brand-values-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#3a3d44]">
        <HeroSection />
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
