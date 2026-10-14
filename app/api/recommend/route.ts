import { generateText } from "ai"
import { recommendParts } from "@/lib/ai-catalog"
import { getAcuraProductById } from "@/lib/acura-data"

export const maxDuration = 30

export async function POST(req: Request) {
  const { productId } = (await req.json()) as { productId?: string }

  if (!productId) {
    return Response.json({ error: "Missing productId" }, { status: 400 })
  }

  const base = getAcuraProductById(productId)
  const parts = recommendParts(productId, 4)

  if (!base || parts.length === 0) {
    return Response.json({ pitch: "", parts })
  }

  // Ask the model for a short, helpful sentence explaining why these parts
  // pair well with the product the shopper is viewing.
  let pitch = ""
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system:
        "You are a used auto parts advisor. In ONE short, friendly sentence (max 25 words), explain why the recommended parts pair well with the part the customer is viewing. Do not list prices. Do not use markdown.",
      prompt: `Customer is viewing: "${base.name}" (${base.category}).
Recommended parts: ${parts.map((p) => `${p.name} (${p.category})`).join("; ")}.
Write the one-sentence recommendation.`,
    })
    pitch = text.trim()
  } catch {
    pitch = "Frequently bought together to complete your repair."
  }

  return Response.json({ pitch, parts })
}
