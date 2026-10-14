'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Wrench, Shield, Truck, Award } from 'lucide-react'

interface HistoryEvent {
  date: string
  title: string
  description: string
  icon: React.ReactNode
}

export function PartsHistory({ partType = 'Engine' }) {
  const history: HistoryEvent[] = [
    {
      date: 'Day 1 - 3',
      title: 'Vehicle Acquisition',
      description: 'Part sourced from verified quality vehicle. Documented mileage and service history reviewed.',
      icon: <Award className="w-5 h-5" />
    },
    {
      date: 'Day 4 - 5',
      title: 'Professional Removal',
      description: 'Carefully removed by certified technicians. All connections photographed for reference.',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      date: 'Day 6 - 8',
      title: 'Comprehensive Inspection',
      description: 'Detailed visual inspection completed. All components checked for defects, wear, or damage.',
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      date: 'Day 9 - 10',
      title: 'Professional Testing',
      description: 'Pressure tested, leak tested, and operation verified. All results documented with serial numbers.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      date: 'Day 11 - 12',
      title: 'Quality Assurance',
      description: 'Final inspection by senior technician. Certificate of testing issued. Part approved for sale.',
      icon: <Award className="w-5 h-5" />
    },
    {
      date: 'Day 13',
      title: 'Packaging & Shipping',
      description: 'Professionally packaged with insulation, cushioning, and tracking. Insured during transit.',
      icon: <Truck className="w-5 h-5" />
    }
  ]

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Part History & Journey</h2>
          <p className="text-lg text-muted-foreground">From sourcing to your doorstep - complete transparency</p>
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-12">
          {history.map((event, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline Connector */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-2 border-background shadow-lg">
                  {event.icon}
                </div>
                {index < history.length - 1 && (
                  <div className="w-1 h-12 bg-gradient-to-b from-primary to-border mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pb-8">
                <Card className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge className="mb-2">{event.date}</Badge>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{event.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">100%</p>
                <p className="text-sm text-muted-foreground">Fully Inspected</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">90 Days</p>
                <p className="text-sm text-muted-foreground">Warranty Coverage</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">$2M</p>
                <p className="text-sm text-muted-foreground">Transit Insurance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">2K+</p>
                <p className="text-sm text-muted-foreground">Yards Sourced From</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Sourcing & Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Where We Source</h4>
              <p className="text-sm text-muted-foreground mb-3">
                We partner with 2,000+ certified auto recycling yards across North America. Each part is sourced from 
                verified suppliers who meet our strict quality standards.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Documentation Provided</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Complete service history from original vehicle</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Testing certificate with verification serial numbers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Condition report with photos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Warranty documentation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Shipping and tracking information</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/30 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Transparency Guarantee:</strong> We believe in complete transparency. All parts can be verified 
                for authenticity and condition. Request the complete documentation package with your order at no extra cost.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
