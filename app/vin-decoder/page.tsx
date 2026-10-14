import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VinDecoder } from '@/components/vin-decoder'

export const metadata = {
  title: 'VIN Decoder | AUAPW - Find Your Vehicle',
  description: 'Decode your VIN to find compatible OEM used auto parts for your vehicle',
}

export default function VinDecoderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-4">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Vehicle</h1>
            <p className="text-lg text-foreground/70 mb-2">
              Use our VIN decoder to instantly identify your vehicle and find compatible parts
            </p>
            <p className="text-foreground/60">
              Don't have your VIN? Find it on the driver's door jamb or your insurance card
            </p>
          </div>

          {/* VIN Decoder Component */}
          <div className="rounded-lg border border-border bg-card p-8 mb-12">
            <VinDecoder />
          </div>

          {/* How It Works */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mb-4 text-4xl">1️⃣</div>
                <h3 className="font-semibold text-foreground mb-2">Enter Your VIN</h3>
                <p className="text-foreground/60 text-sm">
                  Paste your 17-character VIN into the decoder
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 text-4xl">2️⃣</div>
                <h3 className="font-semibold text-foreground mb-2">Get Details</h3>
                <p className="text-foreground/60 text-sm">
                  We decode your VIN to identify year, make, model, and more
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 text-4xl">3️⃣</div>
                <h3 className="font-semibold text-foreground mb-2">Find Parts</h3>
                <p className="text-foreground/60 text-sm">
                  Browse compatible OEM used parts for your exact vehicle
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <details className="rounded-lg border border-border bg-card p-6 cursor-pointer">
                <summary className="font-semibold text-foreground hover:text-primary transition-colors">
                  Where do I find my VIN?
                </summary>
                <p className="mt-4 text-foreground/60">
                  Your VIN can be found in several places: on the driver's side door jamb, on your vehicle registration, or on your insurance card. It's a 17-character code that uniquely identifies your vehicle.
                </p>
              </details>

              <details className="rounded-lg border border-border bg-card p-6 cursor-pointer">
                <summary className="font-semibold text-foreground hover:text-primary transition-colors">
                  What information does the VIN reveal?
                </summary>
                <p className="mt-4 text-foreground/60">
                  The VIN reveals your vehicle's year, make, model, manufacturing plant, engine type, transmission, and more. This helps us identify exactly which parts are compatible with your vehicle.
                </p>
              </details>

              <details className="rounded-lg border border-border bg-card p-6 cursor-pointer">
                <summary className="font-semibold text-foreground hover:text-primary transition-colors">
                  Is the VIN decoder free to use?
                </summary>
                <p className="mt-4 text-foreground/60">
                  Yes, our VIN decoder is completely free. Use it as many times as you need to find the perfect parts for your vehicles.
                </p>
              </details>

              <details className="rounded-lg border border-border bg-card p-6 cursor-pointer">
                <summary className="font-semibold text-foreground hover:text-primary transition-colors">
                  Can I save my vehicle for later?
                </summary>
                <p className="mt-4 text-foreground/60">
                  Yes! Sign in to your account to save multiple vehicles and easily find compatible parts anytime.
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
