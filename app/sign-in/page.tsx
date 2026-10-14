import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center">Loading...</div>}>
      <AuthForm mode="sign-in" />
    </Suspense>
  )
}
