'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PartDetail {
  label: string
  value: string
}

interface PartDetailsProps {
  partType: string
  specifications?: PartDetail[]
  condition?: string
  yearRange?: string
  mileageRange?: string
}

const defaultSpecifications: Record<string, PartDetail[]> = {
  engine: [
    { label: 'Type', value: 'Naturally Aspirated / Turbocharged' },
    { label: 'Displacement', value: 'Varies by model' },
    { label: 'Horsepower', value: 'Varies by year' },
    { label: 'Valve Configuration', value: 'DOHC / SOHC' },
    { label: 'Fuel Injection', value: 'Direct / Port Injection' },
    { label: 'Cooling System', value: 'Liquid Cooled' }
  ],
  transmission: [
    { label: 'Type', value: 'Automatic / Manual / CVT' },
    { label: 'Gears', value: '4-10 Speed' },
    { label: 'Torque Converter', value: 'Yes / Clutch' },
    { label: 'Overdrive', value: 'Available' },
    { label: 'Shifting Type', value: 'Electronic / Mechanical' },
    { label: 'Fluid Type', value: 'ATF / Manual Fluid' }
  ],
  drivetrain: [
    { label: 'Type', value: 'Front-Wheel / Rear-Wheel / All-Wheel Drive' },
    { label: 'Differential', value: 'Open / Limited Slip / Locking' },
    { label: 'Gear Ratio', value: 'Varies by model' },
    { label: 'Axle Diameter', value: 'Varies by application' },
    { label: 'CV Joints', value: 'Outer & Inner' },
    { label: 'Bearings', value: 'Sealed Ball / Roller' }
  ],
  default: [
    { label: 'Part Type', value: 'Automotive Component' },
    { label: 'Condition', value: 'Used / Remanufactured' },
    { label: 'Warranty', value: '90 Days' },
    { label: 'Testing', value: 'Complete Inspection & Testing' },
    { label: 'Documentation', value: 'Full Service History Available' },
    { label: 'Installation', value: 'Professional Installation Recommended' }
  ]
}

export function PartsDetails({
  partType,
  specifications,
  condition = 'Used - Good Condition',
  yearRange = '1990-Present',
  mileageRange = '0-150,000 miles'
}: PartDetailsProps) {
  const specs = specifications || defaultSpecifications[partType.toLowerCase()] || defaultSpecifications.default

  return (
    <section className="py-16 bg-card/30 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">Product Details & Specifications</h2>

        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="condition">Condition Report</TabsTrigger>
            <TabsTrigger value="testing">Testing Report</TabsTrigger>
          </TabsList>

          {/* Specifications Tab */}
          <TabsContent value="specs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Specifications</CardTitle>
                <CardDescription>Complete details about this {partType}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex justify-between items-start pb-4 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-muted-foreground">{spec.label}</span>
                      <span className="font-semibold text-foreground ml-2">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Condition Report Tab */}
          <TabsContent value="condition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Part Condition</CardTitle>
                <CardDescription>Current state and quality assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Overall Condition</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-green-600 hover:bg-green-700">{condition}</Badge>
                    <Badge variant="outline">Tested</Badge>
                    <Badge variant="outline">Inspected</Badge>
                    <Badge className="bg-blue-600 hover:bg-blue-700">In Stock</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Physical Condition</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>No external damage or cracks</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Clean and free of corrosion</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>All components present</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Factory original parts</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Functional Status</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Fully operational</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>All systems tested</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>No leaks detected</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Performance certified</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Report Tab */}
          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Assurance & Testing</CardTitle>
                <CardDescription>Comprehensive testing results and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-3">Pre-Shipping Tests</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">▪</span>
                        <span>Compression test completed</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">▪</span>
                        <span>Pressure leak test performed</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">▪</span>
                        <span>Functional operation verified</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">▪</span>
                        <span>Electrical systems checked</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">▪</span>
                        <span>Fluid levels inspected</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-3">Standards Compliance</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>EPA Compliance</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>OSHA Safety Standards</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>DOT Transportation Rules</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Industry Best Practices</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>ISO Quality Standards</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/30">
                  <h4 className="font-semibold mb-2">Test Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    This part has passed all quality checks and comes with a certificate of testing. 
                    Full documentation available upon request.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compatible Years</p>
                <p className="font-semibold">{yearRange}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mileage Range</p>
                <p className="font-semibold">{mileageRange}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warranty</p>
                <p className="font-semibold">90 Days - Full Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
