import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"

export const metadata = {
  title: "Return Policy | AUAPW LLC",
  description: "AUAPW LLC return and refund policy for used auto parts purchases.",
}

export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="mx-auto max-w-[900px] px-6 py-16">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8">Return Policy</h1>

            <h2 className="text-2xl font-bold mt-8 mb-4">30-Day Return Guarantee</h2>
            <p className="mb-4">If you are not completely satisfied with your purchase, we offer a 30-day return window from the date of delivery. All returns must be initiated within this timeframe.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Return Requirements</h2>
            <p className="mb-4">To qualify for a return, the part must:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Be unused and uninstalled in its original condition</li>
              <li>Be returned with all original packaging and documentation</li>
              <li>Have proof of purchase (invoice or order number)</li>
              <li>Pass inspection upon receipt at our warehouse</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6-Month Warranty</h2>
            <p className="mb-4">All parts come with a 6-month warranty covering defects in workmanship and materials. If a part fails due to manufacturing defects within 6 months, we will replace it free of charge.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Return Process</h2>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Contact our team to initiate a return RMA (Return Merchandise Authorization) number</li>
              <li>Ship the part back to us with tracking (prepaid label provided for valid returns)</li>
              <li>Part is inspected upon receipt at our warehouse</li>
              <li>Refund is issued within 5-7 business days of approval</li>
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4">Non-Returnable Items</h2>
            <p className="mb-4">The following items cannot be returned:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Installed or used parts</li>
              <li>Damaged parts due to customer negligence</li>
              <li>Items purchased as-is or final sale</li>
              <li>Parts without original packaging or documentation</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Refunds</h2>
            <p className="mb-4">Approved returns will receive a full refund of the purchase price. Original shipping costs are non-refundable. Return shipping is free for defective or incorrect parts; customer pays for returns outside the warranty period.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Defective Part Replacement</h2>
            <p className="mb-4">If you receive a defective part, we will replace it free of charge or provide a full refund. Contact us immediately with photos and documentation of the defect.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact for Returns</h2>
            <p className="mb-4">Email: aupworld@gmail.com | Phone: (888) 818-5001</p>
          </div>
        </div>
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
