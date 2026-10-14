'use client'

import { Shield, Lock, Award, CheckCircle2 } from 'lucide-react'

export function TrustBadgesSection() {
  return (
    <section className="py-12 bg-background border-b border-border/20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex flex-col gap-8">
          {/* Trust messaging */}
          <div className="text-center">
            <h3 className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary mb-3">Why Choose AUAPW</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of customers and professionals nationwide. Our commitment to quality, transparency, and customer service sets the industry standard.
            </p>
          </div>

          {/* Trust badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* SSL Secure */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-foreground/5 transition-all">
              <Lock className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="text-[0.75rem] font-bold uppercase tracking-wide">SSL Secure</div>
                <div className="text-[0.65rem] text-muted-foreground mt-1">256-Bit Encrypted</div>
              </div>
            </div>

            {/* Verified Supplier Network */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-foreground/5 transition-all">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="text-[0.75rem] font-bold uppercase tracking-wide">2,000+ Verified</div>
                <div className="text-[0.65rem] text-muted-foreground mt-1">Junkyards & Suppliers</div>
              </div>
            </div>

            {/* Warranty Guarantee */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-foreground/5 transition-all">
              <Award className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="text-[0.75rem] font-bold uppercase tracking-wide">30–180 Day</div>
                <div className="text-[0.65rem] text-muted-foreground mt-1">Warranty Guarantee</div>
              </div>
            </div>

            {/* Professional Support */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-foreground/5 transition-all">
              <Shield className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="text-[0.75rem] font-bold uppercase tracking-wide">24/7 Support</div>
                <div className="text-[0.65rem] text-muted-foreground mt-1">Expert Guidance</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="flex items-center justify-center gap-4 text-center pt-6 border-t border-border/20">
            <div>
              <div className="text-[0.75rem] font-bold uppercase tracking-wide mb-1">Certified & Insured</div>
              <div className="text-[0.65rem] text-muted-foreground">10+ Years Industry Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
