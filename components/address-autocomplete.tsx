'use client'

import { useState, useRef } from 'react'
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
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const selectedRef = useRef(false)

  // Fetch suggestions from OpenStreetMap Nominatim API (free, no key needed)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    selectedRef.current = false

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (inputValue.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    // Debounce API calls to avoid rate limiting and improve performance
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&addressdetails=1&limit=8&countrycodes=us`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'AUAPW-Checkout',
            },
          }
        )
        const data = await response.json()

        const formattedSuggestions = data.map((result: any) => ({
          id: result.place_id,
          text: result.display_name,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.address?.road || result.address?.residential || result.display_name.split(',')[0] || '',
          city: result.address?.city || result.address?.town || result.address?.village || '',
          state: result.address?.state || '',
          zip: result.address?.postcode || '',
        }))

        setSuggestions(formattedSuggestions)
        setShowSuggestions(formattedSuggestions.length > 0)
      } catch (error) {
        console.error('[v0] Nominatim API error:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    setValue(suggestion.text)
    setShowSuggestions(false)
    setSuggestions([])
    selectedRef.current = true

    if (onAddressSelect) {
      onAddressSelect({
        street: suggestion.address,
        city: suggestion.city,
        state: suggestion.state,
        zip: suggestion.zip,
        country: 'US',
        lat: suggestion.lat,
        lng: suggestion.lng,
      })
    }
  }

  // Handle blur — commit manually typed address if no suggestion selected
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150)
    if (!selectedRef.current && value.trim() && onAddressSelect) {
      onAddressSelect({
        street: value.trim(),
        city: '',
        state: '',
        zip: '',
        country: 'US',
      })
    }
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
          onFocus={() => value && value.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-9"
        />
        {loading && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Suggestions dropdown powered by OpenStreetMap Nominatim */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors text-sm border-b last:border-b-0"
            >
              <div className="font-medium line-clamp-1">{suggestion.address || suggestion.text}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {suggestion.city && `${suggestion.city}, `}{suggestion.state} {suggestion.zip}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value && value.length >= 3 && suggestions.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 px-4 py-2 text-sm text-muted-foreground">
          No addresses found
        </div>
      )}
    </div>
  )
}
