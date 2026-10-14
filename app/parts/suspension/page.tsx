'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroBanner } from '@/components/hero-banner'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Search, Grid3x3, List } from 'lucide-react'

import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
const SUSPENSION_PARTS = [
  { id: 'control-arm-front', name: 'Front Control Arm', description: 'Front suspension control arm', avgPrice: 199 },
  { id: 'strut', name: 'Strut Assembly', description: 'Complete strut with coil spring', avgPrice: 249 },
  { id: 'coil-spring', name: 'Coil Spring', description: 'OEM coil spring', avgPrice: 129 },
  { id: 'sway-bar', name: 'Sway Bar', description: 'Stabilizer bar assembly', avgPrice: 179 },
  { id: 'steering-rack', name: 'Steering Rack', description: 'Power steering rack assembly', avgPrice: 449 },
  { id: 'power-steering-pump', name: 'Power Steering Pump', description: 'Hydraulic steering pump', avgPrice: 249 },
  { id: 'tie-rod', name: 'Tie Rod Assembly', description: 'Inner and outer tie rods', avgPrice: 149 },
  { id: 'ball-joint', name: 'Ball Joint', description: 'Upper or lower ball joint', avgPrice: 99 },
  { id: 'wheel-bearing', name: 'Wheel Bearing', description: 'Complete wheel bearing assembly', avgPrice: 179 },
  { id: 'shock-absorber', name: 'Shock Absorber', description: 'OEM shock absorber', avgPrice: 199 },
]

export default function SuspensionProductPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')

  const filteredProducts = useMemo(() => {
    let filtered = SUSPENSION_PARTS.filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (sortBy === 'price-low') filtered.sort((a, b) => a.avgPrice - b.avgPrice)
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.avgPrice - a.avgPrice)
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
    return filtered
  }, [searchTerm, sortBy])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-12 sm:py-16 lg:py-20 bg-card/50 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-black mb-3 text-foreground text-center">Suspension & Steering Components</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-8">Premium suspension and steering parts for smooth handling and safety.</p>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search suspension parts..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} className="flex-1"><Grid3x3 className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className="flex-1"><List className="w-4 h-4" /></Button>
                </div>
                <Button variant="outline" asChild><Link href="/quote">Get Quote</Link></Button>
              </div>
              <div className="text-sm text-muted-foreground">Showing {filteredProducts.length} of {SUSPENSION_PARTS.length} products</div>
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12"><p className="text-lg text-muted-foreground">No products found.</p></div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((part) => (
                  <Card key={part.id} className="overflow-hidden hover:border-primary/50 transition-all">
                    <div className="relative aspect-square bg-card/50" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{part.name}</CardTitle>
                      <CardDescription className="text-xs">{part.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-primary">${part.avgPrice}</span>
                        <span className="text-xs text-muted-foreground">avg price</span>
                      </div>
                      <Button className="w-full auapw-btn auapw-btn-blue" asChild><Link href={`/quote?part=${part.id}&type=suspension`}>Get Quote</Link></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((part) => (
                  <Card key={part.id} className="hover:border-primary/50 transition-all">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-card/50 rounded" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{part.name}</h3>
                          <p className="text-sm text-muted-foreground">{part.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${part.avgPrice}</span>
                          <Badge>In Stock</Badge>
                        </div>
                      </div>
                      <Button className="auapw-btn auapw-btn-blue" asChild><Link href={`/quote?part=${part.id}&type=suspension`}>Get Quote</Link></Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
