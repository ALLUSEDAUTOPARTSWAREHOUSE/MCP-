import { redirect } from 'next/navigation'

export function GET(_: any, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string }
  // Old Acura URL /acura/[slug] → /brands/acura/[slug]
  redirect(`/brands/acura/${slug}`)
}
