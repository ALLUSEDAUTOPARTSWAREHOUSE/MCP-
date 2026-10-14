'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function VinSearchForm({ onVehicleFound }: { onVehicleFound: (vehicle: any) => void }) {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDecode = async () => {
    if (!vin || vin.length !== 17) {
      setError('VIN must be exactly 17 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/vin-decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vin.toUpperCase() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to decode VIN')
      }

      const result = await response.json()
      onVehicleFound(result.vehicle)
      setVin('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode VIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Find Parts by VIN</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-foreground/70 mb-2">
            Vehicle Identification Number (VIN)
          </label>
          <Input
            id="vin"
            placeholder="Enter 17-character VIN (e.g., 1HGCV41JXMN109186)"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={17}
            disabled={loading}
            className="font-mono"
          />
          <p className="text-xs text-foreground/50 mt-2">
            Located on your registration or dashboard
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <Button
          onClick={handleDecode}
          disabled={loading || vin.length !== 17}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Decoding VIN...
            </>
          ) : (
            'Decode VIN'
          )}
        </Button>
      </div>
    </Card>
  )
}
