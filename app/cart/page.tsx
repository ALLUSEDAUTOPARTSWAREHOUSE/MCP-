'use client'

import { useCartStore } from '@/lib/stores/cart-store'
import Link from 'next/link'
import { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { BrandLogosSection } from '@/components/brand-logos'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const [promoCode, setPromoCode] = useState('')

  const totalPrice = getTotalPrice()
  const shipping = items.length > 0 ? 0 : 0
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + tax + shipping

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="py-8 sm:py-12 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Page header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-balance mb-2">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-foreground/60">Review and manage your selected parts</p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-lg bg-white/5">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-40" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-foreground/60 mb-6">Start adding parts to get started</p>
              <Link href="/parts" className="auapw-btn auapw-btn-blue auapw-btn-lg">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    {item.image && (
                      <div className="w-full sm:w-24 h-32 sm:h-24 rounded-md bg-white/10 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                      {item.make && <p className="text-xs sm:text-sm text-foreground/60">{item.make}</p>}
                      <p className="text-base sm:text-lg font-bold text-blue-400 mt-2">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-2 sm:mt-0">
                      <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1 order-1 sm:order-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-foreground/60 hover:text-foreground transition-colors p-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-foreground/60 hover:text-foreground transition-colors p-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/60 hover:text-red-400 transition-colors p-2 order-2 sm:order-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="h-fit lg:sticky lg:top-32">
                <div className="p-4 sm:p-6 border border-white/10 rounded-lg bg-white/5 space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold">Order Summary</h2>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Shipping</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-400">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full">
                    <button className="auapw-btn auapw-btn-blue w-full auapw-btn-lg">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <Link href="/parts" className="w-full">
                    <button className="auapw-btn auapw-btn-silver w-full auapw-btn-lg">
                      Continue Shopping
                    </button>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="auapw-btn auapw-btn-red w-full auapw-btn-sm"
                  >
                    Clear Cart
                  </button>
                </div>
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
