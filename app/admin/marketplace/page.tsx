import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminMarketplaceDashboard } from '@/components/admin/admin-marketplace-dashboard'

export const metadata: Metadata = {
  title: 'Marketplace Admin | AUAPW',
  description: 'Monitor marketplace health and manage sellers',
}

export const dynamic = 'force-dynamic'

export default function AdminMarketplacePage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminMarketplaceDashboard />
    </main>
  )
}
