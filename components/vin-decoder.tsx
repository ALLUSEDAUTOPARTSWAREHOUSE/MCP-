'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VinDecodeResult {
  vin: string
  modelYear: number
  manufacturer: string | null
  wmi: string
  make: string | null
  model: string | null
  trim: string | null
  engine: string | null
  transmission: string | null
  body: string | null
}

export function VinDecoder() {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VinDecodeResult | null>(null)
  const [error, setError] = useState('')

  const handleDecode = async () => {
    setError('')
    setResult(null)

    if (!vin.trim()) {
      setError('Please enter a VIN')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vin-decoder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vin.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to decode VIN')
        return
      }

      setResult(data)
    } catch (err) {
      setError('Error decoding VIN. Please try again.')
      console.error('[v0] VIN decode error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleDecode()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Enter Your VIN (17 characters)
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., 1HGBH41JXMN109186"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            maxLength={17}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleDecode}
            disabled={loading}
            className="px-8"
          >
            {loading ? 'Decoding...' : 'Decode'}
          </Button>
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          Find your VIN on the driver's door jamb or insurance card
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Decoded Vehicle Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground/60">Model Year</label>
              <p className="text-foreground font-medium">{result.modelYear}</p>
            </div>
            {result.manufacturer && (
              <div>
                <label className="text-sm text-foreground/60">Manufacturer</label>
                <p className="text-foreground font-medium">{result.manufacturer}</p>
              </div>
            )}
            {result.make && (
              <div>
                <label className="text-sm text-foreground/60">Make</label>
                <p className="text-foreground font-medium">{result.make}</p>
              </div>
            )}
            {result.model && (
              <div>
                <label className="text-sm text-foreground/60">Model</label>
                <p className="text-foreground font-medium">{result.model}</p>
              </div>
            )}
            {result.engine && (
              <div>
                <label className="text-sm text-foreground/60">Engine</label>
                <p className="text-foreground font-medium">{result.engine}</p>
              </div>
            )}
            {result.transmission && (
              <div>
                <label className="text-sm text-foreground/60">Transmission</label>
                <p className="text-foreground font-medium">{result.transmission}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button className="w-full" size="lg">
              Find Parts for {result.modelYear} Vehicle
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
