import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"
import { UsedTransmissionsContent } from "@/components/used-transmissions-content"

export const metadata: Metadata = {
  title: "Buy Used Automatic & Manual Transmissions | AUAPW LLC",
  description: "Find quality used transmissions for sale. Automatic, manual, CVT transmissions from 2,000+ verified yards. Free shipping, warranty included.",
}

export default function UsedTransmissionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <UsedTransmissionsContent />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
