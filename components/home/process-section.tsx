"use client"

const steps = [
  { num: "01", title: "Search Your Part", desc: "Enter your vehicle year, make, model, and the part you need to get matched results instantly.", delay: "0s" },
  { num: "02", title: "Get a Free Quote", desc: "Receive a transparent, no-obligation quote from our verified network with clear pricing upfront.", delay: "0.6s" },
  { num: "03", title: "Confirm & Order", desc: "Review availability, warranty details, and shipping options, then confirm your order with ease.", delay: "1.2s" },
  { num: "04", title: "Fast Delivery", desc: "Your part ships same day when available, delivered directly to your door or local shop.", delay: "1.8s" },
]

export function ProcessSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0d0f16]">
      <div className="metal-line absolute top-0 left-0 right-0" />
      <div className="metal-line absolute bottom-0 left-0 right-0" />

      <div className="mx-auto max-w-[1280px] px-6 relative z-10">

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="process-heading-led font-sans text-[clamp(1.6rem,4vw,2.8rem)] font-black tracking-[0.08em] uppercase text-3d-bold">
            How It Works
          </h2>
          <p className="process-desc-led text-[0.78rem] font-medium tracking-[0.12em] uppercase mt-4 max-w-[420px] mx-auto">
            Finding quality used auto parts has never been this straightforward
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.num}
              className="process-card group relative flex flex-col gap-4 border border-border/30 rounded-sm p-7 overflow-hidden"
              style={{ animationDelay: step.delay }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10" />

              {/* Step number — 8D extrusion + diamond LED flash */}
              <div
                className="process-step-num font-black leading-none select-none"
                style={{ animationDelay: step.delay }}
              >
                {step.num}
              </div>

              {/* Thin chrome rule */}
              <div className="process-rule" />

              {/* Title — mercury chrome + LED pulse */}
              <h3
                className="process-step-title font-black tracking-[0.16em] uppercase leading-tight"
                style={{ animationDelay: step.delay }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="process-step-desc text-[0.72rem] leading-relaxed tracking-[0.04em]"
                style={{ animationDelay: step.delay }}
              >
                {step.desc}
              </p>

              {/* Ghost scan sweep */}
              <span className="ghost-scan-bar" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
