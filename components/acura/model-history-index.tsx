import Link from 'next/link'
import { ArrowRight, CheckCircle2, ClipboardCheck, Gauge, ShieldCheck, Wrench } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getAcuraProductUrl, type AcuraProduct } from '@/lib/acura-data'
import {
  ACURA_MODEL_DIRECTORY,
  ACURA_MODEL_HISTORY,
  type AcuraModelSlug,
} from '@/lib/acura-model-history'

const objections = [
  {
    question: 'Why buy used OEM instead of new aftermarket?',
    answer: 'A used OEM assembly began life engineered for an Acura application. With the exact interchange verified, it can preserve factory mounting, connections, and driving character without forcing you into a generic substitute.',
  },
  {
    question: 'Is mileage the only number that matters?',
    answer: 'No. Correct fitment, donor condition, included components, service history when available, and professional inspection all matter. Choose the right assembly first, then compare mileage and coverage.',
  },
  {
    question: 'How can I be confident it will fit?',
    answer: 'Send the VIN and ask your mechanic to confirm the engine or transmission code, drivetrain, emissions specification, production date, connectors, mounts, and accessories before installation.',
  },
  {
    question: 'What about installation risk?',
    answer: 'Control it with preparation: use a qualified installer, compare assemblies before transfer, replace accessible service items, follow the correct fluid and programming procedures, and document the startup and recheck.',
  },
]

function uniqueProducts(products: AcuraProduct[]) {
  const byUrl = new Map<string, AcuraProduct>()
  for (const product of products) byUrl.set(getAcuraProductUrl(product), product)
  return [...byUrl.values()]
}

export function AcuraModelHistoryIndex({
  modelSlug,
  products,
}: {
  modelSlug: AcuraModelSlug
  products: AcuraProduct[]
}) {
  const profile = ACURA_MODEL_HISTORY[modelSlug]
  const indexedProducts = uniqueProducts(products)
  const groups = Object.entries(
    indexedProducts.reduce<Record<string, AcuraProduct[]>>((result, product) => {
      const category = product.category || 'Used Acura Part'
      result[category] = [...(result[category] ?? []), product]
      return result
    }, {}),
  ).sort(([a], [b]) => a.localeCompare(b))

  return (
    <section id="used-parts-guide" className="bg-history-panel py-16 sm:py-24" aria-labelledby="history-title">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <header className="flex max-w-4xl flex-col gap-5">
          <Badge variant="secondary" className="w-fit">Buyer&apos;s guide · {profile.yearRange}</Badge>
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">Acura model history and parts index</p>
            <h2 id="history-title" className="max-w-3xl text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Keep your Acura {profile.model} on the road—not on the replacement lot.
            </h2>
            <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Learn the {profile.model}&apos;s history, answer the biggest used-part concerns, prepare your mechanic, and browse every indexed {profile.model} part URL in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#parts-index">Browse {indexedProducts.length} indexed parts <ArrowRight data-icon="inline-end" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/acura">All Acura parts</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit">{profile.vehicleType}</Badge>
              <CardTitle className="font-serif text-3xl">The Acura {profile.model} story</CardTitle>
              <CardDescription>{profile.yearRange}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
              {profile.history.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="font-semibold text-foreground">{profile.ownershipContext}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Gauge />
              <CardTitle>Repair the vehicle you already know</CardTitle>
              <CardDescription>A replacement vehicle brings another purchase price, unknown history, taxes, and setup costs.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
              <p>A verified used OEM assembly lets you invest in the Acura whose condition, maintenance, and features you already understand.</p>
              <p>Start with fitment, condition, coverage, and installer approval. Then choose confidently from the live inventory below.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">Straight answers</p>
            <h2 className="text-balance font-serif text-3xl font-bold sm:text-4xl">Used Acura parts objections, answered</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {objections.map((item) => (
              <Card key={item.question}>
                <CardHeader>
                  <ShieldCheck />
                  <CardTitle>{item.question}</CardTitle>
                </CardHeader>
                <CardContent><p className="leading-relaxed text-muted-foreground">{item.answer}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">Mechanic-ready order</p>
            <h2 className="text-balance font-serif text-3xl font-bold">Give your installer the right information before the part arrives.</h2>
            <p className="leading-relaxed text-muted-foreground">The best sale is the correct sale. Use this checklist with your repair shop before checkout and again before installation.</p>
            <Alert>
              <ClipboardCheck />
              <AlertTitle>Fitment comes before checkout</AlertTitle>
              <AlertDescription>Inventory descriptions support your search; final interchange should be confirmed against the vehicle VIN and component codes by a qualified mechanic.</AlertDescription>
            </Alert>
          </div>
          <Card>
            <CardHeader>
              <Wrench />
              <CardTitle>Acura {profile.model} mechanic checklist</CardTitle>
              <CardDescription>Save this list for your estimate and installation appointment.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-4">
                {profile.mechanicFocus.map((suggestion, index) => (
                  <li key={suggestion} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-mono text-primary">{String(index + 1).padStart(2, '0')}</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex max-w-2xl flex-col gap-3">
              <Badge className="w-fit">Shop by assembly</Badge>
              <h2 className="text-balance font-serif text-3xl font-bold">Start your Acura {profile.model} repair</h2>
              <p className="leading-relaxed text-muted-foreground">Compare the exact listings, then call your mechanic with the VIN and candidate part details.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href="/used-engines-parts">Used Acura engines <ArrowRight data-icon="inline-end" /></Link></Button>
              <Button asChild variant="outline"><Link href="/used-transmissions-parts">Used Acura transmissions</Link></Button>
            </div>
          </div>
        </div>

        <div id="parts-index" className="scroll-mt-24 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">Canonical Acura parts URLs</p>
            <h2 className="text-balance font-serif text-3xl font-bold sm:text-4xl">Acura {profile.model} parts index</h2>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">Every unique {profile.model} listing currently indexed from the Acura inventory sheet. Open a listing for exact pricing, mileage tiers when supplied, warranty, shipping, and compatibility details.</p>
          </div>

          {groups.length > 0 ? (
            <div className="flex flex-col gap-10">
              {groups.map(([category, categoryProducts]) => (
                <section key={category} className="flex flex-col gap-4" aria-labelledby={`${modelSlug}-${category.replace(/\W+/g, '-').toLowerCase()}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 id={`${modelSlug}-${category.replace(/\W+/g, '-').toLowerCase()}`} className="text-xl font-bold">{category}</h3>
                    <Badge variant="outline">{categoryProducts.length} listings</Badge>
                  </div>
                  <Separator />
                  <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <li key={getAcuraProductUrl(product)}>
                        <Link className="group flex items-start gap-2 text-sm leading-relaxed text-muted-foreground hover:text-primary" href={getAcuraProductUrl(product)}>
                          <CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden="true" />
                          <span className="underline-offset-4 group-hover:underline">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <Alert>
              <ShieldCheck />
              <AlertTitle>Inventory updates regularly</AlertTitle>
              <AlertDescription>No indexed {profile.model} listing is available right now. Browse all Acura inventory or contact us with your VIN.</AlertDescription>
            </Alert>
          )}
        </div>

        <nav className="flex flex-col gap-6" aria-labelledby="acura-model-directory">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-widest text-primary">Index backlinks</p>
            <h2 id="acura-model-directory" className="font-serif text-3xl font-bold">Browse used parts by Acura model</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ACURA_MODEL_DIRECTORY.map((item) => (
              <Button key={item.slug} asChild variant={item.slug === modelSlug ? 'secondary' : 'outline'} className="justify-between">
                <Link href={item.href}>{item.label} parts <ArrowRight data-icon="inline-end" /></Link>
              </Button>
            ))}
            <Button asChild variant="outline" className="justify-between">
              <Link href="/acura">Complete Acura index <ArrowRight data-icon="inline-end" /></Link>
            </Button>
          </div>
        </nav>
      </div>
    </section>
  )
}
