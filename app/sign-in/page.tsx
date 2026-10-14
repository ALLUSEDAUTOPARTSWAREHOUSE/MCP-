import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2">Sign In</h1>
              <p className="text-foreground/60">Access your AUAPW account and orders</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
              <AuthForm mode="sign-in" />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
