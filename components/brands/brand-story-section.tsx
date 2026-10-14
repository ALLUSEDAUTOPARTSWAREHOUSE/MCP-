'use client'

interface BrandStorySectionProps {
  brand: string
  label: string
  productCount: number
}

const BRAND_STORIES: { [key: string]: { heritage: string; quality: string } } = {
  acura: {
    heritage: 'Acura, Honda\'s premium division since 1986, represents precision engineering and innovation in luxury automotive performance.',
    quality: 'Every Acura part in our inventory undergoes rigorous testing to ensure OEM quality standards with exact mileage-based pricing.',
  },
  honda: {
    heritage: 'Honda has revolutionized the automotive industry for over 70 years with reliable, efficient, and innovative vehicles.',
    quality: 'Our Honda parts collection features genuine OEM components verified for fit, function, and durability.',
  },
  toyota: {
    heritage: 'Toyota\'s commitment to quality, reliability, and continuous improvement has made it the world\'s leading automaker.',
    quality: 'All Toyota parts are factory-tested with comprehensive warranty coverage and nationwide shipping.',
  },
  ford: {
    heritage: 'Ford has been an American automotive icon since 1903, pioneering mass production and vehicle innovation.',
    quality: 'Our Ford inventory includes genuine OEM parts with exact mileage documentation for every component.',
  },
  chevrolet: {
    heritage: 'Chevrolet, founded in 1911, stands as an American institution known for powerful performance and reliability.',
    quality: 'All Chevrolet parts meet OEM specifications with 90-day warranty and comprehensive testing protocols.',
  },
}

export function BrandStorySection({ brand, label, productCount }: BrandStorySectionProps) {
  const story = BRAND_STORIES[brand] || {
    heritage: `${label} has built a reputation for engineering excellence and automotive innovation.`,
    quality: `Our ${label} parts inventory features genuine OEM components tested for quality and durability.`,
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 border-t border-b border-amber-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Heritage Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-transparent rounded-full" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">Brand Heritage</h3>
            </div>
            <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-medium">
              {story.heritage}
            </p>
          </div>

          {/* Quality Assurance Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-transparent rounded-full" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">Quality Assurance</h3>
            </div>
            <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-medium">
              {story.quality}
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400 mb-1">{productCount.toLocaleString()}+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Parts Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400 mb-1">90 Day</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Warranty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400 mb-1">24/7</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400 mb-1">USA</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Shipping</div>
          </div>
        </div>
      </div>
    </section>
  )
}
