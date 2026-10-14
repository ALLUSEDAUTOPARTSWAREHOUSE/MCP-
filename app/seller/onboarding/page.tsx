import { Metadata } from 'next'
import { SellerOnboarding } from '@/components/seller/seller-onboarding'

export const metadata: Metadata = {
  title: 'Become a Seller | AUAPW Marketplace',
  description: 'Start selling on AUAPW and reach millions of buyers',
}

export const dynamic = 'force-dynamic'

export default function SellerOnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <SellerOnboarding />
    </main>
  )
}
