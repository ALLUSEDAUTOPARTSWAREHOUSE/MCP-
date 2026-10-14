'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart-store'
import { CalendarCheck } from 'lucide-react'

interface BrandPurchasePanelProps {
  productId: string
  productName: string
  basePrice: number
  tiers?: { low: number; medium: number; high: number }
  productImage: string
  productType: string
  make: string
  shipping?: string
  availability?: 'in_stock' | 'out_of_stock' | 'backorder'
  detailsHref?: string
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
  availability = 'in_stock',
  detailsHref,
}: BrandPurchasePanelProps) {
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  // No sheet price means this part is call/quote-only — never let it into the cart as a $0 item.
  const isQuoteOnly = !tiers && basePrice <= 0
  const router = useRouter()
  const addReservationItem = useCartStore((state) => state.addReservationItem)

  const handleReserveOnline = () => {
    addReservationItem({
      id: productId,
      name: productName,
      image: productImage,
      make,
      partType: productType,
    })
    router.push('/checkout')
  }

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
        detailsHref={detailsHref}
        purchaseDisabled={availability !== 'in_stock' || isQuoteOnly}
        isQuoteOnly={isQuoteOnly}
      />
      {isQuoteOnly ? (
        <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p role="status" className="text-sm text-muted-foreground">
            This part is priced by phone. Reserve it online with no payment due now, or call and we&apos;ll confirm
            pricing and availability.
          </p>
          <Button onClick={handleReserveOnline} className="w-full font-bold" size="lg">
            <CalendarCheck className="h-4 w-4" />
            Reserve Online — No Payment Due Now
          </Button>
        </div>
      ) : (
        availability !== 'in_stock' && (
          <p role="status" className="text-sm text-muted-foreground">
            {availability === 'backorder' ? 'This part is on backorder.' : 'This part is out of stock.'} Contact us to confirm availability before ordering.
          </p>
        )
      )}
    </div>
  )
}
