'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2 } from 'lucide-react'

interface GooglePlacesInputProps {
  value: string
  onChange: (address: string) => void
  onAddressSelect?: (address: {
    formatted: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    lat: number
    lng: number
  }) => void
  placeholder?: string
  className?: string
}

declare global {
  interface Window {
    google?: any
  }
}

export function GooglePlacesInput({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Enter your address...',
  className = '',
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load Google Places API
  useEffect(() => {
    // Check if Google API is already loaded
    if (window.google?.maps?.places) {
      initializeAutocomplete()
      return
    }

    // Load Google Maps API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError('Google Maps API key not configured')
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`
    script.async = true
    script.defer = true
    script.onload = initializeAutocomplete
    script.onerror = () => setError('Failed to load Google Maps API')
    document.head.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [])

  // Initialize autocomplete
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return

    try {
      const options = {
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Restrict to US, change as needed
        fields: ['formatted_address', 'geometry', 'address_components'],
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options)

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()

        if (!place.geometry) {
          setError('Invalid address selected')
          return
        }

        // Parse address components
        const addressComponents: Record<string, string> = {}
        place.address_components?.forEach((component: any) => {
          component.types.forEach((type: string) => {
            addressComponents[type] = component.long_name
          })
        })

        const parsedAddress = {
          formatted: place.formatted_address,
          street: `${addressComponents['street_number'] || ''} ${addressComponents['route'] || ''}`.trim(),
          city: addressComponents['locality'] || '',
          state: addressComponents['administrative_area_level_1'] || '',
          zip: addressComponents['postal_code'] || '',
          country: addressComponents['country'] || 'US',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }

        onChange(place.formatted_address)
        onAddressSelect?.(parsedAddress)
        setError('')
      })
    } catch (err) {
      setError('Failed to initialize address autocomplete')
      console.error('[GooglePlaces] Initialization error:', err)
    }
  }

  // Trigger search on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setError('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          autoComplete="off"
          disabled={isLoading}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Autocomplete suggestions dropdown is rendered by Google Maps library */}
      <style jsx global>{`
        .pac-container {
          z-index: 1000;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
        }

        .pac-item {
          padding: 10px;
          cursor: pointer;
          color: var(--foreground);
          border-bottom: 1px solid var(--border);
        }

        .pac-item:hover,
        .pac-item-selected {
          background: var(--accent);
        }

        .pac-item-query {
          display: none;
        }

        .pac-matched {
          font-weight: 600;
          color: var(--primary);
        }
      `}</style>
    </div>
  )
}
