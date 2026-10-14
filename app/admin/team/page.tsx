import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { TeamDirectoryClient } from '@/components/admin/team-directory-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Team Directory | Admin',
  description: 'Manage sales agents, support team, and developer team members',
}

export default async function AdminTeamPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  return <TeamDirectoryClient />
}
