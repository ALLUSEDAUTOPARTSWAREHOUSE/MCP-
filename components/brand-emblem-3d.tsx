'use client'

import React from 'react'

interface BrandEmblem3DProps {
  effect?: 'mercury' | 'diamond-led' | 'ghost-scan'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function BrandEmblem3D({ 
  effect = 'diamond-led', 
  size = 'lg',
  animated = true 
}: BrandEmblem3DProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  }

  const effectClasses = {
    mercury: 'emblem-mercury-effect',
    'diamond-led': 'emblem-diamond-led-effect',
    'ghost-scan': 'emblem-ghost-scan-effect',
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Animated Gear Backdrop */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ 
        animation: animated ? 'gear-rotate 45s linear infinite' : 'none' 
      }}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <g stroke="rgba(232,232,232,0.3)" strokeWidth="2" fill="none">
            <circle cx="200" cy="200" r="120" />
            <circle cx="200" cy="200" r="110" />
            <g>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <line
                  key={angle}
                  x1="200"
                  y1="90"
                  x2="200"
                  y2="70"
                  stroke="rgba(232,232,232,0.2)"
                  strokeWidth="3"
                  transform={`rotate(${angle} 200 200)`}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* 3D Emblem Container with Block Extrusion */}
      <div 
        className={`${sizeClasses[size]} relative flex items-center justify-center ${effectClasses[effect]} ${animated ? 'animate-emblem-pulse' : ''}`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Heavy 3D Block Shadow Base Layer */}
        

        {/* Primary Emblem Face with Foreground Effect */}
        

        {/* Dynamic Effect Layer (Mercury/Diamond LED/Ghost Scan) */}
        {effect === 'mercury' && (
          <div
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: 'linear-gradient(90deg, #5a6778 0%, #8b96a8 25%, #ffffff 50%, #8b96a8 75%, #5a6778 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'border-box',
              animation: animated ? 'mercury-flow 4s ease-in-out infinite' : 'none',
              filter: 'blur(1px)',
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {effect === 'diamond-led' && null}

        {/* Chromatic Fringe Accent */}
        
      </div>
    </div>
  )
}
