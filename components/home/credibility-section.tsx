import { Shield, Award, CheckCircle2, Star, Users, Clock } from 'lucide-react'

export function CredibilitySection() {
  const credentials = [
    {
      icon: Shield,
      title: 'SSL Secure',
      description: 'Your data is encrypted with industry-standard SSL protection',
    },
    {
      icon: Award,
      title: '4.9 ⭐ Trustpilot Rating',
      description: '2,400+ verified customer reviews with 10+ years industry experience',
    },
    {
      icon: CheckCircle2,
      title: '100% Verified Network',
      description: '2,000+ junkyards personally vetted for quality and reliability',
    },
    {
      icon: Clock,
      title: '24-Hour Response',
      description: 'Fast quotes and expert support every single day',
    },
    {
      icon: Users,
      title: 'Expert Support Team',
      description: 'Certified technicians ready to help with fitment and compatibility',
    },
    {
      icon: Star,
      title: '30-180 Day Warranty',
      description: 'All parts backed by our comprehensive satisfaction guarantee',
    },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Customers Trust AUAPW</h2>
          <p className="text-lg text-foreground/70">
            We&apos;ve earned the trust of thousands of customers across America through quality, reliability, and exceptional service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-12 rounded-lg border border-primary/30 bg-primary/5 p-8 text-center">
          <p className="text-foreground/80 leading-relaxed mb-4">
            AUAPW LLC is America's trusted online marketplace connecting vehicle owners with quality used OEM auto parts from verified suppliers nationwide. 
            We combine cutting-edge technology, transparent pricing, and exceptional customer service to make finding the right part effortless.
          </p>
          <p className="text-sm text-foreground/60">
            Founded to revolutionize how Americans access affordable, quality used auto parts — we&apos;re your trusted partner in vehicle maintenance and repair.
          </p>
        </div>
      </div>
    </section>
  )
}
