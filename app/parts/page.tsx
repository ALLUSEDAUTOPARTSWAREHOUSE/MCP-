import { redirect } from "next/navigation"
import { resolveMake } from "@/lib/ai-catalog"

/**
 * /parts used to render a hand-written sample list with its own prices. The
 * real inventory and current pricing live in the per-make catalogs, so this
 * route forwards there (keeping the make from VIN/garage links when present).
 */
export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string; model?: string }>
}) {
  const { make, model } = await searchParams
  const slug = resolveMake(make)
  if (!slug) redirect("/brands")
  redirect(model ? `/brands/${slug}?model=${encodeURIComponent(model)}` : `/brands/${slug}`)
}
