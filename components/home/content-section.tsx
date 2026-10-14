import Link from "next/link"
import Image from "next/image"
import { Search, Truck, Shield, RotateCcw, Clock, ThumbsUp, DollarSign, Grid3X3 } from "lucide-react"

export function ContentSection() {
  return (
    <section className="py-20 bg-[#3a3d44] relative" style={{ paddingTop: '9px' }}>
      <div className="mx-auto max-w-[1000px] px-6 relative z-10" style={{ fontFamily: 'system-ui' }}>
        {/* Banner Image */}
        <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-10">
          <Image src="/images/section-content-banner.png" alt="AUAPW - All Used Auto Parts Warehouse" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <span className="text-[0.65rem] font-black tracking-[0.25em] uppercase text-white/60 mb-2">America&apos;s Largest Network</span>
            <span className="text-2xl sm:text-3xl font-black text-white leading-tight">2,000+ Verified Yards<br />Across All 50 States</span>
          </div>
        </div>

        {/* Main intro */}
        <div className="mb-16">
          <h2 className="small-caps font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black mercury-heading text-3d-section mb-6" style={{ fontFamily: 'system-ui', fontSize: '29px', textTransform: 'uppercase', marginBottom: '0px' }}>
            𝐀𝐔𝐀𝐏𝐖 LLC<br />
            All Used Auto Parts Warehouse<br />
            Trusted Partner for Automotive Services and Solutions<br />
          </h2>
          <div className="text-muted-foreground text-[0.95rem] leading-[1.8] flex flex-col gap-4" style={{ textTransform: 'uppercase', fontWeight: '700' }}>
            <p className="font-medium text-foreground/90">
              AUAPW LLC is a US-based online platform for finding all kinds of used auto parts. We cooperate with the best junkyards and salvage yards around the country, to provide our customers with only top-notch services.
            </p>
            <p className="font-medium text-foreground/85">
              On our website, you can find a simple search tool that helps you find a wide variety of used car parts from different dealers. We help you connect with the best suppliers without extra efforts, serving as a bridge between you and the dealers.
            </p>
            <p className="font-medium text-foreground/85">
              After choosing your desired <strong className="text-foreground font-bold text-3d-accent">used engines</strong> and <strong className="text-foreground font-bold text-3d-accent">used transmissions</strong> and contacting a dealer, you will receive a response in less than 24 hours. All you need is internet access -- no need to roam around different junkyards to find a car part -- we do it all for you.
            </p>
            <p className="font-medium text-foreground/85">
              Taking care of your vehicle can sometimes be a pain and very expensive but with used auto parts you can save a fortune. On AUAPW LLC, we take all the struggle of finding the best auto parts on us. We guarantee that you will get only high-quality products at the most affordable prices.
            </p>
            <p className="font-medium text-foreground/85">
              Our network spans all 50 states with partnerships across <strong className="text-foreground font-bold text-3d-accent">2,000+ verified salvage yards</strong> and recyclers. Whether you need a complete engine, transmission, body panels, electrical components, or any other part -- we have access to millions of quality-tested components ready for immediate shipping.
            </p>
            <p className="font-medium text-foreground/85">
              Every part listed on AUAPW LLC goes through a rigorous quality inspection process. Our partnered dealers test and verify each component before listing, ensuring you receive parts that meet or exceed OEM specifications. We stand behind every sale with our comprehensive <strong className="text-foreground font-bold text-3d-accent">30 to 180-day warranty</strong> program.
            </p>
            <p className="font-medium text-foreground/85">
              Why pay dealership prices when you can get the same quality at a fraction of the cost? Used auto parts from AUAPW LLC typically save our customers <strong className="text-foreground font-bold text-3d-accent">40-70% compared to new OEM parts</strong>. Our transparent pricing means no hidden fees -- what you see is what you pay, with free shipping on most orders.
            </p>
          </div>
        </div>

        {/* Trust & Quality Section */}
        <div className="glass-card rounded-sm p-8 mb-16">
          <h3 className="font-serif text-xl font-bold text-foreground text-3d-subtle mb-4">Why Customers Trust AUAPW LLC</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-foreground text-3d-subtle mb-2">Quality Guaranteed</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Every part is inspected, tested, and verified before shipping. We only work with reputable salvage yards that meet our strict quality standards.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground text-3d-subtle mb-2">Nationwide Coverage</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                With partners in all 50 states, we can source and ship parts to any location in the USA. Fast delivery with real-time tracking on every order.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground text-3d-subtle mb-2">Expert Support</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Our team of automotive experts is available to help you find the exact part you need. We verify fitment and compatibility before every sale.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground text-3d-subtle mb-2">Eco-Friendly Choice</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Choosing recycled auto parts helps reduce landfill waste and minimizes the environmental impact of manufacturing new components.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-sm p-8 mb-16">
          <h3 className="font-serif text-xl font-bold text-foreground text-3d-subtle mb-4">How Does AUAPW LLC Work?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Simple. Browsing through our website is just a breeze - within a few minutes you can find everything you have been looking for. Just fill the required fields, such as the brand, car model, year, etc. and find the most affordable and top-quality parts.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Search, title: "Used Auto Parts Near You", desc: "Search by state, city and zip code to locate used car parts from junkyards near you." },
            { icon: Truck, title: "Free Shipping Nationwide", desc: "No matter which corner of USA you are ordering from, get auto parts delivered to your door." },
            { icon: Shield, title: "Warranty From Dealers", desc: "Get 30-180 days warranty directly from junkyard and salvage yard dealers." },
            { icon: RotateCcw, title: "Easy Returns", desc: "Not satisfied? You can easily return the part. Simple process, no hassle." },
            { icon: Clock, title: "Quick 24-Hour Turnaround", desc: "After you place your request, get a response from dealers within 24 hours." },
            { icon: DollarSign, title: "Best Prices In Industry", desc: "Used car parts cost 2-3x less than new ones with the same durability." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-sm p-6">
              <Icon className="w-6 h-6 text-primary mb-3" />
              <h4 className="text-sm font-bold text-foreground text-3d-subtle mb-2">{title}</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>

        {/* Our Services / Why Best */}
        <div className="mb-16">
          <h3 className="font-serif text-xl font-bold text-foreground text-3d-subtle mb-4">Our Services</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
            AUAPW LLC offers top-of-the-line used car auto parts for all types of vehicles -- Honda, Acura, Dodge, Ford, BMW, you name it. On our online platform, you get the chance to browse through all the best junkyards in the country within minutes.
          </p>
          <h3 className="font-serif text-xl font-bold text-foreground text-3d-subtle mb-4">What Makes Us The Best?</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: ThumbsUp, text: "Most user-friendly interface that makes the searching process 10x easier." },
              { icon: Grid3X3, text: "We provide the largest catalog with all the best deals." },
              { icon: Clock, text: "We help you find your desired auto parts in less than 24 hours." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 bg-secondary/30 border border-border/30 rounded-lg p-4">
                <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center glass-card rounded-sm p-10">
          <h3 className="font-serif text-xl font-bold text-foreground text-3d-bold mb-3">
            Need Highly Durable Yet Affordable Used Car Parts?
          </h3>
          <p className="text-muted-foreground text-sm max-w-[500px] mx-auto mb-8 leading-relaxed font-medium">
            {`You're in the right place. Find the best deals in the country. Save your time and money -- order all kinds of bespoke used auto parts now!`}
          </p>
          
          {/* Why AUAPW Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8 pt-8 border-t border-border/30">
            <div className="bg-secondary/20 p-6 rounded-lg flex flex-col items-center text-center">
              <div className="text-sm font-black text-3d-accent mb-2 uppercase tracking-wide">Premium Quality</div>
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'system-ui' }}>Every component is tested, inspected, and verified to meet OEM specifications before shipment.</p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg flex flex-col items-center text-center">
              <div className="text-sm font-black text-3d-accent mb-2 uppercase tracking-wide">Unbeatable Savings</div>
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'system-ui' }}>Save 40-70% compared to new OEM parts. Same quality, fraction of the dealership cost.</p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg flex flex-col items-center text-center">
              <div className="text-sm font-black text-3d-accent mb-2 uppercase tracking-wide">Complete Protection</div>
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'system-ui' }}>30 to 180-day warranty on all parts. Free returns within 30 days if not satisfied.</p>
            </div>
          </div>


        </div>
      </div>
    </section>
  )
}
