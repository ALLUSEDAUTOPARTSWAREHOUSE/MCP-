import { generateObject } from "ai"
import { z } from "zod"
import { searchCatalogDetailed, getCatalogFacets } from "@/lib/ai-catalog"

export const maxDuration = 30

const { makes, categories } = getCatalogFacets()

const filterSchema = z.object({
  query: z.string().describe("Core free-text keywords describing the part"),
  make: z.string().nullable().describe(`Vehicle make if mentioned or implied by the model, one of: ${makes.join(", ")}`),
  model: z.string().nullable().describe("Vehicle model if mentioned, e.g. 'Camry', 'Silverado 1500'"),
  year: z.string().nullable().describe("Four-digit vehicle year if mentioned"),
  category: z
    .string()
    .nullable()
    .describe(`Part category if implied, one of: ${categories.join(", ")}`),
  maxPrice: z.number().nullable().describe("Maximum budget in USD if a price limit is mentioned"),
  intent: z.string().describe("One short sentence restating what the shopper is looking for"),
})

export async function POST(req: Request) {
  const body = (await req.json()) as { query?: unknown }
  // Cap what reaches the paid model; a parts search never needs more.
  const query = typeof body.query === "string" ? body.query.trim().slice(0, 300) : ""

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 })
  }

  // Use the model to translate natural language into structured search filters.
  const { object: filters } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: filterSchema,
    system: `You convert a shopper's natural-language request for a used engine or transmission into structured search filters.
Only use makes from: ${makes.join(", ")}. Only use categories from: ${categories.join(", ")}.
If the make is not stated but the model clearly identifies it (e.g. Camry → Toyota), fill in the make.
If a field is not mentioned, set it to null. Keep the "query" field to the essential part keywords.`,
    prompt: query,
  })

  const { make, hits } = searchCatalogDetailed({
    query: `${filters.query} ${query}`,
    make: filters.make ?? undefined,
    model: filters.model ?? undefined,
    year: filters.year ?? undefined,
    category: filters.category ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    limit: 24,
  })

  return Response.json({
    filters: {
      query: filters.query,
      make: make ?? filters.make,
      model: filters.model,
      year: filters.year,
      category: filters.category,
      maxPrice: filters.maxPrice,
      intent: filters.intent,
    },
    needsMake: !make,
    results: hits,
  })
}
