'use client'

import { useSession, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Package, Search, Zap, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Orders', href: '/dashboard/orders', icon: Package },
  { label: 'Search History', href: '/dashboard/search-history', icon: Search },
  { label: 'Comparisons', href: '/dashboard/comparisons', icon: Zap },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    if (!session?.user) {
      router.push('/sign-in?redirect=/dashboard')
    }
  }, [session, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-full w-64 bg-white/5 border-r border-white/10 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">My Account</h1>
            <button className="md:hidden text-foreground/60" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-foreground/60 mb-1">Logged in as</p>
            <p className="font-semibold truncate">{session.user.name || session.user.email}</p>
            <p className="text-xs text-foreground/60 truncate">{session.user.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-foreground/80 hover:text-white"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-foreground/80 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto">
        {/* Mobile toggle */}
        <div className="md:hidden p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h2 className="font-semibold">Dashboard</h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Backdrop for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Content */}
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
