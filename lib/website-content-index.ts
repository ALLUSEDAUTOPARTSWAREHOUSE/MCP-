/**
 * Website Content Index
 * Comprehensive index of all AUAPW website pages and content
 * Used by the chatbot to search and provide relevant links
 */

export interface ContentPage {
  title: string
  description: string
  url: string
  keywords: string[]
  category: "product" | "guide" | "policy" | "service" | "tool" | "category"
}

export const WEBSITE_CONTENT_INDEX: ContentPage[] = [
  // Main Pages
  {
    title: "Home",
    description: "Welcome to AUAPW LLC - Your trusted source for quality used auto parts from 2,000+ verified salvage yards",
    url: "/",
    keywords: ["home", "welcome", "used parts", "salvage"],
    category: "service",
  },
  
  // Shop & Products
  {
    title: "Shop All Parts",
    description: "Browse our complete inventory of used auto parts across all categories",
    url: "/shop",
    keywords: ["shop", "browse", "inventory", "parts", "buy"],
    category: "product",
  },
  {
    title: "Catalog",
    description: "Complete AUAPW parts catalog with all available inventory",
    url: "/catalog",
    keywords: ["catalog", "inventory", "list", "all parts"],
    category: "product",
  },
  {
    title: "Acura Parts",
    description: "Browse quality used Acura parts from our extensive inventory",
    url: "/acura-parts",
    keywords: ["acura", "parts", "acura parts"],
    category: "product",
  },

  // Categories
  {
    title: "All Parts Categories",
    description: "Browse parts by category - Engines, Transmissions, Body, Brakes, and more",
    url: "/parts",
    keywords: ["categories", "parts", "browse"],
    category: "category",
  },
  {
    title: "Engines",
    description: "Used engines for various makes and models - fully tested and warranted",
    url: "/parts/engines",
    keywords: ["engines", "motor", "engine parts"],
    category: "category",
  },
  {
    title: "Transmissions",
    description: "Quality used transmissions with 90-day warranty and flat-rate shipping",
    url: "/parts/transmissions",
    keywords: ["transmissions", "gearbox", "automatic", "manual"],
    category: "category",
  },
  {
    title: "Body Parts",
    description: "Used body parts including doors, fenders, hoods, and more",
    url: "/parts/body",
    keywords: ["body", "doors", "fenders", "hood", "bumper"],
    category: "category",
  },
  {
    title: "Brakes",
    description: "Used brake components - rotors, pads, calipers, and brake systems",
    url: "/parts/brakes",
    keywords: ["brakes", "brake pads", "rotors", "calipers"],
    category: "category",
  },
  {
    title: "Cooling System",
    description: "Used cooling system parts - radiators, fans, water pumps, and more",
    url: "/parts/cooling",
    keywords: ["cooling", "radiator", "fan", "water pump", "thermostat"],
    category: "category",
  },
  {
    title: "Drivetrain",
    description: "Used drivetrain parts - axles, differentials, transfer cases",
    url: "/parts/drivetrain",
    keywords: ["drivetrain", "axles", "differential", "transfer case"],
    category: "category",
  },
  {
    title: "Electrical",
    description: "Used electrical components - alternators, starters, batteries",
    url: "/parts/electrical",
    keywords: ["electrical", "alternator", "starter", "battery", "electronics"],
    category: "category",
  },
  {
    title: "Exhaust",
    description: "Used exhaust system parts - mufflers, catalytic converters, pipes",
    url: "/parts/exhaust",
    keywords: ["exhaust", "muffler", "catalytic converter", "pipes"],
    category: "category",
  },
  {
    title: "Suspension",
    description: "Used suspension parts - shocks, struts, springs, control arms",
    url: "/parts/suspension",
    keywords: ["suspension", "shocks", "struts", "springs", "control arms"],
    category: "category",
  },

  // Used Parts Collections
  {
    title: "Used Engines",
    description: "Complete collection of used engines from various vehicle makes",
    url: "/used-engines",
    keywords: ["used engines", "engine inventory"],
    category: "product",
  },
  {
    title: "Used Transmissions",
    description: "Large selection of used transmissions - automatic and manual",
    url: "/used-transmissions",
    keywords: ["used transmissions"],
    category: "product",
  },
  {
    title: "Used Body Parts",
    description: "Used body parts collection - doors, panels, trim, and more",
    url: "/used-body-parts",
    keywords: ["used body parts"],
    category: "product",
  },
  {
    title: "Used Brakes",
    description: "Used brake system parts and components",
    url: "/used-brakes-parts",
    keywords: ["used brakes"],
    category: "product",
  },
  {
    title: "Used Cooling Parts",
    description: "Used cooling system parts",
    url: "/used-cooling-parts",
    keywords: ["used cooling"],
    category: "product",
  },
  {
    title: "Used Drivetrain",
    description: "Used drivetrain parts",
    url: "/used-drivetrain-parts",
    keywords: ["used drivetrain"],
    category: "product",
  },
  {
    title: "Used Electrical",
    description: "Used electrical system parts",
    url: "/used-electrical-parts",
    keywords: ["used electrical"],
    category: "product",
  },
  {
    title: "Used Exhaust",
    description: "Used exhaust system parts",
    url: "/used-exhaust-parts",
    keywords: ["used exhaust"],
    category: "product",
  },
  {
    title: "Used Suspension",
    description: "Used suspension system parts",
    url: "/used-suspension-parts",
    keywords: ["used suspension"],
    category: "product",
  },

  // Brands
  {
    title: "All Brands",
    description: "Browse parts by vehicle brand - Acura, Honda, Toyota, Ford, Chevrolet and more",
    url: "/brands",
    keywords: ["brands", "makes", "manufacturers"],
    category: "category",
  },
  {
    title: "Acura Parts & Models",
    description: "Browse all Acura vehicle models and their available parts",
    url: "/makes",
    keywords: ["acura", "makes"],
    category: "category",
  },
  {
    title: "Vehicle Makes",
    description: "Search parts by vehicle make and model",
    url: "/makes",
    keywords: ["makes", "models", "vehicles"],
    category: "category",
  },

  // Shopping Features
  {
    title: "Shopping Cart",
    description: "View and manage your shopping cart",
    url: "/cart",
    keywords: ["cart", "checkout", "shopping"],
    category: "service",
  },
  {
    title: "Checkout",
    description: "Complete your purchase and proceed to payment",
    url: "/checkout",
    keywords: ["checkout", "payment", "order"],
    category: "service",
  },
  {
    title: "Search Parts",
    description: "Smart search tool to find the right parts for your vehicle",
    url: "/search",
    keywords: ["search", "find parts", "smart search"],
    category: "tool",
  },
  {
    title: "AI-Powered Search",
    description: "Advanced AI search to help you find exactly what you need",
    url: "/ai-search",
    keywords: ["ai search", "artificial intelligence", "advanced search"],
    category: "tool",
  },
  {
    title: "Parts Comparison",
    description: "Compare different parts side-by-side to make better decisions",
    url: "/comparison",
    keywords: ["compare", "comparison", "side-by-side"],
    category: "tool",
  },

  // Services
  {
    title: "Get a Quote",
    description: "Request a custom quote for parts or services",
    url: "/quote",
    keywords: ["quote", "estimate", "pricing"],
    category: "service",
  },
  {
    title: "Contact Us",
    description: "Get in touch with our customer service team",
    url: "/contact",
    keywords: ["contact", "support", "help", "customer service"],
    category: "service",
  },

  // Policies & Information
  {
    title: "About AUAPW",
    description: "Learn about AUAPW LLC - our mission, values, and commitment to quality used auto parts sourcing",
    url: "/about",
    keywords: ["about", "company", "mission", "values", "team", "auapw"],
    category: "guide",
  },
  {
    title: "FAQ - Frequently Asked Questions",
    description: "Common questions about parts, shipping, warranty, and ordering",
    url: "/faq",
    keywords: ["faq", "questions", "help", "support", "shipping", "warranty"],
    category: "guide",
  },
  {
    title: "Shipping & Delivery",
    description: "We offer $240 flat-rate shipping per part nationwide. Fast and reliable delivery with tracking",
    url: "/shipping",
    keywords: ["shipping", "delivery", "rates", "flat-rate", "$240", "tracking", "nationwide"],
    category: "policy",
  },
  {
    title: "Warranty Information",
    description: "All AUAPW parts come with a 90-day warranty covering defects and failures",
    url: "/warranty",
    keywords: ["warranty", "90-day", "guarantee", "coverage", "protection", "defect"],
    category: "policy",
  },
  {
    title: "Return Policy",
    description: "Easy returns within 30 days. Full refund or replacement available. No restocking fees",
    url: "/returns",
    keywords: ["returns", "refund", "exchange", "30-day", "replacement", "policy"],
    category: "policy",
  },
  {
    title: "Privacy Policy",
    description: "How we protect your personal data and your privacy rights",
    url: "/privacy",
    keywords: ["privacy", "data protection", "gdpr", "personal data", "security"],
    category: "policy",
  },
  {
    title: "Terms of Service",
    description: "Terms of service and conditions of use for AUAPW LLC website and services",
    url: "/terms",
    keywords: ["terms", "conditions", "agreement", "service", "legal"],
    category: "policy",
  },
  {
    title: "Cookie Policy",
    description: "Information about cookies, tracking technologies, and analytics",
    url: "/cookies",
    keywords: ["cookies", "tracking", "analytics", "consent"],
    category: "policy",
  },
  {
    title: "Disclaimer",
    description: "Important legal disclaimers and limitations of liability",
    url: "/disclaimer",
    keywords: ["disclaimer", "legal", "limitation", "liability"],
    category: "policy",
  },
  {
    title: "Acceptable Use Policy",
    description: "Guidelines for acceptable use of AUAPW services and website",
    url: "/acceptable-use",
    keywords: ["acceptable use", "policy", "guidelines", "prohibited"],
    category: "policy",
  },

  // Account
  {
    title: "Sign In",
    description: "Sign in to your AUAPW account",
    url: "/sign-in",
    keywords: ["login", "sign in", "account"],
    category: "service",
  },
  {
    title: "Sign Up",
    description: "Create a new AUAPW account",
    url: "/sign-up",
    keywords: ["register", "sign up", "create account"],
    category: "service",
  },
  {
    title: "Dashboard",
    description: "Access your account dashboard with orders, wishlist, and settings",
    url: "/dashboard",
    keywords: ["dashboard", "account", "profile"],
    category: "service",
  },

  // Inventory & Analytics
  {
    title: "Inventory",
    description: "View our current inventory of available parts",
    url: "/inventory",
    keywords: ["inventory", "stock", "available"],
    category: "product",
  },
  {
    title: "Analytics",
    description: "View analytics and insights about our parts availability",
    url: "/analytics",
    keywords: ["analytics", "insights", "data"],
    category: "tool",
  },

  // Blog & Content
  {
    title: "Blog",
    description: "Articles and guides about auto parts and maintenance",
    url: "/blog",
    keywords: ["blog", "articles", "guides", "tips"],
    category: "guide",
  },
]

/**
 * Search the content index
 * @param query Search query string
 * @param limit Maximum number of results to return
 * @returns Array of matching content pages
 */
export function searchContentIndex(query: string, limit: number = 5): ContentPage[] {
  if (!query || query.trim().length === 0) return []

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)

  // Score each page based on keyword matches
  const scored = WEBSITE_CONTENT_INDEX.map((page) => {
    let score = 0

    // Check title matches (highest weight)
    for (const term of searchTerms) {
      if (page.title.toLowerCase().includes(term)) score += 5
    }

    // Check description matches
    for (const term of searchTerms) {
      if (page.description.toLowerCase().includes(term)) score += 3
    }

    // Check keyword matches
    for (const keyword of page.keywords) {
      for (const term of searchTerms) {
        if (keyword.toLowerCase().includes(term)) score += 2
      }
    }

    return { page, score }
  })

  // Filter pages with score > 0, sort by score descending
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ page }) => page)
}

/**
 * Get content by category
 */
export function getContentByCategory(
  category: ContentPage["category"],
  limit: number = 10
): ContentPage[] {
  return WEBSITE_CONTENT_INDEX.filter((page) => page.category === category).slice(0, limit)
}

/**
 * Get a content page by URL
 */
export function getContentByUrl(url: string): ContentPage | undefined {
  return WEBSITE_CONTENT_INDEX.find((page) => page.url === url)
}
