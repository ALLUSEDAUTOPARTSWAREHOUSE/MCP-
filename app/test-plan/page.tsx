import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TestPlanContent } from "@/components/test-plan/test-plan-content"

export const metadata: Metadata = {
  title: "Testing Plan — AUAPW",
  description:
    "Interactive test dashboard: data validation, search param validation, image fallbacks, route scenarios, and form error resilience.",
}

export default function TestPlanPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <TestPlanContent />
      </main>
      <Footer />
    </>
  )
}
