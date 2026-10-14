'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function SavedVehicles({ vehicles }: { vehicles: any[] }) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-foreground/70">No saved vehicles</p>
        <Button asChild className="mt-4">
          <Link href="/ai-search">Add a Vehicle</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-semibold text-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              {vehicle.trim && (
                <p className="text-sm text-foreground/70">{vehicle.trim}</p>
              )}
            </div>
            {vehicle.isDefault && (
              <Badge variant="secondary">Default</Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-foreground/70">
            {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
            {vehicle.engine && <p>Engine: {vehicle.engine}</p>}
            {vehicle.transmission && <p>Transmission: {vehicle.transmission}</p>}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link href={`/parts?vehicle=${vehicle.id}`}>Find Parts</Link>
            </Button>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        </div>
      ))}

      <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-4 flex items-center justify-center">
        <Button asChild variant="ghost">
          <Link href="/ai-search">+ Add Vehicle</Link>
        </Button>
      </div>
    </div>
  )
}
