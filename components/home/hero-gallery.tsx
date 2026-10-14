'use client'

import Image from 'next/image'

export function HeroGallery() {
  const galleryItems = [
    {
      image: '/images/hero-gallery/salvage-yard-operation.png',
      title: 'Nationwide Salvage Yards',
      description: 'Access 2,000+ verified salvage and recycling facilities across all 50 states'
    },
    {
      image: '/images/hero-gallery/engine-inspection.png',
      title: 'Expert Inspections',
      description: 'Every part undergoes rigorous quality checks and certified testing'
    },
    {
      image: '/images/hero-gallery/shipping-logistics.png',
      title: 'Fast Fulfillment',
      description: 'Same-day shipping when available, delivered right to your door'
    },
    {
      image: '/images/hero-gallery/quality-testing.png',
      title: 'Quality Assured',
      description: 'Professional testing and verification ensure peak performance'
    },
    {
      image: '/images/hero-gallery/parts-warehouse.png',
      title: 'Organized Inventory',
      description: 'Professionally managed warehouse with verified parts from trusted suppliers'
    },
    {
      image: '/images/hero-gallery/customer-support.png',
      title: '24/7 Customer Support',
      description: 'Dedicated team ready to help with quotes, shipping, and technical questions'
    },
    {
      image: '/images/hero-gallery/certified-inspection.png',
      title: 'Certified Testing',
      description: 'All parts meet quality standards with compression and functional verification'
    },
    {
      image: '/images/hero-gallery/installation-support.png',
      title: 'Professional Installation',
      description: 'Expert guidance and technical support throughout your installation process'
    }
  ]

  return (
    <section className="relative w-full bg-[#3a3d44] py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
            Why Choose AUAPW
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
            From our nationwide network to quality assurance, we ensure you get the best parts with reliable service
          </p>
        </div>

        {/* Gallery Grid — Two rows of 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-black/20 border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  priority={index < 2}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 group-hover:to-black/90 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                <h3 className="font-bold text-base sm:text-lg tracking-tight mb-1 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            Ready to find the parts you need? Start your search today and connect with verified suppliers across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-black font-bold tracking-wide rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 text-sm uppercase"
            >
              Search Parts Now
            </a>
            <a
              href="/quote"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-bold tracking-wide rounded-lg hover:bg-primary/10 transition-all duration-300 text-sm uppercase"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
