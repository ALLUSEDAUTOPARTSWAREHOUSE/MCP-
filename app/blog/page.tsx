import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BrandLogosSection } from "@/components/brand-logos"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Blog | AUAPW LLC - Auto Parts Tips & Articles",
  description: "Read our latest articles about used auto parts, maintenance tips, and automotive industry news.",
}

export default function BlogPage() {
  const posts = [
    {
      slug: "what-to-know-about-used-engines",
      title: "What to Know About Used Engines",
      excerpt: "Understanding what to look for when purchasing a used engine, including mileage, warranty, and testing procedures.",
      date: "March 15, 2026",
      category: "Engines",
    },
    {
      slug: "transmission-repair-vs-replacement",
      title: "Transmission Repair vs. Replacement: Making the Right Choice",
      excerpt: "Learn when to repair your transmission and when replacement is the better option for your budget and vehicle.",
      date: "March 10, 2026",
      category: "Transmissions",
    },
    {
      slug: "extending-engine-life",
      title: "How to Extend Your Engine's Lifespan",
      excerpt: "Maintenance tips and best practices to keep your engine running strong for years to come.",
      date: "March 5, 2026",
      category: "Maintenance",
    },
    {
      slug: "benefits-of-used-parts",
      title: "The Benefits of Buying Used Auto Parts",
      excerpt: "Why choosing quality used parts can save you money without compromising on reliability and performance.",
      date: "February 28, 2026",
      category: "Parts",
    },
    {
      slug: "understanding-warranties",
      title: "Understanding Auto Part Warranties",
      excerpt: "A comprehensive guide to what auto part warranties cover and how to make the most of your protection.",
      date: "February 20, 2026",
      category: "Warranties",
    },
    {
      slug: "eco-friendly-auto-recycling",
      title: "Why Auto Recycling is Good for the Environment",
      excerpt: "Discover how choosing recycled parts contributes to environmental sustainability and reduces waste.",
      date: "February 15, 2026",
      category: "Sustainability",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">Latest Articles</h1>
              <p className="text-muted-foreground text-lg">Stay informed with tips, guides, and news about used auto parts and automotive maintenance.</p>
            </div>
          </div>

          <div className="grid gap-6 mb-16">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass-card p-6 rounded-lg hover:bg-secondary/50 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-secondary/40 border border-border/50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">Get the latest auto parts tips, industry news, and exclusive offers delivered to your inbox.</p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
