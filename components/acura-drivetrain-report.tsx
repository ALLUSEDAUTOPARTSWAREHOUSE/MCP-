import Link from 'next/link'
import { ArrowRight, Wrench, AlertTriangle } from 'lucide-react'

const ACCENT = 'rgb(226, 60, 60)'
const SOFT_BORDER = 'rgba(226, 60, 60, 0.25)'
const CARD_BORDER = 'rgba(226, 60, 60, 0.15)'

interface ModelProfile {
  name: string
  years: string
  index: number
  description: string
  listings: number
  engines: number
  transmissions: number
  span: number
  fitment: string[]
  maintenance: string[]
  model: string
}

const REBUTTALS = [
  {
    q: 'How do I know it actually fits?',
    a: 'Every listing is tied to a specific model year and configuration — cylinder count, displacement, VIN 6th-digit engine code, and trim. If the VIN code does not match, do not order it.',
  },
  {
    q: 'Is it actually tested, or just pulled and shipped?',
    a: 'Every engine carries a completed compression and leak-down test. Every transmission is verified for shift quality before it is listed as in stock.',
  },
  {
    q: 'What happens if it fails after install?',
    a: 'Every unit ships with a 90-day warranty, full stop — the number that protects your labor, not just the part.',
  },
  {
    q: 'Will I lose the bay waiting on it?',
    a: 'Free nationwide shipping on every listing, sourced from a network spanning 40+ makes and 2.2M+ parts.',
  },
  {
    q: 'Will it hold up without OEM backing?',
    a: 'Every model profile in this issue includes platform-specific maintenance guidance — belt vs. chain, correct fluid type, known wear points.',
  },
  {
    q: "What if the exact year/trim isn't in stock?",
    a: 'This archive runs every Acura model year-by-year back to 1986 — including the low-volume ones shops usually strike out on.',
  },
]

const MODEL_PROFILES: ModelProfile[] = [
  {
    name: 'Acura Integra',
    years: '1986–2001',
    index: 1,
    model: 'Integra',
    description:
      "Acura's longest-running nameplate in this catalog (1986–2001, three generations). The DA/DC platform put DOHC VTEC on the map; GSR and Type R trims carry the B18C1/B18C5 that swapmeets still chase today. Highest-volume model in this dataset — the most-requested engine and transmission combo we stock.",
    listings: 139,
    engines: 80,
    transmissions: 59,
    span: 16,
    fitment: [
      'Nail down the exact trim (RS/LS/GS/GSR/Type R) before ordering — B-series short blocks look alike but compression ratios and head castings differ.',
      'GSR and Type R use different transmission final-drive ratios than base trims; matching engine to trans on the same listing avoids a mismatch.',
      'DA vs. DC chassis engine mounts are not interchangeable — confirm chassis code, not just model year.',
    ],
    maintenance: [
      'B-series is an interference engine on a timing belt — treat belt, tensioner, and water pump as due-for-replacement on any used unit of unknown history.',
      'Manual transmissions take Honda MTF, not standard ATF — using the wrong fluid is the most common post-swap complaint on this model.',
    ],
  },
  {
    name: 'Acura Legend',
    years: '1986–1995',
    index: 2,
    model: 'Legend',
    description:
      "Acura's 1986 launch model and the car that proved a Japanese brand could sell a premium V6 luxury coupe/sedan in the US. Later Legends (91–95) added coil-on-plug ignition and a stiffer chassis. Sold in Japan/Europe as the Honda Legend — same drivetrain family mechanics will recognize.",
    listings: 69,
    engines: 26,
    transmissions: 43,
    span: 10,
    fitment: [
      'Confirm coupe vs. sedan wiring harness routing before pulling the old engine — the two body styles differ at the firewall grommet.',
      '91–95 cars use a stiffer engine mount package than 86–90; cross-year mounts will bolt up but transmit more vibration.',
      'Verify VIN 8th-digit engine code against the listing before ordering — early and late 3.2L blocks are not identical.',
    ],
    maintenance: [
      'Timing belt is interference — if belt/tensioner/water pump condition is unknown on the used unit, replace as a kit before first start, not after.',
      'Change engine oil and filter within the first 500 miles after install to clear any break-in debris from the swap.',
    ],
  },
  {
    name: 'Acura NSX',
    years: '1991–2005',
    index: 3,
    model: 'NSX',
    description:
      '1991–2005 mid-engine, aluminum-body supercar. Low-volume, high-value units — every one gets full compression and leak-down documentation before it ships.',
    listings: 54,
    engines: 24,
    transmissions: 30,
    span: 15,
    fitment: [
      'High value per unit — always request the compression/leak-down report before final quote, and confirm 91–96 vs. 97–05 (facelift) generation.',
      "Targa vs. coupe doesn't affect drivetrain, but 3.0L vs. 3.2L (97+) blocks are not interchangeable — verify displacement on the listing.",
    ],
    maintenance: [
      'Timing belt V6, interference, and the mid-engine layout makes belt service labor-intensive — factor that into any inspection before install, not after.',
      'Confirm coolant and oil cooler lines are clear before first start; these sit low and collect debris on cars that have been sitting.',
    ],
  },
  {
    name: 'Acura Vigor',
    years: '1992–1994',
    index: 4,
    model: 'Vigor',
    description:
      'A short-lived 1992–94 bridge model between the Integra and Legend, built around a longitudinally-mounted inline-5 — an unusual layout Acura never repeated. Parts are scarcer than most; we carry both engine and transmission across the full run.',
    listings: 9,
    engines: 3,
    transmissions: 6,
    span: 3,
    fitment: [
      'The G25A inline-5 is a low-volume engine — confirm availability before promising a customer a turnaround date.',
      "Motor mounts are unique to this model; don't substitute Legend or Integra mounts even though the era overlaps.",
    ],
    maintenance: [
      'G25A inline-5 runs a timing belt — confirm interval history before install; belt failure on this engine is interference and unforgiving.',
      "Cooling system capacity is unique to the 5-cylinder layout — don't estimate coolant fill from a 4- or 6-cylinder Acura.",
    ],
  },
  {
    name: 'Acura TL',
    years: '1995–2014',
    index: 5,
    model: 'TL',
    description:
      "1995–2014, five generations, Acura's best-selling sedan and the single largest listing count in this dataset. If a shop only stocks one Acura drivetrain reference, it's usually this one.",
    listings: 74,
    engines: 33,
    transmissions: 41,
    span: 20,
    fitment: [
      'Five generations in one nameplate — always confirm generation (96–98 / 99–03 / 04–08 / 09–14) before quoting, since mounts and ECU pinouts change each generation.',
      'Type-S trims (00–03, 07–08) carry different cam profiles from base V6s of the same year.',
    ],
    maintenance: [
      'V6 J-series across most generations runs a timing belt — confirm interval history on any used engine before first start.',
      'Type-S transmissions see harder use on average; a full fluid and filter service before install is worth the extra 20 minutes.',
    ],
  },
  {
    name: 'Acura RL',
    years: '1996–2012',
    index: 6,
    model: 'RL',
    description:
      '1996–2012 flagship sedan across two generations. The second-gen (05–12) introduced SH-AWD torque vectoring — those transmissions and transfer cases are not interchangeable with the first-gen RL, so compatibility notes matter more here than on most models.',
    listings: 36,
    engines: 18,
    transmissions: 18,
    span: 17,
    fitment: [
      'Second-gen 05–12 SH-AWD units are not interchangeable with first-gen — confirm generation before ordering the transmission, not just the year.',
      "Transfer case and rear differential must be sourced as a matched set on SH-AWD cars, or torque vectoring won't calibrate correctly.",
    ],
    maintenance: [
      'C-series/J-series V6 runs a timing belt through most of this range — confirm belt condition before install, this is an interference design.',
      "SH-AWD (05–12) rear differential uses its own fluid spec, separate from the transmission — don't lump it into a standard ATF service.",
    ],
  },
  {
    name: 'Acura SLX',
    years: '1996–1999',
    index: 7,
    model: 'SLX',
    description:
      "Acura's first SUV (1996–99), a rebadged Isuzu Trooper sold to round out the lineup before the MDX existed. Mechanically closer to Isuzu than any other car on this page — worth confirming VIN-specific engine codes before ordering.",
    listings: 8,
    engines: 4,
    transmissions: 4,
    span: 4,
    fitment: [
      'This is an Isuzu Trooper drivetrain under an Acura badge — cross-reference Isuzu part numbers if the Acura-specific listing is thin.',
      'Confirm 4WD vs. 2WD transfer case compatibility before ordering the transmission.',
    ],
    maintenance: [
      'Isuzu-sourced 3.2L V6 runs a timing belt — same interference-engine caution as the Legend and Integra applies here.',
      'Transfer case fluid spec follows Isuzu Trooper service data, not standard Acura fluid charts — verify before topping off.',
    ],
  },
  {
    name: 'Acura CL',
    years: '1997–2003',
    index: 8,
    model: 'CL',
    description:
      '1997–2003 mid-size coupe built on the Accord/TL platform. The 2001–03 Type-S brought the 3.2L J-series V6 and a 6-speed manual — the configuration we get the most transmission requests for.',
    listings: 29,
    engines: 13,
    transmissions: 16,
    span: 7,
    fitment: [
      'Type-S (01–03) runs the 3.2L J-series V6 with a 6-speed manual option — confirm AT vs. MT on the listing, they are not cross-compatible.',
      'Base CL and Type-S use different ECU pinouts even on shared-displacement years; match engine and computer together where possible.',
    ],
    maintenance: [
      'Base F-series is SOHC; Type-S J32 V6 is a separate engine family entirely — timing service intervals differ, so confirm which one is actually in the car.',
      "After a used-transmission swap, do a full fluid and filter change before the first drive, even if the unit was tested — don't rely on the seller's fluid.",
    ],
  },
  {
    name: 'Acura EL',
    years: '1997–2005',
    index: 9,
    model: 'EL',
    description:
      "1997–2005 Canada-market entry sedan, essentially a dressed-up Civic. Common shop request when a customer's cross-border import needs a drivetrain match.",
    listings: 31,
    engines: 13,
    transmissions: 18,
    span: 9,
    fitment: [
      'Essentially a Civic underneath — if the Acura-specific listing is out, a same-year Civic block is often a direct swap once mounts are confirmed.',
      'Cross-border Canadian-spec units may carry different emissions hardware; flag this for customers doing a US-side swap.',
    ],
    maintenance: [
      'D-series SOHC, timing belt, generally forgiving but still worth a visual belt check before first start on a used unit.',
      'Shares service intervals with the same-year Civic almost exactly — Civic maintenance schedules are a reliable fallback reference.',
    ],
  },
  {
    name: 'Acura MDX',
    years: '2001–2020',
    index: 10,
    model: 'MDX',
    description:
      "2001–2020, four generations, Acura's top-selling model overall and the backbone of the three-row luxury SUV segment. Largest engine/transmission spread in this catalog by year — always confirm generation before ordering, since the platform changed twice in this range.",
    listings: 80,
    engines: 35,
    transmissions: 45,
    span: 20,
    fitment: [
      'Three platform generations in this range (01–06 / 07–13 / 14–20) — confirm generation first, since transmission bolt patterns changed twice.',
      'Later V6 (14–20) uses a 9-speed automatic not found on earlier generations; verify speed count on the listing before ordering.',
    ],
    maintenance: [
      "Belt-vs-chain depends on exact model year across three generations — confirm before quoting a timing service, don't assume by model name alone.",
      'AWD models: service the rear differential fluid on its own interval, separate from the transmission, especially after a used-unit install.',
    ],
  },
  {
    name: 'Acura RSX',
    years: '2002–2006',
    index: 11,
    model: 'RSX',
    description:
      "2002–2006 sport compact that replaced the Integra, built on Civic architecture. The Type-S brought the K20A2 — a direct spiritual successor to the Integra Type R's B18C5, and just as commonly requested.",
    listings: 50,
    engines: 25,
    transmissions: 25,
    span: 5,
    fitment: [
      'Type-S runs the K20A2 — confirm this against base K20A3 listings, as compression and VTEC crossover point differ.',
      'Manual and automatic RSX transmissions are not cross-compatible with engine ECU maps; order as a matched pair when possible.',
    ],
    maintenance: [
      'K-series runs a timing chain, not a belt — no fixed replacement interval, but check tensioner noise on cold start before signing off on a used unit.',
      'Type-S (K20A2) revs higher than base — an oil change with the correct viscosity before first start protects the swap.',
    ],
  },
  {
    name: 'Acura TSX',
    years: '2004–2014',
    index: 12,
    model: 'TSX',
    description:
      '2004–2014, sourced from the Euro-spec Honda Accord — a chassis and drivetrain North American mechanics see less often, which is exactly why correct VIN-digit engine codes matter more on this model than most.',
    listings: 44,
    engines: 17,
    transmissions: 27,
    span: 11,
    fitment: [
      "Euro-sourced Accord chassis — engine bay layout differs from the US Accord, so don't substitute US Accord mounts.",
      '04–08 (CL9) and 09–14 (CU2) generations use different engine families entirely; match by chassis code, not just year.',
    ],
    maintenance: [
      'K-series timing chain — same cold-start tensioner check as the RSX applies here before signing off on a used engine.',
      'Confirm generation (CL9 vs. CU2) before assuming fluid specs; the two engine families are not serviced identically.',
    ],
  },
  {
    name: 'Acura CSX',
    years: '2006–2011',
    index: 13,
    model: 'CSX',
    description:
      "2006–2011 Canada-market compact sedan on the 8th-gen Civic platform, effectively the EL's successor. Same shop logic as the EL: cross-border fitment questions are common.",
    listings: 35,
    engines: 15,
    transmissions: 20,
    span: 6,
    fitment: [
      '8th-gen Civic platform underneath — same logic as the EL, a Civic-spec block can be a fallback if the CSX-specific listing is out.',
      "Canadian-market only; confirm the customer's VIN actually matches CSX-specific wiring before assuming interchange with a US Civic.",
    ],
    maintenance: [
      'Civic-platform engine runs a timing chain — inspect for cold-start rattle (worn tensioner) before install rather than after.',
      "Standard Honda-spec ATF applies; don't substitute a generic universal fluid on the automatic.",
    ],
  },
  {
    name: 'Acura RDX',
    years: '2007–2019',
    index: 14,
    model: 'RDX',
    description:
      "2007–2019, two generations. First-gen ran Acura's only turbocharged four-cylinder of the era; second-gen switched to a naturally aspirated V6. These are not interchangeable — treat pre/post-2013 as different platforms entirely.",
    listings: 43,
    engines: 22,
    transmissions: 21,
    span: 13,
    fitment: [
      'Pre-2013 turbo four and 2013+ NA V6 are entirely different platforms — this is the single most common mismatch order on this model, double check displacement.',
      'AWD transfer case differs by generation; order engine, transmission, and transfer case as a matched set where the customer has AWD.',
    ],
    maintenance: [
      'Turbo-four (pre-2013) needs a stricter oil-change interval than the naturally aspirated V6 (2013+) — confirm which platform before setting a service schedule.',
      'AWD transfer case fluid is a separate service item from the transmission on both generations.',
    ],
  },
  {
    name: 'Acura ZDX',
    years: '2010–2013',
    index: 15,
    model: 'ZDX',
    description:
      '2010–2013, a low-volume crossover-coupe built on the MDX platform. Fewer listings than any other model here, which mirrors how few were actually sold — expect longer sourcing lead times industry-wide, though we keep both engine and transmission covered across the run.',
    listings: 9,
    engines: 4,
    transmissions: 5,
    span: 4,
    fitment: [
      'Shares its platform with the same-era MDX — if the ZDX-specific listing is thin, cross-check MDX listings from the same model year.',
      'Low production volume overall; build in extra lead time when quoting a customer.',
    ],
    maintenance: [
      'Shares its drivetrain era with the same-generation MDX — apply the same belt/chain confirmation caution before quoting timing service.',
      'Low production volume means these often sat longer before resale — a fluid and filter change before first start is cheap insurance.',
    ],
  },
  {
    name: 'Acura ILX',
    years: '2013–2018',
    index: 16,
    model: 'ILX',
    description:
      '2013–2018, Civic-platform entry sedan that replaced the CSX/EL role in the US market. Straightforward fitment, high parts availability.',
    listings: 27,
    engines: 15,
    transmissions: 12,
    span: 6,
    fitment: [
      'Civic-platform underneath — high parts availability, and a same-year Civic block is a reasonable fallback if the ILX-specific listing is out.',
      'Confirm CVT vs. conventional automatic before ordering; both were offered depending on trim year.',
    ],
    maintenance: [
      'Civic-platform chain-driven engine — low maintenance complexity, standard Honda-spec fluids apply.',
      'CVT-equipped units need CVT-specific fluid, never standard ATF — this is the single most common post-install fluid mistake on this model.',
    ],
  },
  {
    name: 'Acura RLX',
    years: '2015–2017',
    index: 17,
    model: 'RLX',
    description:
      "2015–2017, the RL's flagship successor, sold in low numbers before Acura restructured its sedan lineup. Smallest listing count alongside the ZDX — same sourcing-lead-time logic applies.",
    listings: 12,
    engines: 6,
    transmissions: 6,
    span: 3,
    fitment: [
      'Low production volume — confirm stock before quoting a firm turnaround date to the customer.',
      'Sport Hybrid SH-AWD trim uses a different transmission entirely from the standard RLX; confirm trim on the VIN before ordering.',
    ],
    maintenance: [
      'V6 timing chain — standard J-series maintenance logic applies.',
      'Sport Hybrid SH-AWD variant has a separate high-voltage service protocol; flag hybrid trim clearly before a shop unfamiliar with EV components takes the job.',
    ],
  },
  {
    name: 'Acura TLX',
    years: '2015–2019',
    index: 18,
    model: 'TLX',
    description:
      "2015–2019, replaced both the TL and TSX in one model, consolidating Acura's mid-size sedan line. Direct-injection four and V6 variants both run through this dataset.",
    listings: 46,
    engines: 15,
    transmissions: 31,
    span: 5,
    fitment: [
      'Four-cylinder direct-injection and V6 variants are not interchangeable — confirm displacement on the listing before quoting.',
      'SH-AWD trims need transmission and transfer case matched together, same as RL/RDX AWD logic.',
    ],
    maintenance: [
      'V6 runs a timing chain; four-cylinder direct-injection variants need attention to carbon buildup on intake valves over time — flag this to the customer at service intervals, not just at swap time.',
      'SH-AWD rear diff fluid is serviced separately from the transmission, same logic as RDX/RL.',
    ],
  },
]

const HEADLINE_STATS = [
  { value: '18', label: 'Models' },
  { value: '795', label: 'Listings' },
  { value: '34', label: 'Years Covered' },
  { value: '90', label: 'Day Warranty' },
]

export function AcuraDrivetrainReport() {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Report intro */}
      <section
        className="relative border-t"
        style={{ borderColor: SOFT_BORDER }}
        aria-label="Acura Drivetrain Report"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            Special Issue · Acura Drivetrain Archive
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase text-white lg:text-5xl text-balance">
            The Drivetrain Report
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-300/80">
            A complete production history of every Acura engine and transmission we carry — built
            for the shop floor, not the showroom. Fitment warnings, maintenance guidance, and live
            listings, model by model.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HEADLINE_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border bg-slate-900/60 p-5 text-center"
                style={{ borderColor: CARD_BORDER }}
              >
                <p className="text-4xl font-black" style={{ color: ACCENT }}>
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Rebuttal */}
      <section className="relative" aria-label="The Rebuttal">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-black uppercase text-white lg:text-3xl">The Rebuttal</h3>
          <p className="mt-2 max-w-2xl text-slate-300/70">
            Six things mechanics ask before they&apos;ll put a used drivetrain in a customer&apos;s
            car — direct answers, sourced from what&apos;s actually on each listing, not a sales
            pitch.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REBUTTALS.map((r, i) => (
              <div
                key={r.q}
                className="rounded-xl border bg-slate-900/60 p-6"
                style={{ borderColor: CARD_BORDER }}
              >
                <p className="text-sm font-black" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 font-bold text-white">&ldquo;{r.q}&rdquo;</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300/70">{r.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model profiles */}
      <section className="relative" aria-label="Acura model profiles">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-black uppercase text-white lg:text-3xl">Model Index</h3>
          <p className="mt-2 max-w-2xl text-slate-300/70">
            All 18 models Acura has sold in the US and Canada, 1986–2020, each with its own
            profile: production history, fitment notes, maintenance suggestions, and live catalog
            listings.
          </p>

          <div className="mt-10 space-y-8">
            {MODEL_PROFILES.map((m) => (
              <article
                key={m.name}
                className="rounded-2xl border bg-slate-900/60 p-6 lg:p-8"
                style={{ borderColor: CARD_BORDER }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Model Profile · {String(m.index).padStart(2, '0')} / 18
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-white">
                      {m.name}{' '}
                      <span className="font-bold" style={{ color: ACCENT }}>
                        {m.years}
                      </span>
                    </h4>
                  </div>
                  <Link
                    href={`/brands/acura?model=${encodeURIComponent(m.model)}`}
                    className="inline-flex items-center gap-1 text-sm font-bold transition-opacity hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    View live listings
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-4 max-w-3xl leading-relaxed text-slate-300/80">{m.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { value: m.listings, label: 'Listings on Record' },
                    { value: m.engines, label: 'Engine Listings' },
                    { value: m.transmissions, label: 'Transmission Listings' },
                    { value: m.span, label: 'Model Years Span' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border bg-slate-950/60 p-3 text-center"
                      style={{ borderColor: CARD_BORDER }}
                    >
                      <p className="text-2xl font-black text-white">{s.value}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <AlertTriangle className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                      Fitment Notes
                    </p>
                    <ul className="mt-3 space-y-2">
                      {m.fitment.map((note) => (
                        <li
                          key={note}
                          className="border-l-2 pl-3 text-sm leading-relaxed text-slate-300/70"
                          style={{ borderColor: SOFT_BORDER }}
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <Wrench className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                      Maintenance Suggestions
                    </p>
                    <ul className="mt-3 space-y-2">
                      {m.maintenance.map((note) => (
                        <li
                          key={note}
                          className="border-l-2 pl-3 text-sm leading-relaxed text-slate-300/70"
                          style={{ borderColor: SOFT_BORDER }}
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: CARD_BORDER }}>
                  <Link
                    href={`/brands/acura?model=${encodeURIComponent(m.model)}&category=Engine`}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                    style={{ borderColor: SOFT_BORDER }}
                  >
                    {m.name} Engines
                    <ArrowRight className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  </Link>
                  <Link
                    href={`/brands/acura?model=${encodeURIComponent(m.model)}&category=Transmission`}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                    style={{ borderColor: SOFT_BORDER }}
                  >
                    {m.name} Transmissions
                    <ArrowRight className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-xs leading-relaxed text-slate-500">
            Fitment and maintenance notes in this issue are general platform guidance. Always
            confirm against the customer&apos;s VIN before ordering.
          </p>
        </div>
      </section>
    </div>
  )
}
