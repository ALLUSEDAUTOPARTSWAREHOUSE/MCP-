'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AddressAutocompleteProps {
  label?: string
  onAddressSelect?: (details: AddressDetails) => void
  placeholder?: string
  className?: string
}

interface AddressDetails {
  street: string
  city: string
  state: string
  zip: string
  country: string
  lat?: number
  lng?: number
}

declare global {
  interface Window {
    google?: any
  }
}

export function AddressAutocomplete({
  label,
  onAddressSelect,
  placeholder = 'Enter address...',
  className = '',
}: AddressAutocompleteProps) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)

  // Initialize Google Maps services
  useEffect(() => {
    if (!window.google) {
      console.warn('[AddressAutocomplete] Google Maps API not loaded')
      return
    }

    const { google } = window
    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService()
      placesServiceRef.current = new google.maps.places.PlacesService(
        document.createElement('div')
      )
    }
  }, [])

  // Fetch suggestions as user types
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)

    if (inputValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!autocompleteServiceRef.current) {
      console.warn('[AddressAutocomplete] Autocomplete service not ready')
      return
    }

    setLoading(true)
    try {
      const results = await autocompleteServiceRef.current.getPlacePredictions({
        input: inputValue,
        componentRestrictions: { country: 'us' }, // Limit to US for AUAPW
      })

      setSuggestions(results.predictions || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('[AddressAutocomplete] Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = async (placeId: string, description: string) => {
    if (!placesServiceRef.current) return

    setLoading(true)
    try {
      const result = await new Promise((resolve, reject) => {
        placesServiceRef.current.getDetails(
          { placeId, fields: ['address_components', 'geometry', 'formatted_address'] },
          (place: any) => {
            if (place) resolve(place)
            else reject(new Error('Place not found'))
          }
        )
      })

      const place = result as any

      // Extract address components
      const addressDetails: AddressDetails = {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        lat: place.geometry?.location?.lat?.(),
        lng: place.geometry?.location?.lng?.(),
      }

      place.address_components?.forEach((component: any) => {
        const types = component.types || []
        if (types.includes('street_number')) {
          addressDetails.street = component.short_name + ' ' + addressDetails.street
        }
        if (types.includes('route')) {
          addressDetails.street += component.short_name
        }
        if (types.includes('locality')) {
          addressDetails.city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          addressDetails.state = component.short_name
        }
        if (types.includes('postal_code')) {
          addressDetails.zip = component.short_name
        }
        if (types.includes('country')) {
          addressDetails.country = component.long_name
        }
      })

      setValue(description)
      if (onAddressSelect) {
        onAddressSelect(addressDetails)
      }
      setSuggestions([])
      setShowSuggestions(false)
    } catch (error) {
      console.error('[AddressAutocomplete] Error getting place details:', error)
    } finally {
      setLoading(false)
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return (
      <div className={className}>
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled
          className="opacity-50 cursor-not-allowed"
        />
        <p className="text-xs text-amber-600 mt-1">Google Maps API key not configured</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && value.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-9"
        />
        {loading && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion.place_id, suggestion.description)}
              className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm border-b last:border-b-0"
            >
              <div className="font-medium">{suggestion.main_text}</div>
              <div className="text-xs text-muted-foreground">{suggestion.secondary_text}</div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value && value.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 px-4 py-2 text-sm text-muted-foreground">
          No addresses found
        </div>
      )}
    </div>
  )
}
