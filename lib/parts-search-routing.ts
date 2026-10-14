export type PartsSearchFilters = {
  make?: string
  model?: string
  year?: string
  partType?: string
  location?: string
  zipCode?: string
}

function isTransmissionPart(partType: string) {
  return /\btransmission\b/i.test(partType)
}

function isEnginePart(partType: string) {
  return /\bengine\b/i.test(partType) && !isTransmissionPart(partType)
}

/** Converts a make name (e.g. "Mercedes-Benz", "Land Rover") to its brand catalog slug. */
function makeToBrandSlug(make: string) {
  return make.trim().toLowerCase().replace(/\s+/g, '-')
}

export function getPartsSearchUrl(filters: PartsSearchFilters) {
  const partType = filters.partType?.trim() ?? ''
  const make = filters.make?.trim() ?? ''

  // Route to the catalog page with make filter applied
  const params = new URLSearchParams()
  if (make) params.set('make', make)
  if (filters.model) params.set('model', filters.model)
  if (isTransmissionPart(partType)) params.set('category', 'transmission')
  else if (isEnginePart(partType)) params.set('category', 'engine')
  else if (partType) params.set('category', partType)
  if (filters.year) params.set('year', filters.year)
  if (filters.location) params.set('location', filters.location)
  if (filters.zipCode) params.set('zip', filters.zipCode)

  const query = params.toString()
  return query ? `/catalog?${query}` : '/catalog'
}
