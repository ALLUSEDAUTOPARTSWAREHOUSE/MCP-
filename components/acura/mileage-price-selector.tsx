'use client'

import { useState } from 'react'
import { Gauge, Check } from 'lucide-react'

interface MileagePriceSelectorProps {
  /** Base/default price (medium tier fallback). */
  basePrice: number
  /** Three-tier mileage pricing. */
  tiers?: { low?: number; medium?: number; high?: number }
  /** Called when the shopper picks a tier, with the tier's price. */
  onTierChange?: (tier: TierKey, price: number) => void
}

export type TierKey = 'low' | 'medium' | 'high'

const TIER_META: Record<TierKey, { label: string; miles: string; blurb: string }> = {
  low: { label: 'Low Mileage', miles: 'Under 60k miles', blurb: 'Best condition' },
  medium: { label: 'Medium Mileage', miles: '60k–120k miles', blurb: 'Great value' },
  high: { label: 'High Mileage', miles: 'Over 120k miles', blurb: 'Budget pick' },
}

export function MileagePriceSelector({ basePrice, tiers, onTierChange }: MileagePriceSelectorProps) {
  const [selected, setSelected] = useState<TierKey>('medium')

  const priceFor = (tier: TierKey): number => tiers?.[tier] ?? basePrice
  const selectedPrice = priceFor(selected)

  // Only render the tier picker when real (sheet-provided) tier pricing exists.
  // Without it we show a single price — never duplicated placeholder tiers.
  const hasRealTiers =
    typeof tiers?.low === 'number' && typeof tiers?.medium === 'number' && typeof tiers?.high === 'number'

  if (!hasRealTiers) {
    return (
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-primary">${basePrice.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">+ free shipping</span>
      </div>
    )
  }

  function pick(tier: TierKey) {
    setSelected(tier)
    onTierChange?.(tier, priceFor(tier))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selected price display — updates when a tier is clicked */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-primary">${selectedPrice.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">
          {TIER_META[selected].label} · {TIER_META[selected].miles}
        </span>
      </div>

      {/* Clickable mileage tiers */}
      <div className="rounded-lg border border-border/40 bg-card/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Choose Mileage — Price Updates</span>
        </div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select mileage tier">
          {(Object.keys(TIER_META) as TierKey[]).map((tier) => {
            const isActive = selected === tier
            return (
              <button
                key={tier}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => pick(tier)}
                className={`relative flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
                    : 'border-border/40 bg-background hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
                <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {TIER_META[tier].label.replace(' Mileage', '')}
                </span>
                <span className={`text-lg font-black ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  ${priceFor(tier).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">{TIER_META[tier].miles}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{TIER_META[tier].blurb}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
          Reference prices only — final price depends on exact mileage, condition, and availability.
        </p>
      </div>
    </div>
  )
}
