import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Zap, Truck, CheckCircle } from "lucide-react"

const ACURA_FEATURED = [
  {
    id: 1,
    name: "2018 Acura MDX V6 Engine",
    price: "$1,299",
    mileage: "82,000 miles",
    condition: "Excellent",
    rating: 4.9,
    reviews: 45,
    image: "/product-images/showcase/acura-mdx-engine.png",
    tags: ["Engine", "V6", "Complete"],
    description: "Premium 3.5L V6 complete engine assembly for 2018 Acura MDX. Fully tested with compression and leak-down tests. 90-day warranty included.",
  },
  {
    id: 2,
    name: "2012 Acura TSX Automatic Transmission",
    price: "$899",
    mileage: "91,000 miles",
    condition: "Excellent",
    rating: 4.8,
    reviews: 32,
    image: "/product-images/showcase/acura-tsx-transmission.png",
    tags: ["Transmission", "AT", "Complete"],
    description: "5-speed automatic transmission assembly. Fully functional, ready to install. Tested and guaranteed.",
  },
  {
    id: 3,
    name: "Acura TL High-Quality Alternator",
    price: "$249",
    mileage: "75,000 miles",
    condition: "Excellent",
    rating: 5.0,
    reviews: 28,
    image: "/product-images/showcase/acura-tl-alternator.png",
    tags: ["Electrical", "Alternator", "OEM"],
    description: "Premium OEM quality alternator. Perfect electrical output, pristine condition. Immediate availability.",
  },
  {
    id: 4,
    name: "Complete Engine + Transmission Assembly",
    price: "$1,899",
    mileage: "85,000 miles",
    condition: "Excellent",
    rating: 4.9,
    reviews: 19,
    image: "/product-images/showcase/featured-assembly.png",
    tags: ["Complete", "Assembly", "Turnkey"],
    description: "Complete drivetrain assembly. Engine and transmission ready as one unit. Fastest installation option.",
  },
]

export function AcuraFeaturedComponents() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-red-600 to-red-500" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-red-500">Premium Acura Parts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 text-balance">
            Featured Acura Components
          </h2>
          <p className="text-base sm:text-lg text-slate-300/80 max-w-2xl">
            Premium engines, transmissions, and essential parts sourced from verified Acura vehicles. Every component tested and guaranteed.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ACURA_FEATURED.map((product) => (
            <div
              key={product.id}
              className="group h-full rounded-xl overflow-hidden border border-slate-700/40 bg-slate-800/40 backdrop-blur transition-all hover:border-red-500/50 hover:bg-slate-800/60 hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)]"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Condition Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold uppercase">
                    {product.condition}
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Name */}
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300/70 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="text-xs text-slate-400 space-y-1 mb-4 pb-4 border-b border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-red-500" />
                    <span>Mileage: {product.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>({product.reviews} verified reviews)</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-black text-red-500">{product.price}</span>
                  <Link
                    href="/quote"
                    className="p-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                    title="Request quote"
                  >
                    <Truck className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-600/10 border border-red-500/20 rounded-xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Need a Different Acura Part?
          </h3>
          <p className="text-slate-300/80 mb-6 max-w-2xl mx-auto">
            We have 14,000+ Acura components in inventory. Every part comes with 90-180 day warranty, free shipping nationwide, and 24-hour response time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search?make=acura"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              <Zap className="w-4 h-4" />
              Search Acura Parts
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Get Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
