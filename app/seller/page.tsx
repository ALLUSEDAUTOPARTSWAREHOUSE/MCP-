import { Metadata } from 'next'
import { SellerDashboard } from '@/components/seller/seller-dashboard'

export const metadata: Metadata = {
  title: 'Seller Dashboard | AUAPW Marketplace',
  description: 'Manage your listings and earnings',
}

export const dynamic = 'force-dynamic'

export default function SellerPage() {
  return (
    <main className="min-h-screen bg-background">
      <SellerDashboard />
    </main>
  )
}
