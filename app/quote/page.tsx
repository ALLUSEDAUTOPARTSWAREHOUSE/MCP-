"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"

import { Zap, Shield, Truck, Phone, DollarSign, Mail, CheckCircle2, AlertCircle } from "lucide-react"
import { CAR_MAKES, CAR_MODELS, PART_CATEGORIES, YEARS, US_STATES, PHONE_DISPLAY, PHONE_SALES } from "@/lib/data"
import { getPartOptions } from "@/lib/parts-content"
import { useState } from "react"

const CONTACT_EMAIL = "aupworld@gmail.com"

export default function QuotePage() {
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [part, setPart] = useState("")
  const [option, setOption] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const models = make ? CAR_MODELS[make] || [] : []
  const partOptions = part ? getPartOptions(part) : []
  const selectClass = "w-full text-sm px-3 py-2.5 bg-[rgba(13,15,22,0.75)] border border-border/50 rounded-lg text-foreground appearance-none focus:border-primary/55 focus:ring-1 focus:ring-primary/20 outline-none transition-all"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!make) { setError("Please select a vehicle make."); return }
    if (!name.trim()) { setError("Please enter your name."); return }
    if (!phone.trim()) { setError("Please enter your phone number."); return }

    setLoading(true)

    // Build the email subject and body from the form fields.
    const subject = `Quote Request: ${[year, make, model].filter(Boolean).join(" ")} - ${part || "Auto Part"}`
      .replace(/\s+/g, " ")
      .trim()

    const body = [
      "Hi AUAPW LLC team,",
      "",
      "I'd like a free quote for the following part:",
      "",
      "--- Vehicle Details ---",
      `Part:    ${part || "Not specified"}`,
      `Make:    ${make}`,
      `Model:   ${model || "Not specified"}`,
      `Year:    ${year || "Not specified"}`,
      `Option:  ${option || "Not specified"}`,
      "",
      "--- My Contact Details ---",
      `Name:    ${name}`,
      `Phone:   ${phone}`,
      `Email:   ${email || "Not provided"}`,
      `State:   ${state || "Not provided"}`,
      `ZIP:     ${zip || "Not provided"}`,
      "",
      "--- Message ---",
      message || "(no additional details)",
      "",
      "Thank you!",
    ].join("\n")

    // Open the customer's own email client with everything pre-filled,
    // so the quote request is sent from their mailbox to AUAPW LLC.
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto

    setLoading(false)
    setSuccess(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        {/* Header */}
        <div className="relative border-b border-border/30 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(13,15,22,0.78), rgba(13,15,22,0.72), rgba(13,15,22,0.88)), url('/images/heroes/hero-support.png')" }}>
          <div className="metal-line" />
          <div className="mx-auto max-w-[1280px] px-6 py-20">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">No Obligation</span>
            </div>
            <h1 className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] font-bold text-foreground">Request a Free Quote</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-[520px]">
              Fill out the form and our team will find the best available parts from our 2,000+ yard network. When you submit, your email app opens with the request pre-filled &mdash; just press Send.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Sidebar - shown after form on mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 order-2 lg:order-1">
              {[
                { icon: Zap, title: "24-Hour Response", desc: "Our team contacts you with options within one business day" },
                { icon: Shield, title: "6-Month Warranty", desc: "Every part includes full return & replacement coverage" },
                { icon: DollarSign, title: "Best Price Match", desc: "We compare 2,000+ yards to find the lowest price" },
                { icon: Truck, title: "Nationwide Delivery", desc: "Ships to all 50 states in 7-10 business days" },
                { icon: Mail, title: "Direct Email", desc: `Your quote goes directly to ${CONTACT_EMAIL}` },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass-card rounded-lg p-6 flex items-start gap-4 border border-primary/5 shadow-md hover:shadow-lg hover:border-primary/10 transition-all">
                  <span className="text-lg shrink-0 mt-0.5"><Icon className="w-5 h-5 text-primary" /></span>
                  <div>
                    <p className="text-[13px] font-bold text-foreground mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
              <div className="glass-card rounded-lg p-6 border border-primary/5 shadow-md">
                <div className="metal-line mb-6" />
                <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/70 mb-2 font-semibold">Prefer to Call?</p>
                <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="text-2xl font-bold text-foreground block mb-1">{PHONE_DISPLAY}</a>
                <p className="text-[11px] text-muted-foreground">Mon-Sat 8am-6pm PST</p>
                <div className="mt-5 pt-5 border-t border-border/20">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/70 mb-2 font-semibold">Or Email Directly</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-bold text-primary hover:underline">{CONTACT_EMAIL}</a>
                </div>
              </div>
            </div>

            {/* Form - shown first on mobile */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {success ? (
                <div className="glass-card rounded-sm p-8 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Your Email Is Ready to Send!</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    We&apos;ve opened your email app with your quote request pre-filled. Just press <strong>Send</strong> to deliver it, and we&apos;ll reply within <strong>24 hours</strong>. If your email app didn&apos;t open, use the options below.
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Need it faster? Call us at{" "}
                    <a href={`tel:${PHONE_SALES.replace(/-/g, "")}`} className="text-primary font-bold hover:underline">{PHONE_DISPLAY}</a>
                    {" "}or email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold hover:underline">{CONTACT_EMAIL}</a>
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => { setSuccess(false); setMake(""); setModel(""); setPart(""); }} className="px-6 py-3 text-sm text-muted-foreground border border-border/50 rounded-sm hover:text-foreground hover:border-foreground/50 transition-all">
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-lg p-4 sm:p-8 lg:p-10 border border-primary/10 shadow-lg shadow-primary/5 bg-gradient-to-br from-card/50 via-card/30 to-background/20">
                  <div className="metal-line mb-8" />
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Your Details</h2>

                  {error && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3" role="alert">
                      <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Full Name *</label>
                        <input type="text" required placeholder="John Smith" className={selectClass} value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Phone Number *</label>
                        <input type="tel" required placeholder="(555) 123-4567" className={selectClass} value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Email Address</label>
                      <input type="email" placeholder="john@example.com" className={selectClass} value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="h-px bg-border/30 my-8" />
                    <h3 className="font-serif text-xl font-bold text-foreground mb-7">Vehicle & Part Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Make *</label>
                        <select required className={selectClass} value={make} onChange={(e) => { setMake(e.target.value); setModel("") }}>
                          <option value="">Select Make</option>
                          {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Model</label>
                        <select className={selectClass} value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                          <option value="">{make ? "Select Model" : "Select Make First"}</option>
                          {models.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Year</label>
                        <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
                          <option value="">Select Year</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Part Needed</label>
                        <select className={selectClass} value={part} onChange={(e) => { setPart(e.target.value); setOption("") }}>
                          <option value="">Select Part</option>
                          <option value="Engine">Engine</option>
                          <option value="Transmission">Transmission</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Option</label>
                        <select className={selectClass} value={option} onChange={(e) => setOption(e.target.value)}>
                          <option value="">Select Option</option>
                          {partOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Your State</label>
                        <select className={selectClass} value={state} onChange={(e) => setState(e.target.value)}>
                          <option value="">Select State</option>
                          {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">ZIP Code</label>
                        <input type="text" inputMode="numeric" maxLength={5} placeholder="ZIP Code" className={selectClass} value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">Additional Notes (VIN, engine size, trim level, etc.)</label>
                      <textarea rows={3} placeholder="Any extra details that help us find the right part faster..." className={`${selectClass} resize-none`} value={message} onChange={e => setMessage(e.target.value)} />
                    </div>

                    <button type="submit" disabled={loading} className="auapw-btn auapw-btn-blue w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-[0.75rem] font-bold tracking-[0.18em] uppercase rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 mt-8 disabled:opacity-60">
                      <Mail className="w-4 h-4" />
                      {loading ? "Sending..." : "Get A Free Quote — Send Now"}
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Your request is emailed instantly to our team at {CONTACT_EMAIL}. No spam, no obligation.
                    </p>
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                      By Submitting, you authorize AUAPW LLC to text and call the number you provided with offers &amp; other information, possibly using automated means. Messages/Data rates apply. Consent is not a condition of purchase.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
