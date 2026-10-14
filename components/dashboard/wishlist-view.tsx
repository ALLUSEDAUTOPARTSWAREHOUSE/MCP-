'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function WishlistView({ wishlistItems }: { wishlistItems: any[] }) {
  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-foreground/70">Your wishlist is empty</p>
        <Button asChild className="mt-4">
          <Link href="/shop">Browse Parts</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/70">
        {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
      </p>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-foreground">Wishlist items will display product details here</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
