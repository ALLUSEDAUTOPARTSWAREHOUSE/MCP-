import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CinematicShowcaseSection } from "@/components/home/cinematic-showcase-section"
import { ContentSection } from "@/components/home/content-section"
import { FeaturesGridSection } from "@/components/home/features-grid-section"
import dynamic from "next/dynamic"

// Lazy load heavy below-fold sections
const BrandValuesSection = dynamic(() => import("@/components/home/brand-values-section").then(m => ({ default: m.BrandValuesSection })))
const ShowcaseGallerySection = dynamic(() => import("@/components/home/showcase-gallery-section").then(m => ({ default: m.ShowcaseGallerySection })))
const CategoriesSection = dynamic(() => import("@/components/home/categories-section").then(m => ({ default: m.CategoriesSection })))
const FeaturedProductsSection = dynamic(() => import("@/components/home/featured-products-section").then(m => ({ default: m.FeaturedProductsSection })))
const BrandLogosSection = dynamic(() => import("@/components/brand-logos").then(m => ({ default: m.BrandLogosSection })))

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#3a3d44]">
        <HeroSection />
        <CinematicShowcaseSection />
        <FeaturesGridSection />
        <ContentSection />
        <BrandValuesSection />
        <ShowcaseGallerySection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
