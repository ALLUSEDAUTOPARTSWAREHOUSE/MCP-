import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'My Vehicles | AUAPW Customer Dashboard',
  description: 'Manage your saved vehicles',
}

export default async function VehiclesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Vehicles</h1>
            <Link href="/dashboard" className="text-primary hover:underline">
              Back to Dashboard
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Vehicles Saved</h2>
            <p className="text-foreground/60 mb-6">Save your vehicles to quickly find compatible parts</p>
            <Link href="/ai-search" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Add a Vehicle
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
