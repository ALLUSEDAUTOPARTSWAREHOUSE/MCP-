import { ReactNode } from 'react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { getAdminSession } from '@/lib/admin-auth'

export const metadata = {
  title: 'Admin Portal | AUAPW',
  description: 'AUAPW Admin Dashboard',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/30 bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={session ? '/admin/dashboard' : '/admin'} className="text-xl font-bold text-primary">
              AUAPW Admin
            </Link>
          </div>
          
          {session ? (
          <div className="flex items-center gap-4">
            <nav aria-label="Admin" className="flex gap-4 sm:gap-6">
              <Link href="/admin/dashboard" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/quotes" className="text-sm hover:text-primary transition-colors">
                Quotes
              </Link>
              <Link href="/admin/orders" className="text-sm hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/admin/team" className="text-sm hover:text-primary transition-colors">
                Team
              </Link>
              <Link href="/admin/payments" className="text-sm hover:text-primary transition-colors">
                Payments
              </Link>
              <Link href="/admin/merchant" className="text-sm hover:text-primary transition-colors">
                Google Shopping
              </Link>
            </nav>
            
            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
