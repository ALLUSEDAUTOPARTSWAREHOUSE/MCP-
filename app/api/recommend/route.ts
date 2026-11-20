import { generateText } from "ai"
import { SeverityNumber } from "@opentelemetry/api-logs"
import { after } from "next/server"
import { flushPostHogAiTelemetry, flushPostHogLogs, posthogLogsLogger } from "@/instrumentation"
import { getCatalogHitById, recommendParts } from "@/lib/ai-catalog"

export const maxDuration = 30

export async function POST(req: Request) {
  const { productId } = (await req.json()) as { productId?: string }

  if (!productId) {
    return Response.json({ error: "Missing productId" }, { status: 400 })
  }

  const base = getCatalogHitById(productId)
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
      runtimeContext: {
        sessionId: `process-${process.pid}`,
        traceName: "part_recommendation",
      },
      telemetry: {
        isEnabled: true,
        functionId: "part_recommendation",
        recordInputs: true,
        recordOutputs: true,
        includeRuntimeContext: {
          sessionId: true,
          traceName: true,
        },
      },
    })
    pitch = text.trim()
    posthogLogsLogger?.emit({
      body: "part_recommendation_generated",
      severityNumber: SeverityNumber.INFO,
      attributes: {
        endpoint: "/api/recommend",
        recommendation_count: parts.length,
        product_category: base.category,
      },
    })
  } catch {
    pitch = "Frequently bought together to complete your repair."
  } finally {
    after(flushPostHogAiTelemetry)
    after(flushPostHogLogs)
  }

  return Response.json({ pitch, parts })
}
