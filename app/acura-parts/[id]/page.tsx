'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShoppingCart, Heart, Phone, Mail, ArrowLeft, Truck, Shield, CheckCircle, AlertTriangle, Package, Tag, Minus, Plus } from 'lucide-react'
import { ACURA_PARTS, getPartById, getPartsByModel, type AcuraPart } from '@/lib/acura-parts-data'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

export default function AcuraPartDetailPage() {
  const params = useParams()
  const id = params.id as string
  const part = getPartById(id)
  
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const addToWishlist = useWishlistStore((state) => state.addItem)

  if (!part) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-[58px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Part Not Found</h1>
            <Link href="/acura-parts" className="text-red-400 hover:underline">Back to Acura Parts</Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Get related parts
  const relatedParts = getPartsByModel(part.model).filter(p => p.id !== part.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart({
      id: part.id,
      name: part.title,
      price: part.price,
      quantity: quantity,
      image: part.image,
      make: 'Acura',
      partType: part.partType,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id: part.id,
      name: part.title,
      price: part.price,
      image: part.image,
      make: 'Acura',
      partType: part.partType,
      addedAt: Date.now(),
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[58px]">
        {/* Breadcrumb */}
        <div className="bg-card/50 border-b border-border/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/acura-parts" className="text-muted-foreground hover:text-foreground transition-colors">Acura Parts</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate">{part.partType}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Back link */}
          <Link href="/acura-parts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Acura Parts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-border/50">
                {/* Product Image */}
                <Image
                  src={part.image}
                  alt={part.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* USED PARTS Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
                  <div className="rotate-[-15deg] opacity-20">
                    <span className="text-6xl md:text-7xl font-black uppercase tracking-widest text-white whitespace-nowrap">USED PART</span>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500/90 text-sm font-bold uppercase tracking-wide text-black shadow-lg">
                    Used Part
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-green-500/90 text-sm font-bold text-black shadow-lg">
                    In Stock
                  </span>
                </div>

                {/* Condition indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1.5 rounded-lg bg-red-600/90 text-sm font-bold text-white shadow-lg">
                    RECYCLED OEM
                  </div>
                </div>

                {/* Corner badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 z-10">
                  OEM Quality Recycled
                </div>
                
                {/* Diagonal banner */}
                <div className="absolute -left-8 top-16 z-10 rotate-[-45deg] bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider py-1 px-10 shadow-lg">
                  Used Parts
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 text-center">
                  <Shield className="w-6 h-6 text-blue-400 mb-2" />
                  <span className="text-xs font-semibold">Inspected</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 text-center">
                  <Truck className="w-6 h-6 text-green-400 mb-2" />
                  <span className="text-xs font-semibold">Fast Ship</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 text-center">
                  <Package className="w-6 h-6 text-amber-400 mb-2" />
                  <span className="text-xs font-semibold">OEM Part</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-semibold">Acura</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold">{part.model}</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-semibold">{part.year}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{part.title}</h1>
                <p className="text-sm text-muted-foreground mt-2">MPN: {part.mpn}</p>
              </div>

              {/* Price */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-foreground">${part.price.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">${part.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">You save ${(part.originalPrice - part.price).toFixed(2)} (15%)</span>
                </div>
              </div>

              {/* Used Part Notice */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-400 mb-1">Used OEM Part</p>
                    <p className="text-sm text-muted-foreground">This is a recycled OEM part from a verified salvage yard. Professionally inspected for quality. Please verify VIN and fitment compatibility before ordering.</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{part.description}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-border/50 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-card transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-card transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all ${
                      addedToCart 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart — ${(part.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border/50 hover:bg-card hover:border-red-500/40 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="sm:hidden">Wishlist</span>
                  </button>
                </div>

                {/* View Cart Link */}
                {addedToCart && (
                  <Link href="/cart" className="block text-center text-red-400 hover:underline text-sm">
                    View Cart &rarr;
                  </Link>
                )}
              </div>

              {/* Contact CTA */}
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <p className="text-sm text-muted-foreground mb-3">Have questions about this part?</p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:8888185001" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                    (888) 818-5001
                  </a>
                  <Link href="/quote" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors">
                    <Mail className="w-4 h-4" />
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Parts */}
          {relatedParts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">More {part.model} Parts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedParts.map((relatedPart) => (
                  <Link
                    key={relatedPart.id}
                    href={`/acura-parts/${relatedPart.id}`}
                    className="group p-4 rounded-xl border border-border/50 bg-card hover:border-red-500/40 transition-all"
                  >
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 mb-3 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-red-400">A</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">{relatedPart.title}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-bold">${relatedPart.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground line-through">${relatedPart.originalPrice.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
