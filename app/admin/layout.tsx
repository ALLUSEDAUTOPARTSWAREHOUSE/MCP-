import { ReactNode } from 'react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export const metadata = {
  title: 'Admin Portal | AUAPW',
  description: 'AUAPW Admin Dashboard',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/30 bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
              AUAPW Admin
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="/admin/dashboard" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/approvals" className="text-sm hover:text-primary transition-colors">
                Approvals
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
