import { redirect } from "next/navigation"
import { resolveMake } from "@/lib/ai-catalog"

/** Transmissions are priced from the brand master sheets; forward to that catalog. */
export default async function TransmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string }>
}) {
  const { make } = await searchParams
  const slug = resolveMake(make)
  redirect(slug ? `/brands/${slug}?category=transmission` : "/brands")
}
