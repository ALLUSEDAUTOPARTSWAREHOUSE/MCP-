import type { MaterialType } from '@/components/material-icon'

export type { MaterialType }
export type MaterialCounts = Record<MaterialType | 'all', number>

export function getPartMaterial(partName: string, category?: string): MaterialType {
  const nameLower = partName.toLowerCase()
  const categoryLower = category?.toLowerCase() || ''

  // Engine blocks and cylinder heads - Cast Iron
  if (
    nameLower.includes('engine block') ||
    nameLower.includes('cylinder head') ||
    nameLower.includes('intake manifold') ||
    nameLower.includes('exhaust manifold') ||
    categoryLower.includes('engine')
  ) {
    return 'cast-iron'
  }

  // Transmission parts - Steel
  if (
    nameLower.includes('transmission') ||
    nameLower.includes('gearbox') ||
    nameLower.includes('gear') ||
    nameLower.includes('shaft') ||
    categoryLower.includes('transmission')
  ) {
    return 'steel'
  }

  // Aluminum parts - wheels, radiators, alternators
  if (
    nameLower.includes('wheel') ||
    nameLower.includes('radiator') ||
    nameLower.includes('alternator') ||
    nameLower.includes('air filter') ||
    nameLower.includes('aluminum')
  ) {
    return 'aluminum'
  }

  // Rubber parts - gaskets, seals, belts
  if (
    nameLower.includes('gasket') ||
    nameLower.includes('seal') ||
    nameLower.includes('belt') ||
    nameLower.includes('hose') ||
    nameLower.includes('rubber') ||
    nameLower.includes('mount')
  ) {
    return 'rubber'
  }

  // Ceramic - brake pads, spark plugs
  if (
    nameLower.includes('brake pad') ||
    nameLower.includes('spark plug') ||
    nameLower.includes('ceramic') ||
    nameLower.includes('insulator')
  ) {
    return 'ceramic'
  }

  // Composite - bumpers, trim, panels
  if (
    nameLower.includes('bumper') ||
    nameLower.includes('trim') ||
    nameLower.includes('panel') ||
    nameLower.includes('fender') ||
    nameLower.includes('composite')
  ) {
    return 'composite'
  }

  // Plastic - fluid reservoirs, covers, clips
  if (
    nameLower.includes('reservoir') ||
    nameLower.includes('cover') ||
    nameLower.includes('tank') ||
    nameLower.includes('clip') ||
    nameLower.includes('plastic')
  ) {
    return 'plastic'
  }

  // Default to Steel
  return 'steel'
}

export function filterPartsByMaterial(
  parts: any[],
  material: MaterialType | 'all'
): any[] {
  if (material === 'all') return parts
  return parts.filter(part => getPartMaterial(part.name, part.category) === material)
}

export function countPartsByMaterial(parts: any[]): Record<MaterialType | 'all', number> {
  const counts: Record<MaterialType | 'all', number> = {
    'all': parts.length,
    'steel': 0,
    'aluminum': 0,
    'cast-iron': 0,
    'composite': 0,
    'rubber': 0,
    'ceramic': 0,
    'plastic': 0
  }

  parts.forEach(part => {
    const material = getPartMaterial(part.name, part.category)
    counts[material]++
  })

  return counts
}
