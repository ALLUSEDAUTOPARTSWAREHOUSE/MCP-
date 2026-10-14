'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface OEMDetailsProps {
  partNumber: string
  manufacturer: string
  condition: string
  warranty: string
  compatibility: string[]
  specifications: Record<string, string>
  installationNotes: string
}

export function OEMDetails({
  partNumber,
  manufacturer,
  condition,
  warranty,
  compatibility,
  specifications,
  installationNotes,
}: OEMDetailsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('compatibility')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="space-y-4">
      {/* OEM Info Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">OEM Part Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-foreground/60">Part Number</label>
            <p className="font-mono text-foreground font-medium">{partNumber}</p>
          </div>
          <div>
            <label className="text-sm text-foreground/60">Manufacturer</label>
            <p className="text-foreground font-medium">{manufacturer}</p>
          </div>
          <div>
            <label className="text-sm text-foreground/60">Condition</label>
            <p className="text-foreground font-medium capitalize">{condition}</p>
          </div>
          <div>
            <label className="text-sm text-foreground/60">Warranty</label>
            <p className="text-foreground font-medium">{warranty}</p>
          </div>
        </div>
      </div>

      {/* Compatibility Matrix */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button
          onClick={() => toggleSection('compatibility')}
          className="w-full p-6 flex items-center justify-between hover:bg-card/80 transition-colors"
        >
          <h3 className="text-lg font-semibold text-foreground">Vehicle Compatibility</h3>
          <ChevronDown
            className={`w-5 h-5 text-foreground/60 transition-transform ${
              expandedSection === 'compatibility' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'compatibility' && (
          <div className="p-6 border-t border-border bg-background/50">
            <div className="space-y-2">
              {compatibility.length > 0 ? (
                compatibility.map((vehicle, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {vehicle}
                  </div>
                ))
              ) : (
                <p className="text-foreground/60">Compatibility information not available</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Specifications */}
      {Object.keys(specifications).length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggleSection('specs')}
            className="w-full p-6 flex items-center justify-between hover:bg-card/80 transition-colors"
          >
            <h3 className="text-lg font-semibold text-foreground">Technical Specifications</h3>
            <ChevronDown
              className={`w-5 h-5 text-foreground/60 transition-transform ${
                expandedSection === 'specs' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSection === 'specs' && (
            <div className="p-6 border-t border-border bg-background/50">
              <div className="space-y-3">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start gap-4">
                    <span className="text-foreground/70 font-medium">{key}</span>
                    <span className="text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Installation Notes */}
      {installationNotes && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggleSection('installation')}
            className="w-full p-6 flex items-center justify-between hover:bg-card/80 transition-colors"
          >
            <h3 className="text-lg font-semibold text-foreground">Installation & Notes</h3>
            <ChevronDown
              className={`w-5 h-5 text-foreground/60 transition-transform ${
                expandedSection === 'installation' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSection === 'installation' && (
            <div className="p-6 border-t border-border bg-background/50">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {installationNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
