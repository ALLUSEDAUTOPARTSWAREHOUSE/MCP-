import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { PaymentGatewaysClient } from '@/components/admin/payment-gateways-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Payment Gateways | Admin',
  description: 'Manage payment methods and gateways',
}

export default async function AdminPaymentsPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  return <PaymentGatewaysClient />
}
