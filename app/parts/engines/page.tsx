import { redirect } from "next/navigation"
import { resolveMake } from "@/lib/ai-catalog"

/** Engines are priced from the brand master sheets; forward to that catalog. */
export default async function EnginesPage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string }>
}) {
  const { make } = await searchParams
  const slug = resolveMake(make)
  redirect(slug ? `/brands/${slug}?category=engine` : "/brands")
}
