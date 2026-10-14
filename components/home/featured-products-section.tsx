import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Zap, Truck } from "lucide-react"

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "2018 Acura MDX Complete Engine",
    price: "$1,299",
    mileage: "82,000 miles",
    condition: "Excellent",
    rating: 4.8,
    reviews: 24,
    image: "/images/product-engine-1.png",
    tags: ["Engine", "Acura MDX"],
  },
  {
    id: 2,
    name: "Automatic Transmission Assembly",
    price: "$899",
    mileage: "91,000 miles",
    condition: "Good",
    rating: 4.9,
    reviews: 18,
    image: "/images/product-transmission-1.png",
    tags: ["Transmission", "Complete"],
  },
  {
    id: 3,
    name: "High-Quality Alternator",
    price: "$249",
    mileage: "75,000 miles",
    condition: "Excellent",
    rating: 4.7,
    reviews: 31,
    image: "/images/product-alternator-1.png",
    tags: ["Electrical", "Alternator"],
  },
  {
    id: 4,
    name: "Complete Radiator Assembly",
    price: "$399",
    mileage: "85,000 miles",
    condition: "Excellent",
    rating: 5.0,
    reviews: 12,
    image: "/images/product-radiator-1.png",
    tags: ["Cooling", "Radiator"],
  },
  {
    id: 5,
    name: "Front Brake Caliper Set",
    price: "$189",
    mileage: "68,000 miles",
    condition: "Excellent",
    rating: 4.8,
    reviews: 27,
    image: "/images/product-brakes-1.png",
    tags: ["Brakes", "Caliper"],
  },
  {
    id: 6,
    name: "Rear Drive Axle Assembly",
    price: "$549",
    mileage: "79,000 miles",
    condition: "Good",
    rating: 4.6,
    reviews: 15,
    image: "/images/product-drivetrain-1.png",
    tags: ["Drivetrain", "Axle"],
  },
  {
    id: 7,
    name: "Front Strut & Suspension Kit",
    price: "$329",
    mileage: "73,000 miles",
    condition: "Excellent",
    rating: 4.9,
    reviews: 21,
    image: "/images/product-suspension-1.png",
    tags: ["Suspension", "Strut"],
  },
  {
    id: 8,
    name: "Complete Exhaust System",
    price: "$419",
    mileage: "88,000 miles",
    condition: "Good",
    rating: 4.7,
    reviews: 19,
    image: "/images/product-exhaust-1.png",
    tags: ["Exhaust", "System"],
  },
]

export function FeaturedProductsSection() {
  return (
    <section className="py-20 bg-[#3a3d44]">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">Quality Guaranteed</span>
            </div>
            <h2 className="font-sans text-[clamp(1.75rem,4vw,3rem)] font-bold text-foreground text-3d-section text-balance">
              Featured Premium Parts
            </h2>
          </div>
          <Link href="/acura" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="group cursor-pointer h-full glass-card rounded-lg overflow-hidden transition-all hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                {/* Image Container */}
                <div className="relative h-56 bg-gradient-to-br from-card to-background overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-primary/90 text-background px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase">
                      {product.condition}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-sm font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-foreground text-sm leading-tight mb-3 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Specs */}
                  <div className="text-[12px] text-muted-foreground space-y-1 mb-4 pb-4 border-b border-border/30">
                    <div>Mileage: {product.mileage}</div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-primary">{product.price}</span>
                    <button className="relative p-3 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/15 text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 group" aria-label="Request shipping info" title="View shipping options">
                      <Truck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 rounded-xl border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            All parts come with 90-180 day warranty, free shipping nationwide, and 24-hour response time. Get your premium used parts today.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 auapw-btn auapw-btn-blue px-8 py-4 text-sm font-bold"
          >
            <Zap className="w-4 h-4" />
            Get A Free Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
