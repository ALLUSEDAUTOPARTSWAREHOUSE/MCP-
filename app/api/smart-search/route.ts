import { generateObject } from "ai"
import { z } from "zod"
import { searchCatalog, getCatalogFacets } from "@/lib/ai-catalog"

export const maxDuration = 30

const { models, categories } = getCatalogFacets()

const filterSchema = z.object({
  query: z.string().describe("Core free-text keywords describing the part"),
  model: z.string().nullable().describe(`Acura model if mentioned, one of: ${models.join(", ")}`),
  year: z.string().nullable().describe("Four-digit vehicle year if mentioned"),
  category: z
    .string()
    .nullable()
    .describe(`Part category if implied, one of: ${categories.join(", ")}`),
  maxPrice: z.number().nullable().describe("Maximum budget in USD if a price limit is mentioned"),
  intent: z.string().describe("One short sentence restating what the shopper is looking for"),
})

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query?: string }

  if (!query || !query.trim()) {
    return Response.json({ error: "Missing query" }, { status: 400 })
  }

  // Use the model to translate natural language into structured search filters.
  const { object: filters } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: filterSchema,
    system: `You convert a shopper's natural-language request for used Acura auto parts into structured search filters.
Only use models from: ${models.join(", ")}. Only use categories from: ${categories.join(", ")}.
If a field is not mentioned, set it to null. Keep the "query" field to the essential part keywords.`,
    prompt: query,
  })

  const results = searchCatalog({
    query: filters.query,
    model: filters.model ?? undefined,
    year: filters.year ?? undefined,
    category: filters.category ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    limit: 24,
  })

  return Response.json({
    filters: {
      query: filters.query,
      model: filters.model,
      year: filters.year,
      category: filters.category,
      maxPrice: filters.maxPrice,
      intent: filters.intent,
    },
    results,
  })
}
