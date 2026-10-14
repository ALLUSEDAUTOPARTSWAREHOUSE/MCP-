import { Droplet, Zap, Flame, Wind, Gauge, Layers, Box } from 'lucide-react'

export type MaterialType = 'steel' | 'aluminum' | 'cast-iron' | 'composite' | 'rubber' | 'ceramic' | 'plastic'

export interface MaterialInfo {
  id: MaterialType
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

const MATERIALS: Record<MaterialType, MaterialInfo> = {
  'steel': {
    id: 'steel',
    label: 'Steel',
    icon: <Gauge className="w-5 h-5" />,
    color: 'from-slate-600 to-slate-700',
    description: 'High-strength steel components'
  },
  'aluminum': {
    id: 'aluminum',
    label: 'Aluminum',
    icon: <Layers className="w-5 h-5" />,
    color: 'from-zinc-400 to-zinc-500',
    description: 'Lightweight aluminum parts'
  },
  'cast-iron': {
    id: 'cast-iron',
    label: 'Cast Iron',
    icon: <Flame className="w-5 h-5" />,
    color: 'from-amber-900 to-amber-950',
    description: 'Cast iron engine blocks & parts'
  },
  'composite': {
    id: 'composite',
    label: 'Composite',
    icon: <Box className="w-5 h-5" />,
    color: 'from-blue-600 to-blue-700',
    description: 'Composite & mixed materials'
  },
  'rubber': {
    id: 'rubber',
    label: 'Rubber',
    icon: <Wind className="w-5 h-5" />,
    color: 'from-black to-gray-900',
    description: 'Rubber seals & gaskets'
  },
  'ceramic': {
    id: 'ceramic',
    label: 'Ceramic',
    icon: <Droplet className="w-5 h-5" />,
    color: 'from-yellow-600 to-yellow-700',
    description: 'Ceramic brake pads & parts'
  },
  'plastic': {
    id: 'plastic',
    label: 'Plastic',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-purple-600 to-purple-700',
    description: 'Plastic & polymer components'
  }
}

export function getMaterialInfo(type: MaterialType): MaterialInfo {
  return MATERIALS[type]
}

export function getAllMaterials(): MaterialInfo[] {
  return Object.values(MATERIALS)
}

interface MaterialIconProps {
  type: MaterialType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function MaterialIcon({ type, size = 'md', showLabel = false }: MaterialIconProps) {
  const material = getMaterialInfo(type)
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br ${material.color} shadow-lg flex items-center justify-center text-white border border-white/20`}>
        {material.icon}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-center text-foreground">{material.label}</span>
      )}
    </div>
  )
}
