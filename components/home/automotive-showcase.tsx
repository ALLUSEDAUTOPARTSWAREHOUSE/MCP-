import Link from "next/link"
import { Zap, TrendingUp, Gauge, Wrench } from "lucide-react"

export function AutomotiveShowcase() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#3a3d44] via-[#2a2d34] to-[#1a1d24] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold tracking-widest uppercase text-orange-500">Premium Quality Parts</span>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 text-balance">
            Engines & Transmissions
            <br />
            Built for Performance
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Browse our collection of professionally inspected engines and transmissions from trusted salvage yards nationwide.
          </p>
        </div>

        {/* Showcase grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Engines showcase */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />
            
            {/* Engine image */}
            <div className="relative h-96 w-full overflow-hidden">
              <img
                src="/product-images/engines/v8-engine-complete.png"
                alt="Premium Engine Assembly"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Used Engines</h3>
                  <p className="text-sm text-gray-300">28+ brands available</p>
                </div>
              </div>
              <p className="text-gray-100 mb-6 leading-relaxed">
                All engines compression-tested, leak-inspected, and matched to your exact vehicle. 30-180 day warranty included.
              </p>
              <Link 
                href="/parts?category=engines"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300 w-fit"
              >
                <Zap className="w-4 h-4" />
                Browse Engines
              </Link>
            </div>
          </div>

          {/* Transmissions showcase */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />
            
            {/* Transmission image */}
            <div className="relative h-96 w-full overflow-hidden">
              <img
                src="/product-images/transmissions/auto-6-speed-complete.png"
                alt="Premium Transmission Assembly"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Used Transmissions</h3>
                  <p className="text-sm text-gray-300">Automatic & Manual</p>
                </div>
              </div>
              <p className="text-gray-100 mb-6 leading-relaxed">
                Professionally assembled and tested. All transmissions guaranteed compatible with your year, make, and model.
              </p>
              <Link 
                href="/parts?category=transmissions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all duration-300 w-fit"
              >
                <TrendingUp className="w-4 h-4" />
                Browse Transmissions
              </Link>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: "56+", label: "Product Images", icon: "📸" },
            { value: "28", label: "Brands Covered", icon: "🚗" },
            { value: "4:3", label: "Aspect Ratio", icon: "📐" },
            { value: "HTTP 200", label: "Success Rate", icon: "✓" },
          ].map(({ value, label, icon }) => (
            <div key={label} className="p-4 md:p-6 rounded-lg border border-white/10 hover:border-white/30 transition-all bg-white/5 hover:bg-white/10">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-2xl font-black text-white mb-1">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
