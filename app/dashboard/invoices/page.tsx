import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Invoices | AUAPW Customer Dashboard',
  description: 'Download and manage your invoices',
}

export default async function InvoicesPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <Link href="/dashboard" className="text-primary hover:underline">
              Back to Dashboard
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Invoices Yet</h2>
            <p className="text-foreground/60">Invoices will appear here after you place an order</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
