'use client'

import { useComparisonStore } from '@/lib/stores/comparison-store'
import { useCartStore } from '@/lib/stores/cart-store'
import Link from 'next/link'
import { Trash2, Scale, ShoppingCart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { BrandLogosSection } from '@/components/brand-logos'
import { mockParts } from '@/lib/mock-data'
import { useState } from 'react'

export default function ComparisonPage() {
  const items = useComparisonStore((state) => state.items)
  const removeItem = useComparisonStore((state) => state.removeItem)
  const clearComparison = useComparisonStore((state) => state.clearComparison)
  const addToCart = useCartStore((state) => state.addItem)
  const [selectedParts, setSelectedParts] = useState<string[]>([])

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

  const handleAddPartToComparison = (partId: string) => {
    const part = mockParts.find((p) => p.id === partId)
    if (part) {
      useComparisonStore.getState().addItem({
        id: part.id,
        name: part.name,
        price: part.price,
        image: part.image,
        make: part.make,
        partType: part.partType,
        condition: part.condition,
        warranty: part.warranty,
        location: part.location,
        rating: part.rating,
      })
      setSelectedParts([])
    }
  }

  const specs = [
    { label: 'Make', key: 'make' },
    { label: 'Part Type', key: 'partType' },
    { label: 'Condition', key: 'condition' },
    { label: 'Warranty', key: 'warranty' },
    { label: 'Location', key: 'location' },
    { label: 'Rating', key: 'rating' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="py-12 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-balance mb-2">Parts Comparison</h1>
            <p className="text-foreground/60">Compare up to 5 parts side-by-side</p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-lg bg-white/5">
              <Scale className="w-16 h-16 mb-4 opacity-40" />
              <h2 className="text-2xl font-semibold mb-2">No parts to compare</h2>
              <p className="text-foreground/60 mb-6">Add parts from inventory to start comparing</p>
              <Link href="/parts" className="auapw-btn auapw-btn-blue auapw-btn-lg">
                Browse Parts
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Comparison table */}
              <div className="overflow-x-auto border border-white/10 rounded-lg bg-white/5">
                <table className="w-full">
                  <tbody>
                    {/* Price row */}
                    <tr className="border-b border-white/10">
                      <td className="p-4 font-semibold sticky left-0 bg-white/5 min-w-[200px]">Price</td>
                      {items.map((item) => (
                        <td key={item.id} className="p-4 text-center min-w-[250px] border-l border-white/10">
                          <p className="text-2xl font-bold text-blue-400">${item.price.toFixed(2)}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Specs rows */}
                    {specs.map((spec) => (
                      <tr key={spec.key} className="border-b border-white/10">
                        <td className="p-4 text-foreground/60 sticky left-0 bg-white/5 min-w-[200px]">{spec.label}</td>
                        {items.map((item) => (
                          <td key={item.id} className="p-4 border-l border-white/10 min-w-[250px]">
                            <p className="text-sm">{item[spec.key as keyof typeof item] as string}</p>
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Actions row */}
                    <tr>
                      <td className="p-4 sticky left-0 bg-white/5 min-w-[200px]"></td>
                      {items.map((item) => (
                        <td key={item.id} className="p-4 border-l border-white/10 min-w-[250px]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="auapw-btn auapw-btn-blue auapw-btn-sm"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="auapw-btn auapw-btn-red auapw-btn-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add more parts section */}
              {useComparisonStore.getState().canAddMore() && (
                <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                  <h3 className="font-semibold mb-4">Add More Parts</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockParts
                      .filter((p) => !items.find((i) => i.id === p.id))
                      .slice(0, 6)
                      .map((part) => (
                        <button
                          key={part.id}
                          onClick={() => handleAddPartToComparison(part.id)}
                          className="auapw-btn auapw-btn-silver auapw-btn-sm w-full text-left"
                        >
                          <p className="font-medium truncate">{part.name}</p>
                          <p className="text-foreground/60 text-xs">${part.price.toFixed(2)}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={clearComparison}
                  className="auapw-btn auapw-btn-red auapw-btn-sm"
                >
                  Clear Comparison
                </button>
                <Link href="/parts" className="auapw-btn auapw-btn-blue auapw-btn-lg">
                  Back to Parts
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
