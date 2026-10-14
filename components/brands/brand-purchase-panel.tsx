'use client'

import { useState } from 'react'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { ProductCardActions } from '@/components/products/product-card-actions'

interface BrandPurchasePanelProps {
  productId: string
  productName: string
  basePrice: number
  tiers?: { low: number; medium: number; high: number }
  productImage: string
  productType: string
  make: string
  shipping?: string
}

/**
 * Client island for server-rendered brand product pages: the mileage tier
 * picker updates the price that flows into Call / Message / Quote / Cart.
 */
export function BrandPurchasePanel({
  productId,
  productName,
  basePrice,
  tiers,
  productImage,
  productType,
  make,
  shipping,
}: BrandPurchasePanelProps) {
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-5">
      {/* Interactive pricing by mileage — exact sheet tiers only */}
      <MileagePriceSelector
        basePrice={basePrice}
        tiers={tiers}
        onTierChange={(_, price) => setSelectedPrice(price)}
      />

      <ProductCardActions
        productId={productId}
        productName={productName}
        productPrice={selectedPrice ?? (tiers?.medium ?? basePrice)}
        productImage={productImage}
        productType={productType}
        make={make}
        shipping={shipping}
      />
    </div>
  )
}
