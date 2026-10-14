'use client'

import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Package, FileText, Car, Heart } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in?redirect=/dashboard')
    }
  }, [session, isPending, router])

  if (isPending || !session?.user) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {session.user.name || 'Customer'}</h1>
        <p className="text-foreground/60">Manage your account, orders, and preferences</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Link href="/dashboard/orders" className="group">
          <div className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Orders</p>
                <p className="text-2xl font-bold">View</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/search-history" className="group">
          <div className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Searches</p>
                <p className="text-2xl font-bold">Track</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/comparisons" className="group">
          <div className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Car className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Comparisons</p>
                <p className="text-2xl font-bold">Save</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/profile" className="group">
          <div className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Profile</p>
                <p className="text-2xl font-bold">Edit</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Info */}
      <div className="p-6 border border-white/10 rounded-lg bg-white/5">
        <h2 className="text-xl font-bold mb-4">Account Overview</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-foreground/60">Email:</span>
            <span className="font-semibold">{session.user.email}</span>
          </div>
          {session.user.name && (
            <div className="flex justify-between">
              <span className="text-foreground/60">Name:</span>
              <span className="font-semibold">{session.user.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground/60">Member Since:</span>
            <span className="font-semibold">
              {session.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
