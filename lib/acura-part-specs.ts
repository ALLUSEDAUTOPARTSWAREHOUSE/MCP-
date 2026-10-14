import type { AcuraProduct } from "@/lib/acura-data"

export interface PartSpec {
  label: string
  value: string
}

/**
 * Real Acura/Honda engine families keyed by `MODEL|displacement`.
 * Sourced from published Acura engine designations so each part shows its own
 * accurate specification instead of a shared generic block.
 */
interface EngineFacts {
  code: string
  layout: string
  aspiration: string
  valvetrain: string
  fuel: string
  hp: string
  /** Optional horsepower override when the parsed trim is a performance variant. */
  performanceHp?: string
}

const ENGINE_DB: Record<string, EngineFacts> = {
  "CL|2.2": { code: "F22B1", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "145 hp @ 5,500 rpm" },
  "CL|2.3": { code: "F23A1", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "150 hp @ 5,700 rpm" },
  "CL|3.0": { code: "J30A1", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Multi-point fuel injection", hp: "200 hp @ 5,500 rpm" },
  "CL|3.2": { code: "J32A1 / J32A2 (Type-S)", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Multi-point fuel injection", hp: "225 hp @ 5,600 rpm", performanceHp: "260 hp @ 6,100 rpm (Type-S)" },
  "CSX|2.0": { code: "K20Z2 / K20Z3 (Type-S)", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "155 hp @ 6,000 rpm", performanceHp: "197 hp @ 7,800 rpm (Type-S)" },
  "EL|1.6": { code: "D16Y8", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "127 hp @ 6,600 rpm" },
  "EL|1.7": { code: "D17A2", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "127 hp @ 6,300 rpm" },
  "ILX|1.5": { code: "LDA3 (i-VTEC + IMA hybrid)", layout: "Inline-4", aspiration: "Naturally aspirated hybrid", valvetrain: "SOHC i-VTEC 8-valve", fuel: "Programmed fuel injection", hp: "111 hp combined" },
  "ILX|2.0": { code: "R20A4", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "150 hp @ 6,500 rpm" },
  "ILX|2.4": { code: "K24Z7 / K24V7", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "201 hp @ 6,800 rpm" },
  "INTEGRA|1.6": { code: "B16A", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "160 hp @ 7,600 rpm" },
  "INTEGRA|1.7": { code: "D17A", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "SOHC 16-valve", fuel: "Multi-point fuel injection", hp: "120 hp @ 6,100 rpm" },
  "INTEGRA|1.8": { code: "B18B1 / B18C1 (GS-R) / B18C5 (Type R)", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC VTEC 16-valve", fuel: "Multi-point fuel injection", hp: "140 hp @ 6,300 rpm", performanceHp: "195 hp @ 8,000 rpm (Type R)" },
  "LEGEND|2.5": { code: "C25A", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC 24-valve", fuel: "Multi-point fuel injection", hp: "151 hp @ 5,800 rpm" },
  "LEGEND|2.7": { code: "C27A", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC 24-valve", fuel: "Multi-point fuel injection", hp: "200 hp @ 6,000 rpm" },
  "LEGEND|3.2": { code: "C32A", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC 24-valve", fuel: "Multi-point fuel injection", hp: "230 hp @ 6,200 rpm" },
  "MDX|3.0": { code: "J30 series", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "220 hp @ 5,500 rpm" },
  "MDX|3.5": { code: "J35A / J35Y", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "240-290 hp" },
  "MDX|3.7": { code: "J37A", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "300 hp @ 6,300 rpm" },
  "NSX|3.0": { code: "C30A", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "DOHC VTEC 24-valve", fuel: "Multi-point fuel injection", hp: "270 hp @ 7,100 rpm" },
  "NSX|3.2": { code: "C32B", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "DOHC VTEC 24-valve", fuel: "Multi-point fuel injection", hp: "290 hp @ 7,100 rpm" },
  "RDX|2.0": { code: "K20C4", layout: "Inline-4", aspiration: "Turbocharged", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Direct injection", hp: "272 hp @ 6,500 rpm" },
  "RDX|2.3": { code: "K23A1", layout: "Inline-4", aspiration: "Turbocharged", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "240 hp @ 6,000 rpm" },
  "RDX|3.5": { code: "J35 series", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC i-VTEC 24-valve", fuel: "Direct injection", hp: "279 hp @ 6,200 rpm" },
  "RL|3.5": { code: "C35A / J35 (SH-AWD)", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "210-300 hp" },
  "RL|3.7": { code: "J37A2", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "300 hp @ 6,200 rpm" },
  "RLX|3.5": { code: "J35Y", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC i-VTEC 24-valve", fuel: "Direct injection", hp: "310 hp @ 6,500 rpm" },
  "RSX|2.0": { code: "K20A3 / K20Z1 (Type-S)", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "160 hp @ 6,500 rpm", performanceHp: "210 hp @ 7,800 rpm (Type-S)" },
  "SLX|3.2": { code: "6VD1", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "DOHC 24-valve", fuel: "Multi-point fuel injection", hp: "190 hp @ 5,600 rpm" },
  "SLX|3.5": { code: "6VE1", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "DOHC 24-valve", fuel: "Multi-point fuel injection", hp: "215 hp @ 5,400 rpm" },
  "TL|2.5": { code: "G25A1", layout: "Inline-5", aspiration: "Naturally aspirated", valvetrain: "SOHC 20-valve", fuel: "Multi-point fuel injection", hp: "176 hp @ 6,300 rpm" },
  "TL|3.2": { code: "J32A1 / J32A3", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "225-258 hp" },
  "TL|3.5": { code: "J35Z6", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "280 hp @ 6,200 rpm" },
  "TL|3.7": { code: "J37A4", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "305 hp @ 6,200 rpm (SH-AWD)" },
  "TLX|2.4": { code: "K24W7", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Direct injection", hp: "206 hp @ 6,800 rpm" },
  "TLX|3.5": { code: "J35Y6", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC i-VTEC 24-valve", fuel: "Direct injection", hp: "290 hp @ 6,200 rpm" },
  "TSX|2.4": { code: "K24A2 / K24Z3", layout: "Inline-4", aspiration: "Naturally aspirated", valvetrain: "DOHC i-VTEC 16-valve", fuel: "Programmed fuel injection", hp: "201-205 hp" },
  "TSX|3.5": { code: "J35Z6", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "280 hp @ 6,200 rpm" },
  "VIGOR|2.5": { code: "G25A1", layout: "Inline-5", aspiration: "Naturally aspirated", valvetrain: "SOHC 20-valve", fuel: "Multi-point fuel injection", hp: "176 hp @ 6,300 rpm" },
  "ZDX|3.7": { code: "J37A5", layout: "V6", aspiration: "Naturally aspirated", valvetrain: "SOHC VTEC 24-valve", fuel: "Programmed fuel injection", hp: "300 hp @ 6,300 rpm (SH-AWD)" },
}

/** Parse the displacement (e.g. "3.2") out of a product name/description. */
function parseDisplacement(text: string): string | null {
  const match = text.match(/(\d\.\d)\s*L/i)
  return match ? match[1] : null
}

/** Parse the assembly configuration that follows the first " - " in the name. */
function parseAssembly(name: string): string | null {
  const idx = name.indexOf(" - ")
  if (idx === -1) return null
  return name.slice(idx + 3).trim() || null
}

/** Detect a performance trim (Type-S, Type R, GS-R, A-Spec) from the name. */
function isPerformanceTrim(name: string): boolean {
  return /type[\s-]?s|type[\s-]?r|gs-?r|a-?spec/i.test(name)
}

/** Detect the transmission style from the configuration text. */
function parseTransmissionType(text: string): "Automatic" | "Manual" | "CVT" | "Dual-Clutch" {
  if (/\bCVT\b/i.test(text)) return "CVT"
  if (/\bDCT\b|dual[\s-]?clutch/i.test(text)) return "Dual-Clutch"
  if (/\bMT\b|manual|(\d)[\s-]?speed manual/i.test(text)) return "Manual"
  return "Automatic"
}

/** Resolve the correct gear count and transmission code family by model, year and type. */
function resolveTransmissionGears(
  model: string,
  year: number,
  type: "Automatic" | "Manual" | "CVT" | "Dual-Clutch",
): { gears: string; code: string } {
  if (type === "CVT") return { gears: "Continuously variable", code: "Honda CVT" }
  if (type === "Dual-Clutch") return { gears: model === "TLX" || model === "ILX" ? "8-speed" : "7-speed", code: "Honda DCT" }

  if (type === "Manual") {
    const sixSpeedModels = ["TSX", "TL", "RSX", "CSX", "NSX", "TLX"]
    if (model === "INTEGRA") return { gears: year >= 2023 ? "6-speed" : "5-speed", code: "Honda close-ratio manual" }
    if (sixSpeedModels.includes(model)) return { gears: year >= 2002 ? "6-speed" : "5-speed", code: "Honda manual" }
    return { gears: "5-speed", code: "Honda manual" }
  }

  // Automatic gear counts by model and model year.
  switch (model) {
    case "MDX":
      if (year >= 2016) return { gears: "9-speed", code: "ZF 9HP automatic" }
      if (year >= 2007) return { gears: "6-speed", code: "Honda 6-speed automatic" }
      return { gears: "5-speed", code: "Honda BVGA/MGFA automatic" }
    case "RDX":
      if (year >= 2019) return { gears: "10-speed", code: "Honda 10AT automatic" }
      if (year >= 2013) return { gears: "6-speed", code: "Honda 6-speed automatic" }
      return { gears: "5-speed", code: "Honda 5-speed automatic" }
    case "RL":
      if (year >= 2009) return { gears: "6-speed", code: "Honda 6-speed automatic" }
      if (year >= 2005) return { gears: "5-speed", code: "Honda 5-speed automatic" }
      return { gears: "4-speed", code: "Honda 4-speed automatic" }
    case "TL":
      if (year >= 2009) return { gears: "5/6-speed", code: "Honda automatic (Sequential SportShift)" }
      if (year >= 2004) return { gears: "5-speed", code: "Honda BDGA automatic" }
      return { gears: "4-speed", code: "Honda B7YA automatic" }
    case "TLX":
      return { gears: "9-speed", code: "ZF 9HP automatic" }
    case "RLX":
      return { gears: "6-speed", code: "Honda 6-speed automatic" }
    case "ZDX":
      return { gears: "6-speed", code: "Honda 6-speed automatic" }
    case "CL":
      return { gears: "4-speed", code: "Honda B7XA/BGFA automatic" }
    case "ILX":
      return { gears: "5-speed", code: "Honda 5-speed automatic" }
    default:
      return year >= 2007
        ? { gears: "5-speed", code: "Honda automatic" }
        : { gears: "4-speed", code: "Honda automatic" }
  }
}

function isEngine(product: Pick<AcuraProduct, "category">): boolean {
  return /engine/i.test(product.category)
}

function isTransmission(product: Pick<AcuraProduct, "category">): boolean {
  return /transmission/i.test(product.category)
}

/**
 * Build part-specific specifications for an Acura engine or transmission.
 * Returns null for any other part type so the caller can keep generic content.
 */
export function getAcuraPartSpecs(product: AcuraProduct): PartSpec[] | null {
  const configText = `${product.name} ${product.compatibility ?? ""} ${product.description ?? ""}`
  const displacement = parseDisplacement(configText)
  const assembly = parseAssembly(product.name)
  const yearNum = Number.parseInt(product.year, 10) || 0
  const fitment = [product.year, "Acura", product.model === "Acura" ? "" : product.model].filter(Boolean).join(" ")

  if (isEngine(product)) {
    const facts = displacement ? ENGINE_DB[`${product.model}|${displacement}`] : undefined
    const specs: PartSpec[] = []

    if (facts) {
      specs.push({ label: "Engine Code", value: facts.code })
      specs.push({
        label: "Layout & Displacement",
        value: `${facts.layout}${displacement ? `, ${displacement}L` : ""}`,
      })
      specs.push({ label: "Aspiration", value: facts.aspiration })
      specs.push({ label: "Valvetrain", value: facts.valvetrain })
      specs.push({ label: "Fuel System", value: facts.fuel })
      specs.push({
        label: "Horsepower (factory)",
        value: facts.performanceHp && isPerformanceTrim(product.name) ? facts.performanceHp : facts.hp,
      })
    } else if (displacement) {
      // No exact family match, but still keep it part-specific with parsed data.
      specs.push({ label: "Displacement", value: `${displacement}L` })
      specs.push({ label: "Engine Family", value: `Acura ${product.model} ${displacement}L` })
    }

    if (assembly) specs.push({ label: "Assembly Configuration", value: assembly })
    specs.push({ label: "Direct Fitment", value: fitment })

    return specs.length ? specs : null
  }

  if (isTransmission(product)) {
    const type = parseTransmissionType(configText)
    const { gears, code } = resolveTransmissionGears(product.model, yearNum, type)
    const specs: PartSpec[] = [
      { label: "Transmission Type", value: type },
      { label: "Gears", value: gears },
      { label: "Transmission Code", value: code },
    ]
    if (displacement) specs.push({ label: "Paired Engine", value: `Acura ${product.model} ${displacement}L` })
    specs.push({ label: "Driveline", value: /SH-AWD|AWD|4WD/i.test(configText) ? "AWD / SH-AWD" : "FWD" })
    if (assembly) specs.push({ label: "Assembly Configuration", value: assembly })
    specs.push({ label: "Direct Fitment", value: fitment })
    return specs
  }

  return null
}
