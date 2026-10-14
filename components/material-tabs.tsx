'use client'

import { MaterialIcon, MaterialType, getAllMaterials, getMaterialInfo } from './material-icon'
import { useState } from 'react'

interface MaterialTabsProps {
  selected: MaterialType | 'all'
  onSelect: (material: MaterialType | 'all') => void
  counts?: Record<MaterialType | 'all', number>
}

export function MaterialTabs({ selected, onSelect, counts }: MaterialTabsProps) {
  const materials = getAllMaterials()
  const allCount = counts?.all || 0
  const [flashingTab, setFlashingTab] = useState<string | null>(null)

  const handleTabClick = (material: MaterialType | 'all') => {
    setFlashingTab(material === 'all' ? 'all' : material)
    onSelect(material)
    setTimeout(() => setFlashingTab(null), 300)
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide bg-gradient-to-r from-white/5 via-white/3 to-transparent backdrop-blur-xl rounded-2xl p-4 sm:p-0 sm:bg-transparent sm:backdrop-blur-none">
      <div className="flex gap-3 pb-2 min-w-min pr-6 sm:pr-0 sm:flex-wrap sm:justify-start">
        {/* All Materials Tab - Embossed */}
        <button
          onClick={() => handleTabClick('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 font-semibold text-xs sm:text-sm whitespace-nowrap relative overflow-hidden group transition-all duration-200 backdrop-blur-md ${
            flashingTab === 'all' ? 'animate-pulse' : ''
          } ${
            selected === 'all'
              ? 'border-white/40 bg-white/25 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_8px_32px_rgba(255,255,255,0.1)]'
              : 'border-white/15 bg-white/10 text-white/80 hover:border-white/30 hover:bg-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]'
          }`}
        >
          <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xs font-bold text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
            ◆
          </div>
          <span>All Materials</span>
          {allCount > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono text-[0.65rem] ${
            selected === 'all'
              ? 'bg-slate-400/40 text-slate-900'
              : 'bg-foreground/20 text-foreground'
          }`}>{allCount}</span>}
        </button>

        {/* Material-Specific Tabs - Embossed */}
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => handleTabClick(material.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 font-semibold text-xs sm:text-sm whitespace-nowrap relative overflow-hidden transition-all duration-200 backdrop-blur-md ${
              flashingTab === material.id ? 'animate-pulse scale-105' : ''
            } ${
              selected === material.id
                ? `border-white/40 bg-gradient-to-b ${material.color}/40 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_32px_rgba(255,255,255,0.1)]`
                : 'border-white/15 bg-white/10 text-white/80 hover:border-white/30 hover:bg-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center bg-gradient-to-br ${material.color} text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)] text-xs`}>
              {material.icon}
            </div>
            <span>{material.label}</span>
            {counts?.[material.id] !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono text-[0.65rem] ${
                selected === material.id
                  ? 'bg-white/30 text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]'
                  : 'bg-foreground/20 text-foreground'
              }`}>
                {counts[material.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
