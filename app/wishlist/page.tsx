'use client'

import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useCartStore } from '@/lib/stores/cart-store'
import Link from 'next/link'
import { Trash2, Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { BrandLogosSection } from '@/components/brand-logos'

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const removeItem = useWishlistStore((state) => state.removeItem)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      make: item.make,
      partType: item.partType,
    })
  }

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="relative bg-cover bg-center py-20 sm:py-28 border-b border-border/20 mb-12" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(13,15,22,0.82), rgba(13,15,22,0.60), rgba(13,15,22,0.88)), url('/images/heroes/hero-brands.png')" }}>
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">My Wishlist</h1>
            <p className="text-slate-200/90">Save your favorite parts for later</p>
          </div>
        </div>
        <div className="pb-20">
        <div className="mx-auto max-w-6xl px-4">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-lg bg-white/5">
              <Heart className="w-16 h-16 mb-4 opacity-40" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-foreground/60 mb-6">Start adding parts to your wishlist</p>
              <Link href="/parts" className="auapw-btn auapw-btn-blue auapw-btn-lg">
                Browse Parts
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wishlist items */}
              <div className="grid gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    {item.image && (
                      <div className="w-32 h-32 rounded-md bg-white/10 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        {item.make && <p className="text-sm text-foreground/60">{item.make}</p>}
                        {item.partType && <p className="text-sm text-foreground/60">{item.partType}</p>}
                      </div>
                      <p className="text-lg font-bold text-blue-400 mt-2">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-start">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="auapw-btn auapw-btn-red auapw-btn-sm w-full"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="auapw-btn auapw-btn-blue auapw-btn-sm w-full"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={clearWishlist}
                  className="auapw-btn auapw-btn-red auapw-btn-sm"
                >
                  Clear Wishlist
                </button>
                <Link href="/parts" className="auapw-btn auapw-btn-blue auapw-btn-lg">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
