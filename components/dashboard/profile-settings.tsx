'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function ProfileSettings() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
        <p className="text-foreground/70 mb-6">Manage your account preferences and security</p>

        <div className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <p className="text-sm font-medium text-foreground">Email Notifications</p>
            <p className="text-sm text-foreground/70 mt-1">
              Receive updates about orders and new products
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Manage Notifications
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <p className="text-sm font-medium text-foreground">Password & Security</p>
            <p className="text-sm text-foreground/70 mt-1">
              Change your password and manage login sessions
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Change Password
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <p className="text-sm font-medium text-foreground">Billing Information</p>
            <p className="text-sm text-foreground/70 mt-1">
              Update your billing address and payment methods
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Manage Billing
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50 p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-800 dark:text-red-300 mb-6">
          These actions cannot be undone
        </p>
        <Button
          variant="destructive"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
