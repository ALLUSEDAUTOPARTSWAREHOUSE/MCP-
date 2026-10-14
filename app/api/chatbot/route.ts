import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Website content index with URLs and metadata
const WEBSITE_CONTENT_INDEX = {
  products: [
    {
      title: "Used Engines",
      description: "Quality used engines for various vehicle models",
      url: "/parts/engines",
      keywords: ["engine", "motor", "v6", "v8"],
      type: "category" as const,
    },
    {
      title: "Transmissions",
      description: "Automatic and manual transmissions in stock",
      url: "/parts/transmissions",
      keywords: ["transmission", "gearbox", "automatic", "manual"],
      type: "category" as const,
    },
    {
      title: "Body Parts",
      description: "Doors, fenders, hoods, and other body components",
      url: "/parts/body",
      keywords: ["body", "door", "fender", "hood", "bumper"],
      type: "category" as const,
    },
    {
      title: "Brakes",
      description: "Brake systems, rotors, pads, and components",
      url: "/parts/brakes",
      keywords: ["brake", "rotor", "pad", "caliper"],
      type: "category" as const,
    },
    {
      title: "Suspension",
      description: "Suspension parts including struts and control arms",
      url: "/parts/suspension",
      keywords: ["suspension", "strut", "shock", "spring", "control arm"],
      type: "category" as const,
    },
    {
      title: "Electrical Parts",
      description: "Alternators, starters, batteries, and wiring",
      url: "/parts/electrical",
      keywords: ["electrical", "alternator", "starter", "battery"],
      type: "category" as const,
    },
    {
      title: "Drivetrain",
      description: "Differentials, axles, and transfer cases",
      url: "/parts/drivetrain",
      keywords: ["drivetrain", "differential", "axle", "transfer case"],
      type: "category" as const,
    },
    {
      title: "Cooling System",
      description: "Radiators, water pumps, and cooling components",
      url: "/parts/cooling",
      keywords: ["cooling", "radiator", "water pump", "thermostat"],
      type: "category" as const,
    },
    {
      title: "Exhaust System",
      description: "Exhaust manifolds, catalytic converters, and mufflers",
      url: "/parts/exhaust",
      keywords: ["exhaust", "manifold", "catalytic converter", "muffler"],
      type: "category" as const,
    },
  ],
  brands: [
    {
      title: "Acura Parts",
      description: "OEM and used parts for Acura vehicles",
      url: "/brands/acura",
      keywords: ["acura", "tsx", "tl", "cl", "mdx", "rdx"],
      type: "category" as const,
    },
  ],
  pages: [
    {
      title: "Shop All Parts",
      description: "Browse our complete parts catalog",
      url: "/shop",
      keywords: ["shop", "browse", "catalog", "parts", "inventory"],
      type: "page" as const,
    },
    {
      title: "Smart Search",
      description: "AI-powered parts search",
      url: "/search",
      keywords: ["search", "find", "find parts", "smart search"],
      type: "page" as const,
    },
    {
      title: "About Us",
      description: "Learn about AUAPW LLC and our mission",
      url: "/about",
      keywords: ["about", "company", "mission", "who we are"],
      type: "page" as const,
    },
    {
      title: "Contact",
      description: "Get in touch with our customer service team",
      url: "/contact",
      keywords: ["contact", "support", "help", "email", "phone"],
      type: "page" as const,
    },
    {
      title: "FAQ & Shipping Policy",
      description: "Shipping info, warranty, and returns",
      url: "/shipping-policy",
      keywords: ["shipping", "warranty", "returns", "faq", "90 day"],
      type: "page" as const,
    },
    {
      title: "Privacy Policy",
      description: "Our privacy and data protection policies",
      url: "/privacy-policy",
      keywords: ["privacy", "policy", "terms", "data"],
      type: "page" as const,
    },
  ],
  faqs: [
    {
      question: "What is the warranty?",
      answer: "All parts come with a 90-day warranty covering defects",
      url: "/shipping-policy",
      keywords: ["warranty", "guarantee", "covered", "90 day"],
    },
    {
      question: "How much does shipping cost?",
      answer: "Flat rate shipping of $240 per part",
      url: "/shipping-policy",
      keywords: ["shipping", "cost", "delivery", "flat rate", "$240"],
    },
    {
      question: "Do you have used parts?",
      answer: "Yes, we specialize in quality used auto parts",
      url: "/about",
      keywords: ["used", "quality", "salvage", "reconditioned"],
    },
    {
      question: "What brands do you carry?",
      answer: "We primarily focus on Acura parts and other major brands",
      url: "/brands",
      keywords: ["brands", "acura", "makes", "models"],
    },
  ],
}

// Search content index for relevant results
function searchContent(query: string) {
  const lowerQuery = query.toLowerCase()
  const results = []

  // Search products/categories
  for (const product of WEBSITE_CONTENT_INDEX.products) {
    if (
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.keywords.some((k) => lowerQuery.includes(k))
    ) {
      results.push({
        title: product.title,
        description: product.description,
        url: product.url,
        type: product.type,
        relevance: product.keywords.filter((k) => lowerQuery.includes(k)).length,
      })
    }
  }

  // Search brands
  for (const brand of WEBSITE_CONTENT_INDEX.brands) {
    if (
      brand.title.toLowerCase().includes(lowerQuery) ||
      brand.keywords.some((k) => lowerQuery.includes(k))
    ) {
      results.push({
        title: brand.title,
        description: brand.description,
        url: brand.url,
        type: brand.type,
        relevance: brand.keywords.filter((k) => lowerQuery.includes(k)).length,
      })
    }
  }

  // Search pages
  for (const page of WEBSITE_CONTENT_INDEX.pages) {
    if (
      page.title.toLowerCase().includes(lowerQuery) ||
      page.keywords.some((k) => lowerQuery.includes(k))
    ) {
      results.push({
        title: page.title,
        description: page.description,
        url: page.url,
        type: page.type,
        relevance: page.keywords.filter((k) => lowerQuery.includes(k)).length,
      })
    }
  }

  // Search FAQs
  for (const faq of WEBSITE_CONTENT_INDEX.faqs) {
    if (
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery) ||
      faq.keywords.some((k) => lowerQuery.includes(k))
    ) {
      results.push({
        title: faq.question,
        description: faq.answer,
        url: faq.url,
        type: "page" as const,
        relevance: faq.keywords.filter((k) => lowerQuery.includes(k)).length,
      })
    }
  }

  // Sort by relevance and return top 4
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 4)
}

const SYSTEM_PROMPT = `You are the AUAPW Chatbot, a friendly and helpful assistant for AUAPW LLC, a trusted source for quality used auto parts.

Your responsibilities:
- Answer questions about AUAPW products and services
- Help customers find the right parts for their vehicles
- Provide information about shipping, warranty, and company policies
- Direct customers to relevant pages and products on the website

Important guidelines:
- Be concise and friendly
- Always include relevant website links in your responses
- Use the searchWebsite tool to find relevant pages and products
- When customers ask about specific parts, direct them to appropriate categories
- Mention our 90-day warranty and $240 flat-rate shipping when relevant
- If you can't answer something, suggest they contact us or visit relevant pages

Guidelines for responses:
- Keep responses under 150 words
- Use friendly, conversational tone
- Always provide helpful links with answers`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      searchWebsite: tool({
        description:
          "Search AUAPW website content for relevant pages, products, categories, and answers to customer questions. Use this to find links and information to include in your responses.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "Search query to find relevant website content, products, or answers"
            ),
        }),
        execute: async ({ query }) => {
          const results = searchContent(query)
          return {
            count: results.length,
            results: results.map((r) => ({
              title: r.title,
              description: r.description,
              url: r.url,
              type: r.type,
            })),
          }
        },
      }),
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
