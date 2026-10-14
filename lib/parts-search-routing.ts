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
  const model = filters.model?.trim() ?? ''
  const year = filters.year?.trim() ?? ''

  // When a make is selected, route straight to that brand's real inventory
  // catalog (the data actually stocked), not the generic static /catalog demo.
  if (make) {
    const params = new URLSearchParams()
    if (model) params.set('model', model)
    if (isTransmissionPart(partType)) params.set('category', 'transmission')
    else if (isEnginePart(partType)) params.set('category', 'engine')
    // Real inventory is only engine/transmission parts, so any other part
    // type has no category to filter by — year can still narrow the results.
    if (year) params.set('q', year)

    const query = params.toString()
    return query ? `/brands/${makeToBrandSlug(make)}?${query}` : `/brands/${makeToBrandSlug(make)}`
  }

  // No make selected — fall back to the general catalog page.
  const params = new URLSearchParams()
  if (model) params.set('model', model)
  if (isTransmissionPart(partType)) params.set('category', 'transmission')
  else if (isEnginePart(partType)) params.set('category', 'engine')
  else if (partType) params.set('category', partType)
  if (year) params.set('year', year)
  if (filters.location) params.set('location', filters.location)
  if (filters.zipCode) params.set('zip', filters.zipCode)

  const query = params.toString()
  return query ? `/catalog?${query}` : '/catalog'
}
