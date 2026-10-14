import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SmartSearch } from "@/components/search/smart-search"

export const metadata = {
  title: "AI Smart Parts Search - AUAPW LLC",
  description:
    "Describe the used auto part you need in plain English and let our AI find the right match from our nationwide inventory.",
}

export default function AiSearchPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <SmartSearch />
      </main>
      <Footer />
    </>
  )
}
