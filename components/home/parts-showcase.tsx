'use client'

export function PartsShowcase() {
  const parts = [
    {
      image: '/images/parts-showcase/engine-block-showcase.png',
      title: 'Engine Blocks',
      description: 'Complete engine blocks from verified sources',
      rating: 4.9,
      reviews: 234
    },
    {
      image: '/images/parts-showcase/transmission-assembly.png',
      title: 'Transmissions',
      description: 'Automatic and manual transmission assemblies',
      rating: 4.8,
      reviews: 189
    },
    {
      image: '/images/parts-showcase/alternator-generator.png',
      title: 'Alternators',
      description: 'OEM and high-quality alternator units',
      rating: 4.9,
      reviews: 156
    },
    {
      image: '/images/parts-showcase/starter-motor.png',
      title: 'Starter Motors',
      description: 'Reliable starter motor assemblies',
      rating: 4.7,
      reviews: 142
    },
    {
      image: '/images/parts-showcase/radiator-cooling.png',
      title: 'Radiators',
      description: 'Complete cooling system radiators',
      rating: 4.8,
      reviews: 178
    },
    {
      image: '/images/parts-showcase/fuel-pump-assembly.png',
      title: 'Fuel Pumps',
      description: 'High-performance fuel pump assemblies',
      rating: 4.9,
      reviews: 167
    }
  ]

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Popular Auto Parts
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our most requested automotive components with verified quality and competitive pricing
          </p>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part, idx) => (
            <div
              key={idx}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={part.image}
                  alt={part.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {part.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {part.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {part.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({part.reviews} reviews)
                  </span>
                </div>

                {/* CTA Button */}
                <button className="w-full py-2 px-4 bg-accent text-accent-foreground rounded font-semibold hover:opacity-90 transition-opacity">
                  View Parts
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse All Parts →
          </a>
        </div>
      </div>
    </section>
  )
}
