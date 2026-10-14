'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CheckoutTermsProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/**
 * Sale terms cloned from our invoice's "Notes / Terms" section (warranty,
 * returns, restocking fee, shipping) so every online order is bound by the
 * same conditions a phone/invoice sale carries. The shopper must check the
 * box to agree before they can submit payment.
 */
export function CheckoutTerms({ checked, onCheckedChange }: CheckoutTermsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <span className="text-sm font-semibold">Order Terms &amp; Conditions</span>
        <ChevronDown className={`w-4 h-4 text-foreground/60 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="max-h-64 overflow-y-auto rounded-md border border-white/10 bg-background/40 p-4 text-xs leading-relaxed text-foreground/70 space-y-3">
          <section>
            <h3 className="text-foreground/90 font-semibold mb-1">Payment Authorization</h3>
            <p>
              By placing this order you authorize AUAPW LLC to charge the card or payment method you provide for the
              total amount shown, once fitment and availability are confirmed.
            </p>
          </section>

          <section>
            <h3 className="text-foreground/90 font-semibold mb-1">Shipping Time Frame</h3>
            <p>
              Standard shipping time frame is 7–14 business days. Orders are processed after full payment is
              received, and items leave our facilities after the part is inspected. Tracking information is sent by
              email 24–48 hours after your item ships.
            </p>
          </section>

          <section>
            <h3 className="text-foreground/90 font-semibold mb-1">Parts Warranty</h3>
            <p>
              Parts carry a limited parts warranty as stated on your invoice (no labor warranty unless purchased
              separately). All parts must be installed within 10 business days of delivery, or the warranty is
              voided. Any defective or incorrect part must be returned within 10 business days of delivery, or the
              warranty will be voided. The warranty is voided if the part is not returned in the same condition it
              was sent in; we do not cover return or initial shipping, and the transaction fee is non-refundable.
            </p>
            <p className="mt-2">
              <span className="font-medium text-foreground/80">Engine warranties</span> are limited to manufacturing
              defects in the block, heads, pistons, crankshafts, camshafts, rockers and oil pumps.
              <span className="font-medium text-foreground/80"> Transmission warranties</span> are limited to the
              transmission case, pan, tailshaft/housing, valve body (when required) and internal lubricated parts.
              Attached accessories — switches, sensors, cables, electronics, belts, hoses, water pumps, manifolds,
              and similar items — are not covered under either warranty, even when included with the part. Timing
              belts, thermostats, spark plugs, fluids and seals are routine-maintenance items that must be replaced
              at installation and are not covered.
            </p>
            <p className="mt-2">
              A repair estimate and prior approval from AAPS/AUAPW, proof of maintenance, and an itemized installer
              invoice are required to validate any warranty claim. This warranty applies only to the original
              purchaser for private, non-commercial use in the vehicle the part was installed in, and is not
              transferable.
            </p>
          </section>

          <section>
            <h3 className="text-foreground/90 font-semibold mb-1">Returns, Refunds &amp; Restocking Fee</h3>
            <p>
              You have 30 days from delivery to return a part for a refund; the original sales receipt/invoice must
              accompany the return. Refunds are issued after the returned part is received and inspected; original
              shipping charges are deducted from the refund amount except for parts received damaged or shipped
              incorrectly.
            </p>
            <p className="mt-2">
              Orders cancelled after being placed and processed are subject to a 25% handling &amp; restocking fee.
              Orders cancelled after shipping are subject to the 25% fee plus all shipping charges. Incorrectly
              ordered parts accepted as a return are also subject to the 25% restocking fee.
            </p>
          </section>

          <section>
            <h3 className="text-foreground/90 font-semibold mb-1">Fitment &amp; Buyer Responsibility</h3>
            <p>
              It is the buyer&apos;s responsibility to provide accurate vehicle information (year, make, model, trim
              and/or VIN). The year/make/model printed on your order is within a range of interchangeability and may
              not be the exact match for your vehicle or part. AUAPW is not responsible for labor costs, installation
              damage, or injury arising from installation of parts purchased.
            </p>
          </section>

          <p className="text-foreground/50">
            This is a summary of the full sale terms. See our{' '}
            <Link href="/terms" target="_blank" className="underline hover:text-foreground">
              Terms &amp; Conditions
            </Link>
            ,{' '}
            <Link href="/return-policy" target="_blank" className="underline hover:text-foreground">
              Return Policy
            </Link>{' '}
            and{' '}
            <Link href="/shipping-policy" target="_blank" className="underline hover:text-foreground">
              Shipping Policy
            </Link>{' '}
            for complete terms, which govern if anything here conflicts.
          </p>
        </div>
      )}

      <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-background/40 accent-blue-600"
          required
        />
        <span className="text-foreground/80">
          I have read and agree to the{' '}
          <button type="button" onClick={() => setExpanded(true)} className="underline hover:text-foreground">
            order terms
          </button>
          , including the parts warranty, 30-day return policy and 25% restocking fee on cancelled orders.
        </span>
      </label>
    </div>
  )
}
