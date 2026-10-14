import { BadgeCheck, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { REBUILT_WARRANTY, USED_WARRANTY } from "@/lib/site-policy"

/** Infers the warranty tier shown to shoppers from the listing title: rebuilt /
 * remanufactured units use REBUILT_WARRANTY, everything else (the vast
 * majority — used OEM replacement parts) uses USED_WARRANTY. */
function getWarrantyLength(productName: string): string {
  return /\b(rebuilt|remanufactured|reman)\b/i.test(productName) ? REBUILT_WARRANTY : USED_WARRANTY
}

interface TrustBadgesProps {
  productName: string
  /** True when the photo shown is a genuine photo of this exact SKU (not a
   * generated/representative illustration). Only ever renders a positive
   * badge — we never tell shoppers a photo is NOT real. */
  isVerifiedPhoto: boolean
  className?: string
  size?: "sm" | "md"
}

export function TrustBadges({ productName, isVerifiedPhoto, className, size = "md" }: TrustBadgesProps) {
  const warrantyLength = getWarrantyLength(productName)
  const textSize = size === "sm" ? "text-[11px]" : "text-xs"
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-400",
          textSize,
        )}
      >
        <ShieldCheck className={iconSize} aria-hidden="true" />
        {warrantyLength} Warranty
      </span>
      {isVerifiedPhoto && (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary",
            textSize,
          )}
        >
          <BadgeCheck className={iconSize} aria-hidden="true" />
          Verified Photo
        </span>
      )}
    </div>
  )
}
