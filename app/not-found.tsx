import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NAV_LINKS } from "@/lib/data"
import { Search, Home, ArrowRight } from "lucide-react"

export default function NotFound() {
  const quickLinks = NAV_LINKS.slice(0, 6)

  return (
    <>
      <Navbar />
      <main className="pt-[58px] min-h-[calc(100vh-58px)] flex flex-col" aria-labelledby="not-found-heading">
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-[520px]">
            {/* 404 marker */}
            <div className="font-serif text-[clamp(5rem,15vw,9rem)] font-black leading-none text-foreground/5 select-none mb-2" aria-hidden="true">
              404
            </div>

            <div className="glass-card rounded-lg px-8 py-10 -mt-6">
              <div className="metal-line mb-6" aria-hidden="true" />

              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                <Search className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>

              <h1
                id="not-found-heading"
                className="font-serif text-2xl font-bold text-foreground mb-3"
              >
                Page Not Found
              </h1>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                The page you are looking for does not exist, has been moved, or the URL is incorrect.
                Use the links below to get back on track.
              </p>

              {/* Primary actions */}
              <div className="flex gap-3 justify-center flex-wrap mb-8">
                <Link
                  href="/"
                  className="auapw-btn auapw-btn-blue inline-flex items-center gap-2 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.18em] uppercase rounded-sm"
                >
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  Go Home
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  Search Parts
                </Link>
              </div>

              {/* Quick links */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Quick Navigation
                </p>
                <nav aria-label="Quick navigation links">
                  <ul className="flex flex-col divide-y divide-border/20">
                    {quickLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between gap-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
                        >
                          <span>{link.label}</span>
                          <ArrowRight
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
