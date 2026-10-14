import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return <AdminDashboardClient adminEmail={session.email} />
}
