import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client'
import { FollowupSummary } from '@/components/admin/followup-summary'
import { AssistantPanel } from '@/components/admin/assistant-panel'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <>
      <FollowupSummary />
      <AssistantPanel />
      <AdminDashboardClient adminEmail={session.email} />
    </>
  )
}
