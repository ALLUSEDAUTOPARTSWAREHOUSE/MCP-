import { Metadata } from 'next'
import { BuyerDashboard } from '@/components/buyer/buyer-dashboard'

export const metadata: Metadata = {
  title: 'Buyer Dashboard | AUAPW Marketplace',
  description: 'Manage your purchases and reviews',
}

export const dynamic = 'force-dynamic'

export default function BuyerPage() {
  return (
    <main className="min-h-screen bg-background">
      <BuyerDashboard />
    </main>
  )
}
