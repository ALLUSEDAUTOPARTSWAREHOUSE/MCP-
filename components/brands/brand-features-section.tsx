'use client'

import { CheckCircle, Zap, Shield, TrendingDown, Clock, Award } from 'lucide-react'

interface BrandFeaturesSectionProps {
  brandName: string
  partCount: number
  modelCount: number
}

const features = [
  {
    icon: CheckCircle,
    title: 'Verified Inventory',
    description: 'Every part is inspected and verified for authenticity and quality standards'
  },
  {
    icon: Zap,
    title: 'Fast Sourcing',
    description: 'Access to the largest network of verified suppliers with quick turnaround times'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'All parts come with 30-180 day warranty and guaranteed quality certification'
  },
  {
    icon: TrendingDown,
    title: 'Best Pricing',
    description: 'Save 40-70% compared to new OEM parts with transparent, no-hidden-fee quotes'
  },
  {
    icon: Clock,
    title: '24-Hour Support',
    description: 'Get responses within 24 hours from our dedicated support team'
  },
  {
    icon: Award,
    title: 'Industry Leading',
    description: 'Trust the largest, most reliable used auto parts platform in America'
  }
]

export function BrandFeaturesSection({ brandName, partCount, modelCount }: BrandFeaturesSectionProps) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-slate-900/20 to-background border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-4">
            {brandName} Parts Advantage
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Why Choose {brandName} From AUAPW
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-foreground/80">
            Access {partCount.toLocaleString()} verified {brandName} parts across {modelCount} models with quality guarantees and expert support
          </p>
        </div>

        {/* 6-Card Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-xl p-6 sm:p-8 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.8)] hover:border-slate-500"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 group-hover:from-slate-600 group-hover:to-slate-700 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]">
                  <Icon className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-16 sm:mb-24" />

        {/* 3-Column Brand Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Total Inventory</h3>
            <p className="text-2xl sm:text-3xl font-black text-white mb-3">{partCount.toLocaleString()}</p>
            <p className="text-foreground/70 leading-relaxed">
              Quality {brandName} parts in stock, from common components to rare discontinued items.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Model Coverage</h3>
            <p className="text-2xl sm:text-3xl font-black text-white mb-3">{modelCount}</p>
            <p className="text-foreground/70 leading-relaxed">
              Compatible {brandName} models across multiple years, ensuring you find the perfect fit.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Warranty</h3>
            <p className="text-2xl sm:text-3xl font-black text-white mb-3">30-180 Days</p>
            <p className="text-foreground/70 leading-relaxed">
              All {brandName} parts certified and guaranteed. Complete peace of mind on every purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
