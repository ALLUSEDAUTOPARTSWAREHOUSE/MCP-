import { redirect } from 'next/navigation'
import { ACURA_MODEL_HISTORY } from '@/lib/acura-model-history'

export async function GET(_: any, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Old Acura model guides (/acura/mdx) → the Acura catalog filtered to that model.
  const modelEntry = Object.prototype.hasOwnProperty.call(ACURA_MODEL_HISTORY, slug)
    ? ACURA_MODEL_HISTORY[slug as keyof typeof ACURA_MODEL_HISTORY]
    : undefined
  if (modelEntry) {
    redirect(`/brands/acura?model=${encodeURIComponent(modelEntry.model)}`)
  }
  // Old Acura URL /acura/[slug] → /brands/acura/[slug]
  redirect(`/brands/acura/${encodeURIComponent(slug)}`)
}
