'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MaterialTabs } from '@/components/material-tabs'
import { MaterialType, MaterialCounts } from '@/lib/material-mapper'

interface BrandMaterialTabsProps {
  brand: string
  selected: MaterialType | 'all'
  counts: MaterialCounts
  currentParams: Record<string, string | undefined>
}

export function BrandMaterialTabs({ brand, selected, counts, currentParams }: BrandMaterialTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleMaterialChange = (material: MaterialType | 'all') => {
    const params = new URLSearchParams()
    
    // Keep existing params
    for (const [key, value] of Object.entries(currentParams)) {
      if (value && key !== 'material') {
        params.set(key, value)
      }
    }
    
    // Add new material if not 'all'
    if (material !== 'all') {
      params.set('material', material)
    }
    
    const queryString = params.toString()
    router.push(`/brands/${brand}${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <div className="mb-8 pb-6 border-b border-border/40">
      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Filter by Material</h4>
      <MaterialTabs
        selected={selected}
        onSelect={handleMaterialChange}
        counts={counts}
      />
    </div>
  )
}
