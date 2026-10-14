/**
 * Single source of truth for the shipping number and warranty ladder.
 * Every page, the metadata, the cart and the Merchant feed read from here so
 * the site can never again say "$240" in one place and "free" in another.
 */

export const PHONE_SALES = "708-896-2383"
export const PHONE_DISPLAY = "(708) 896-2383"
export const PHONE_HREF = "tel:+17088962383"

export const SHIPPING = {
  price: 0,
  label: "Free insured freight",
  short: "Free freight",
  allInNote: "Free insured freight included — no $99 residential surprise",
  liftgate: "Liftgate and residential delivery included",
  dispatch: "Ships in 1-2 business days",
  transit: "3-7 business days door to door in the lower 48",
  damage:
    "Every unit ships insured on a pallet. Note any damage on the delivery receipt and we replace or refund — you never file the freight claim yourself.",
} as const

export interface WarrantyStep {
  tier: string
  length: string
  summary: string
}

export const WARRANTY_LADDER: WarrantyStep[] = [
  {
    tier: "Used",
    length: "90 days",
    summary:
      "Covers the whole part, not just the internals. If it fails, we replace it or refund you — a shop diagnostic sheet is enough to open a claim.",
  },
  {
    tier: "Rebuilt",
    length: "12 months",
    summary:
      "Fully disassembled, machined and rebuilt with new gaskets, seals and wear parts. Same plain-English claim process.",
  },
  {
    tier: "Labor cover",
    length: "Paid upgrade",
    summary:
      "Add labor reimbursement to either tier so a replacement covers the shop's install time too.",
  },
]

export const WARRANTY_SUMMARY = "90-day used · 12-month rebuilt warranty"
export const USED_WARRANTY = "90 days"
export const REBUILT_WARRANTY = "12 months"

export const RETURNS = {
  window: "30-day returns",
  detail:
    "Return any unit within 30 days. No restocking fee on warranty swaps, and no core charge on used parts.",
} as const

export const TRUST_FACTS = [
  { label: "Free freight", detail: "Insured, liftgate included" },
  { label: "90-day–12-month warranty", detail: "Used 90 days · rebuilt 12 months" },
  { label: "No core charge on used", detail: "Keep your old unit" },
  { label: "Ships 1-2 days", detail: "Tested, crated, dispatched" },
  { label: "30-day returns", detail: "Plain-English conditions" },
] as const
