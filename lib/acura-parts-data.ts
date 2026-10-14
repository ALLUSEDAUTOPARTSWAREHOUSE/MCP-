// Acura Used Auto Parts Data
// Prices increased by 15% from original wholesale prices
// All parts are USED OEM parts from verified recyclers

export interface AcuraPart {
  id: string
  title: string
  description: string
  price: number // 15% markup applied
  originalPrice: number
  image: string
  mpn: string
  model: string
  year: string
  partType: string
  condition: 'used'
  availability: 'in_stock' | 'out_of_stock'
  link: string
}

// Helper to get correct image for part type
function getPartImage(partType: string): string {
  const imageMap: Record<string, string> = {
    'Engine': '/images/parts/engine-used.jpg',
    'Transmission': '/images/parts/transmission-used.jpg',
    'Wheel Rim': '/images/parts/wheel-rim-used.jpg',
    'Headlight': '/images/parts/headlight-used.jpg',
    'A/C Control': '/images/parts/ac-control-used.jpg',
    'ABS Control Module': '/images/parts/abs-module-used.jpg',
    'Air Bag': '/images/parts/airbag-used.jpg',
    'Wiper Motor': '/images/parts/wiper-motor-used.jpg',
    'Radiator': '/images/parts/radiator-used.jpg',
    'Starter': '/images/parts/starter-used.jpg',
    'Seat': '/images/parts/seat-front-used.jpg',
    'Speedometer': '/images/parts/speedometer-used.jpg',
    'Radio': '/images/parts/speedometer-used.jpg',
    'Steering Column': '/images/parts/abs-module-used.jpg',
    'Steering Gear': '/images/parts/abs-module-used.jpg',
    'Spindle': '/images/parts/abs-module-used.jpg',
    'Seatbelt': '/images/parts/seat-front-used.jpg',
    'Flywheel': '/images/parts/engine-used.jpg',
    'Ignition Switch': '/images/parts/ac-control-used.jpg',
    'Lower Control Arm': '/images/parts/abs-module-used.jpg',
    'Engine Computer': '/images/parts/ac-control-used.jpg',
  }
  
  // Find matching key or return default
  for (const [key, value] of Object.entries(imageMap)) {
    if (partType.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return '/images/parts/engine-used.jpg'
}

// Apply 15% markup to price
function applyMarkup(price: number): number {
  return Math.round(price * 1.15 * 100) / 100
}

// Comprehensive Acura parts data with 15% price increase
export const ACURA_PARTS: AcuraPart[] = [
  // ═══════════════════════════════════════════════════════════════════
  // ENGINES — MDX, RDX, TLX, ILX
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-331",
    title: "Acura MDX 2020 Engine Electric (Hybrid), Rear 72HP",
    description: "Used OEM Engine for Acura MDX 2020 (electric (hybrid), rear (rear subframe mounted, 72HP)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(2729),
    originalPrice: 2729,
    image: getPartImage('Engine'),
    mpn: "ENG-2020-331",
    model: "MDX",
    year: "2020",
    partType: "Engine",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=331"
  },
  {
    id: "AAP-332",
    title: "Acura MDX 2020 Engine Gasoline, 3.0L AWD",
    description: "Used OEM Engine for Acura MDX 2020 (gasoline, 3.0L (VIN 7, 6th digit, AWD)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(2770),
    originalPrice: 2770,
    image: getPartImage('Engine'),
    mpn: "ENG-2020-332",
    model: "MDX",
    year: "2020",
    partType: "Engine",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=332"
  },
  {
    id: "AAP-333",
    title: "Acura MDX 2020 Engine Gasoline, 3.5L FWD",
    description: "Used OEM Engine for Acura MDX 2020 (gasoline, 3.5L, VIN 3 (6th digit, FWD)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(4460),
    originalPrice: 4460,
    image: getPartImage('Engine'),
    mpn: "ENG-2020-333",
    model: "MDX",
    year: "2020",
    partType: "Engine",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=333"
  },
  {
    id: "AAP-334",
    title: "Acura MDX 2020 Engine Gasoline, 3.5L AWD",
    description: "Used OEM Engine for Acura MDX 2020 (gasoline, 3.5L, VIN 4 (6th digit, AWD)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(4460),
    originalPrice: 4460,
    image: getPartImage('Engine'),
    mpn: "ENG-2020-334",
    model: "MDX",
    year: "2020",
    partType: "Engine",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=334"
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRANSMISSIONS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-335",
    title: "Acura MDX 2020 Transmission (AT), AWD Advance",
    description: "Used OEM Transmission for Acura MDX 2020 ((AT), AWD, Advance). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(3550),
    originalPrice: 3550,
    image: getPartImage('Transmission'),
    mpn: "TRA-2020-335",
    model: "MDX",
    year: "2020",
    partType: "Transmission",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=335"
  },
  {
    id: "AAP-336",
    title: "Acura MDX 2020 Transmission (AT), AWD Base",
    description: "Used OEM Transmission for Acura MDX 2020 ((AT), AWD, Base). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(3550),
    originalPrice: 3550,
    image: getPartImage('Transmission'),
    mpn: "TRA-2020-336",
    model: "MDX",
    year: "2020",
    partType: "Transmission",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=336"
  },
  {
    id: "AAP-337",
    title: "Acura MDX 2020 Transmission (AT), AWD Hybrid",
    description: "Used OEM Transmission for Acura MDX 2020 ((AT), AWD, Hybrid). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(1448),
    originalPrice: 1448,
    image: getPartImage('Transmission'),
    mpn: "TRA-2020-337",
    model: "MDX",
    year: "2020",
    partType: "Transmission",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=337"
  },
  {
    id: "AAP-338",
    title: "Acura MDX 2020 Transmission (AT), AWD Tech",
    description: "Used OEM Transmission for Acura MDX 2020 ((AT), AWD, Tech). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(3550),
    originalPrice: 3550,
    image: getPartImage('Transmission'),
    mpn: "TRA-2020-338",
    model: "MDX",
    year: "2020",
    partType: "Transmission",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=338"
  },
  {
    id: "AAP-339",
    title: "Acura MDX 2020 Transmission (AT), FWD",
    description: "Used OEM Transmission for Acura MDX 2020 ((AT), FWD). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(4525),
    originalPrice: 4525,
    image: getPartImage('Transmission'),
    mpn: "TRA-2020-339",
    model: "MDX",
    year: "2020",
    partType: "Transmission",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=339"
  },

  // ═══════════════════════════════════════════════════════════════════
  // WHEEL RIMS — MDX 2020
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2291701",
    title: "Acura MDX 2020 Wheel Rim 17x4 Steel Compact Spare",
    description: "Used OEM Wheel Rim for Acura MDX 2020 (17x4 (steel, compact spare)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(100),
    originalPrice: 100,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314114",
    model: "MDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314114"
  },
  {
    id: "AAP-2291702",
    title: "Acura MDX 2020 Wheel Rim 18x8 Alloy",
    description: "Used OEM Wheel Rim for Acura MDX 2020 (18x8 (alloy)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(391),
    originalPrice: 391,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314115",
    model: "MDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314115"
  },
  {
    id: "AAP-2291703",
    title: "Acura MDX 2020 Wheel Rim 20x8 Alloy Black",
    description: "Used OEM Wheel Rim for Acura MDX 2020 (20x8 (alloy) black). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(358),
    originalPrice: 358,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314116",
    model: "MDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314116"
  },
  {
    id: "AAP-2291705",
    title: "Acura MDX 2020 Wheel Rim 20x8 Alloy Machined Gasoline",
    description: "Used OEM Wheel Rim for Acura MDX 2020 (20x8 (alloy) machined face gasoline). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(391),
    originalPrice: 391,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314118",
    model: "MDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314118"
  },

  // ═══════════════════════════════════════════════════════════════════
  // HEADLIGHTS — RDX 2020
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2291732",
    title: "Acura RDX 2020 Headlight LED Adaptive Passenger Side",
    description: "Used OEM Headlight/Headlamp Assembly for Acura RDX 2020 (adaptive headlamps (LED) Passenger Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(1477),
    originalPrice: 1477,
    image: getPartImage('Headlight'),
    mpn: "HEA-2020-2314145",
    model: "RDX",
    year: "2020",
    partType: "Headlight",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314145"
  },
  {
    id: "AAP-2291733",
    title: "Acura RDX 2020 Headlight LED Adaptive Driver Side",
    description: "Used OEM Headlight/Headlamp Assembly for Acura RDX 2020 (adaptive headlamps (LED) Driver Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(1477),
    originalPrice: 1477,
    image: getPartImage('Headlight'),
    mpn: "HEA-2020-2314146",
    model: "RDX",
    year: "2020",
    partType: "Headlight",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314146"
  },

  // ═══════════════════════════════════════════════════════════════════
  // WHEEL RIMS — RDX 2020
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2291755",
    title: "Acura RDX 2020 Wheel Rim 17x4 Steel Compact Spare",
    description: "Used OEM Wheel Rim for Acura RDX 2020 (17x4 (steel, compact spare)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(129),
    originalPrice: 129,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314168",
    model: "RDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314168"
  },
  {
    id: "AAP-2291758",
    title: "Acura RDX 2020 Wheel Rim 19x8 Alloy Gray Advance",
    description: "Used OEM Wheel Rim for Acura RDX 2020 (19x8 (alloy) Without machined face painted gray (factory installed) Advance). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(423),
    originalPrice: 423,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314171",
    model: "RDX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314171"
  },

  // ═══════════════════════════════════════════════════════════════════
  // WHEEL RIMS — TLX 2020
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2291858",
    title: "Acura TLX 2020 Wheel Rim 17x4 Steel Compact Spare",
    description: "Used OEM Wheel Rim for Acura TLX 2020 (17x4 (steel, compact spare)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(129),
    originalPrice: 129,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314271",
    model: "TLX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314271"
  },
  {
    id: "AAP-2291860",
    title: "Acura TLX 2020 Wheel Rim 18x7-1/2 Chrome Dealer",
    description: "Used OEM Wheel Rim for Acura TLX 2020 (18x7-1/2 chrome (dealer installed)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(261),
    originalPrice: 261,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314273",
    model: "TLX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314273"
  },
  {
    id: "AAP-2291861",
    title: "Acura TLX 2020 Wheel Rim 18x7-1/2 Without Chrome",
    description: "Used OEM Wheel Rim for Acura TLX 2020 (18x7-1/2 Without chrome). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(228),
    originalPrice: 228,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314274",
    model: "TLX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314274"
  },
  {
    id: "AAP-2291863",
    title: "Acura TLX 2020 Wheel Rim 19x8 Machined Face",
    description: "Used OEM Wheel Rim for Acura TLX 2020 (19x8 dealer installed machined face with painted pockets). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(326),
    originalPrice: 326,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314276",
    model: "TLX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314276"
  },

  // ═══════════════════════════════════════════════════════════════════
  // WHEEL RIMS — ILX
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2312397",
    title: "Acura ILX 2021 Wiper Motor, Rear",
    description: "Used OEM Wiper Motor, Rear for Acura ILX 2021 (No). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(145),
    originalPrice: 145,
    image: getPartImage('Wiper Motor'),
    mpn: "WIP-2021-2334810",
    model: "ILX",
    year: "2021",
    partType: "Wiper Motor",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2334810"
  },
  {
    id: "AAP-2291807",
    title: "Acura ILX 2020 Wheel Rim 17x4 Steel Compact Spare",
    description: "Used OEM Wheel Rim for Acura ILX 2020 (17x4 (steel, compact spare)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(129),
    originalPrice: 129,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314220",
    model: "ILX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314220"
  },
  {
    id: "AAP-2291808",
    title: "Acura ILX 2020 Wheel Rim 17x7 Alloy Machined Y Spoke",
    description: "Used OEM Wheel Rim for Acura ILX 2020 (17x7 (alloy) machined face Y spoke (factory installed)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(306),
    originalPrice: 306,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2020-2314221",
    model: "ILX",
    year: "2020",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2314221"
  },
  {
    id: "AAP-2249555",
    title: "Acura ILX 2019 Wheel Rim 17x4 Steel Compact Spare",
    description: "Used OEM Wheel Rim for Acura ILX 2019 (17x4 (steel, compact spare)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(129),
    originalPrice: 129,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2019-2271968",
    model: "ILX",
    year: "2019",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271968"
  },
  {
    id: "AAP-2249556",
    title: "Acura ILX 2019 Wheel Rim 17x7 Alloy Machined Y Spoke",
    description: "Used OEM Wheel Rim for Acura ILX 2019 (17x7 (alloy) machined face Y spoke (factory installed)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(306),
    originalPrice: 306,
    image: getPartImage('Wheel Rim'),
    mpn: "WHE-2019-2271969",
    model: "ILX",
    year: "2019",
    partType: "Wheel Rim",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271969"
  },

  // ═══════════════════════════════════════════════════════════════════
  // A/C CONTROLS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249189",
    title: "Acura MDX 2019 A/C Control Front Dash",
    description: "Used OEM A/C Control for Acura MDX 2019 ((US market) front (dash)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(58),
    originalPrice: 58,
    image: getPartImage('A/C Control'),
    mpn: "ACC-2019-2271602",
    model: "MDX",
    year: "2019",
    partType: "A/C Control",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271602"
  },
  {
    id: "AAP-2249190",
    title: "Acura MDX 2019 A/C Control Rear Entertainment System",
    description: "Used OEM A/C Control for Acura MDX 2019 ((US market) rear (floor console) rear entertainment system). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(108),
    originalPrice: 108,
    image: getPartImage('A/C Control'),
    mpn: "ACC-2019-2271603",
    model: "MDX",
    year: "2019",
    partType: "A/C Control",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271603"
  },
  {
    id: "AAP-2249191",
    title: "Acura MDX 2019 A/C Control Rear Advance Hybrid",
    description: "Used OEM A/C Control for Acura MDX 2019 ((US market) rear (floor console) Without rear entertainment system Advance (includes hybrid)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(108),
    originalPrice: 108,
    image: getPartImage('A/C Control'),
    mpn: "ACC-2019-2271604",
    model: "MDX",
    year: "2019",
    partType: "A/C Control",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271604"
  },
  {
    id: "AAP-2249192",
    title: "Acura MDX 2019 A/C Control Rear Base",
    description: "Used OEM A/C Control for Acura MDX 2019 ((US market) rear (floor console) Without rear entertainment system Base). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(115),
    originalPrice: 115,
    image: getPartImage('A/C Control'),
    mpn: "ACC-2019-2271605",
    model: "MDX",
    year: "2019",
    partType: "A/C Control",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271605"
  },
  {
    id: "AAP-2249193",
    title: "Acura MDX 2019 A/C Control Rear Tech",
    description: "Used OEM A/C Control for Acura MDX 2019 ((US market) rear (floor console) Without rear entertainment system Tech). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(115),
    originalPrice: 115,
    image: getPartImage('A/C Control'),
    mpn: "ACC-2019-2271606",
    model: "MDX",
    year: "2019",
    partType: "A/C Control",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271606"
  },

  // ═══════════════════════════════════════════════════════════════════
  // ABS CONTROL MODULES — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249195",
    title: "Acura MDX 2019 ABS Control Module AWD 3.5L Advance",
    description: "Used OEM ABS Control Module/Pump for Acura MDX 2019 ((modulator assembly) AWD 3.5L park assist (Advance)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(397),
    originalPrice: 397,
    image: getPartImage('ABS Control Module'),
    mpn: "ABS-2019-2271608",
    model: "MDX",
    year: "2019",
    partType: "ABS Control Module",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271608"
  },
  {
    id: "AAP-2249196",
    title: "Acura MDX 2019 ABS Control Module AWD 3.5L Base",
    description: "Used OEM ABS Control Module/Pump for Acura MDX 2019 ((modulator assembly) AWD 3.5L Without park assist). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(378),
    originalPrice: 378,
    image: getPartImage('ABS Control Module'),
    mpn: "ABS-2019-2271609",
    model: "MDX",
    year: "2019",
    partType: "ABS Control Module",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271609"
  },
  {
    id: "AAP-2249197",
    title: "Acura MDX 2019 ABS Control Module FWD Advance",
    description: "Used OEM ABS Control Module/Pump for Acura MDX 2019 ((modulator assembly) FWD park assist (Advance)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(209),
    originalPrice: 209,
    image: getPartImage('ABS Control Module'),
    mpn: "ABS-2019-2271610",
    model: "MDX",
    year: "2019",
    partType: "ABS Control Module",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271610"
  },
  {
    id: "AAP-2249198",
    title: "Acura MDX 2019 ABS Control Module FWD Base",
    description: "Used OEM ABS Control Module/Pump for Acura MDX 2019 ((modulator assembly) FWD Without park assist). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(235),
    originalPrice: 235,
    image: getPartImage('ABS Control Module'),
    mpn: "ABS-2019-2271611",
    model: "MDX",
    year: "2019",
    partType: "ABS Control Module",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271611"
  },

  // ═══════════════════════════════════════════════════════════════════
  // AIR BAGS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249199",
    title: "Acura MDX 2019 Air Bag Driver Side Knee",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) Driver Side knee). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(443),
    originalPrice: 443,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271612",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271612"
  },
  {
    id: "AAP-2249200",
    title: "Acura MDX 2019 Air Bag Driver Side Roof",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) Driver Side roof). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(534),
    originalPrice: 534,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271613",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271613"
  },
  {
    id: "AAP-2249202",
    title: "Acura MDX 2019 Air Bag Driver Side Seat 3.5L",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) Driver Side seat 3.5L). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(430),
    originalPrice: 430,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271615",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271615"
  },
  {
    id: "AAP-2249203",
    title: "Acura MDX 2019 Air Bag Driver Side Wheel",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) Driver Side wheel). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(501),
    originalPrice: 501,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271616",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271616"
  },
  {
    id: "AAP-2249204",
    title: "Acura MDX 2019 Air Bag Passenger Dash",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) passenger dash). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(254),
    originalPrice: 254,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271617",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271617"
  },
  {
    id: "AAP-2249205",
    title: "Acura MDX 2019 Air Bag Passenger Roof",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) passenger roof). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(495),
    originalPrice: 495,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271618",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271618"
  },
  {
    id: "AAP-2249207",
    title: "Acura MDX 2019 Air Bag Passenger Seat 3.5L",
    description: "Used OEM Air Bag for Acura MDX 2019 ((front) passenger seat 3.5L). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(313),
    originalPrice: 313,
    image: getPartImage('Air Bag'),
    mpn: "AIR-2019-2271620",
    model: "MDX",
    year: "2019",
    partType: "Air Bag",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271620"
  },

  // ═══════════════════════════════════════════════════════════════════
  // ENGINE COMPUTERS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249296",
    title: "Acura MDX 2019 Engine Computer ECM Base FWD",
    description: "Used OEM Engine Computer/Control Unit for Acura MDX 2019 (Electronic Control Module (engine control, Passenger Side engine compartment, US market) Base FWD). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(176),
    originalPrice: 176,
    image: getPartImage('Engine Computer'),
    mpn: "ENG-2019-2271709",
    model: "MDX",
    year: "2019",
    partType: "Engine Computer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271709"
  },
  {
    id: "AAP-2249298",
    title: "Acura MDX 2019 Engine Computer ECM Tech AWD",
    description: "Used OEM Engine Computer/Control Unit for Acura MDX 2019 (Electronic Control Module (engine control, Passenger Side engine compartment, US market) Tech AWD). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(140),
    originalPrice: 140,
    image: getPartImage('Engine Computer'),
    mpn: "ENG-2019-2271711",
    model: "MDX",
    year: "2019",
    partType: "Engine Computer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271711"
  },
  {
    id: "AAP-2249300",
    title: "Acura MDX 2019 Engine Computer Fuel Injection",
    description: "Used OEM Engine Computer/Control Unit for Acura MDX 2019 (Fuel Injection Control (injector Driver Side, Passenger Side engine compartment)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(160),
    originalPrice: 160,
    image: getPartImage('Engine Computer'),
    mpn: "ENG-2019-2271713",
    model: "MDX",
    year: "2019",
    partType: "Engine Computer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271713"
  },

  // ═══════════════════════════════════════════════════════════════════
  // RADIATORS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249318",
    title: "Acura MDX 2019 Radiator Main",
    description: "Used OEM Radiator for Acura MDX 2019 (main). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(82),
    originalPrice: 82,
    image: getPartImage('Radiator'),
    mpn: "RAD-2019-2271731",
    model: "MDX",
    year: "2019",
    partType: "Radiator",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271731"
  },

  // ═══════════════════════════════════════════════════════════════════
  // RADIO / CD PLAYERS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249321",
    title: "Acura MDX 2019 Radio Amplifier Base",
    description: "Used OEM Radio / CD Player for Acura MDX 2019 (amplifier (center console) ID 39186TYRC01 (Base)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(293),
    originalPrice: 293,
    image: getPartImage('Radio'),
    mpn: "RAD-2019-2271734",
    model: "MDX",
    year: "2019",
    partType: "Radio",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271734"
  },
  {
    id: "AAP-2249323",
    title: "Acura MDX 2019 Radio Amplifier Tech RES",
    description: "Used OEM Radio / CD Player for Acura MDX 2019 (amplifier (center console) ID 39186TYRH01 (Tech, RES)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(280),
    originalPrice: 280,
    image: getPartImage('Radio'),
    mpn: "RAD-2019-2271736",
    model: "MDX",
    year: "2019",
    partType: "Radio",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271736"
  },
  {
    id: "AAP-2249328",
    title: "Acura MDX 2019 Radio Display Screen Lower",
    description: "Used OEM Radio / CD Player for Acura MDX 2019 (display screen dash mounted lower (radio display, US market) (ID 39541TZ6F63)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(586),
    originalPrice: 586,
    image: getPartImage('Radio'),
    mpn: "RAD-2019-2271741",
    model: "MDX",
    year: "2019",
    partType: "Radio",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271741"
  },
  {
    id: "AAP-2249330",
    title: "Acura MDX 2019 Radio Receiver Advance",
    description: "Used OEM Radio / CD Player for Acura MDX 2019 (receiver (behind display screen) (US market) Advance Without rear entertainment system). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(886),
    originalPrice: 886,
    image: getPartImage('Radio'),
    mpn: "RAD-2019-2271743",
    model: "MDX",
    year: "2019",
    partType: "Radio",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271743"
  },
  {
    id: "AAP-2249331",
    title: "Acura MDX 2019 Radio Receiver Base",
    description: "Used OEM Radio / CD Player for Acura MDX 2019 (receiver (behind display screen) (US market) Base). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(417),
    originalPrice: 417,
    image: getPartImage('Radio'),
    mpn: "RAD-2019-2271744",
    model: "MDX",
    year: "2019",
    partType: "Radio",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271744"
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEATS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249343",
    title: "Acura MDX 2019 Seat Front Electric Heated Driver",
    description: "Used OEM Seat, Front for Acura MDX 2019 ((electric) 3.5L heated Driver Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(385),
    originalPrice: 385,
    image: getPartImage('Seat'),
    mpn: "SEA-2019-2271756",
    model: "MDX",
    year: "2019",
    partType: "Seat",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271756"
  },
  {
    id: "AAP-2249344",
    title: "Acura MDX 2019 Seat Front Electric Heated Passenger",
    description: "Used OEM Seat, Front for Acura MDX 2019 ((electric) 3.5L heated Passenger Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(379),
    originalPrice: 379,
    image: getPartImage('Seat'),
    mpn: "SEA-2019-2271757",
    model: "MDX",
    year: "2019",
    partType: "Seat",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271757"
  },
  {
    id: "AAP-2249345",
    title: "Acura MDX 2019 Seat Front Electric Heated Cooled Driver",
    description: "Used OEM Seat, Front for Acura MDX 2019 ((electric) 3.5L heated and cooled Driver Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(262),
    originalPrice: 262,
    image: getPartImage('Seat'),
    mpn: "SEA-2019-2271758",
    model: "MDX",
    year: "2019",
    partType: "Seat",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271758"
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPEEDOMETERS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249354",
    title: "Acura MDX 2019 Speedometer Cluster MPH Advance AWD",
    description: "Used OEM Speedometer for Acura MDX 2019 ((cluster) MPH Advance AWD). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(313),
    originalPrice: 313,
    image: getPartImage('Speedometer'),
    mpn: "SPE-2019-2271767",
    model: "MDX",
    year: "2019",
    partType: "Speedometer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271767"
  },
  {
    id: "AAP-2249356",
    title: "Acura MDX 2019 Speedometer Cluster MPH Base FWD",
    description: "Used OEM Speedometer for Acura MDX 2019 ((cluster) MPH Base (FWD)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(267),
    originalPrice: 267,
    image: getPartImage('Speedometer'),
    mpn: "SPE-2019-2271769",
    model: "MDX",
    year: "2019",
    partType: "Speedometer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271769"
  },
  {
    id: "AAP-2249358",
    title: "Acura MDX 2019 Speedometer Cluster MPH Tech AWD",
    description: "Used OEM Speedometer for Acura MDX 2019 ((cluster) MPH Tech AWD). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(313),
    originalPrice: 313,
    image: getPartImage('Speedometer'),
    mpn: "SPE-2019-2271771",
    model: "MDX",
    year: "2019",
    partType: "Speedometer",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271771"
  },

  // ═══════════════════════════════════════════════════════════════════
  // STARTERS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249364",
    title: "Acura MDX 2019 Starter 3.0L Hybrid",
    description: "Used OEM Starter for Acura MDX 2019 (3.0L (Hybrid)). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(92),
    originalPrice: 92,
    image: getPartImage('Starter'),
    mpn: "STA-2019-2271777",
    model: "MDX",
    year: "2019",
    partType: "Starter",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271777"
  },
  {
    id: "AAP-2249365",
    title: "Acura MDX 2019 Starter 3.5L",
    description: "Used OEM Starter for Acura MDX 2019 (3.5L). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(58),
    originalPrice: 58,
    image: getPartImage('Starter'),
    mpn: "STA-2019-2271778",
    model: "MDX",
    year: "2019",
    partType: "Starter",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271778"
  },

  // ═══════════════════════════════════════════════════════════════════
  // STEERING COLUMNS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249366",
    title: "Acura MDX 2019 Steering Column Electric Rain Sensor Fog",
    description: "Used OEM Steering Column for Acura MDX 2019 ((electric power steering) rain sensor fog lamps). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(345),
    originalPrice: 345,
    image: getPartImage('Steering Column'),
    mpn: "STE-2019-2271779",
    model: "MDX",
    year: "2019",
    partType: "Steering Column",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271779"
  },
  {
    id: "AAP-2249367",
    title: "Acura MDX 2019 Steering Column Electric Rain Sensor",
    description: "Used OEM Steering Column for Acura MDX 2019 ((electric power steering) rain sensor Without fog lamps). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(209),
    originalPrice: 209,
    image: getPartImage('Steering Column'),
    mpn: "STE-2019-2271780",
    model: "MDX",
    year: "2019",
    partType: "Steering Column",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271780"
  },
  {
    id: "AAP-2249368",
    title: "Acura MDX 2019 Steering Column Electric Base",
    description: "Used OEM Steering Column for Acura MDX 2019 ((electric power steering) Without rain sensor). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(183),
    originalPrice: 183,
    image: getPartImage('Steering Column'),
    mpn: "STE-2019-2271781",
    model: "MDX",
    year: "2019",
    partType: "Steering Column",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271781"
  },

  // ═══════════════════════════════════════════════════════════════════
  // FLYWHEEL — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249302",
    title: "Acura MDX 2019 Flywheel Automatic Transmission 3.5L",
    description: "Used OEM Flywheel for Acura MDX 2019 ((Automatic Transmission) 3.5L). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(101),
    originalPrice: 101,
    image: getPartImage('Flywheel'),
    mpn: "FLY-2019-2271715",
    model: "MDX",
    year: "2019",
    partType: "Flywheel",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271715"
  },

  // ═══════════════════════════════════════════════════════════════════
  // IGNITION SWITCH — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249310",
    title: "Acura MDX 2019 Ignition Switch W/Key 3.5L",
    description: "Used OEM Ignition Switch W/Key for Acura MDX 2019 (3.5L). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(96),
    originalPrice: 96,
    image: getPartImage('Ignition Switch'),
    mpn: "IGN-2019-2271723",
    model: "MDX",
    year: "2019",
    partType: "Ignition Switch",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271723"
  },

  // ═══════════════════════════════════════════════════════════════════
  // LOWER CONTROL ARMS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249313",
    title: "Acura MDX 2019 Lower Control Arm Front 3.5L Driver",
    description: "Used OEM Lower Control Arm, Front for Acura MDX 2019 (3.5L Driver Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(167),
    originalPrice: 167,
    image: getPartImage('Lower Control Arm'),
    mpn: "LOW-2019-2271726",
    model: "MDX",
    year: "2019",
    partType: "Lower Control Arm",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271726"
  },
  {
    id: "AAP-2249314",
    title: "Acura MDX 2019 Lower Control Arm Front 3.5L Passenger",
    description: "Used OEM Lower Control Arm, Front for Acura MDX 2019 (3.5L Passenger Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(167),
    originalPrice: 167,
    image: getPartImage('Lower Control Arm'),
    mpn: "LOW-2019-2271727",
    model: "MDX",
    year: "2019",
    partType: "Lower Control Arm",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271727"
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEATBELTS — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249347",
    title: "Acura MDX 2019 Seatbelt Driver Side Buckle",
    description: "Used OEM Seatbelt for Acura MDX 2019 (Driver Side buckle). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(64),
    originalPrice: 64,
    image: getPartImage('Seatbelt'),
    mpn: "SEA-2019-2271760",
    model: "MDX",
    year: "2019",
    partType: "Seatbelt",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271760"
  },
  {
    id: "AAP-2249348",
    title: "Acura MDX 2019 Seatbelt Driver Side Retractor",
    description: "Used OEM Seatbelt for Acura MDX 2019 (Driver Side retractor). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(122),
    originalPrice: 122,
    image: getPartImage('Seatbelt'),
    mpn: "SEA-2019-2271761",
    model: "MDX",
    year: "2019",
    partType: "Seatbelt",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271761"
  },
  {
    id: "AAP-2249349",
    title: "Acura MDX 2019 Seatbelt Passenger Buckle",
    description: "Used OEM Seatbelt for Acura MDX 2019 (passenger buckle). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(64),
    originalPrice: 64,
    image: getPartImage('Seatbelt'),
    mpn: "SEA-2019-2271762",
    model: "MDX",
    year: "2019",
    partType: "Seatbelt",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271762"
  },
  {
    id: "AAP-2249350",
    title: "Acura MDX 2019 Seatbelt Passenger Retractor",
    description: "Used OEM Seatbelt for Acura MDX 2019 (passenger retractor). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(66),
    originalPrice: 66,
    image: getPartImage('Seatbelt'),
    mpn: "SEA-2019-2271763",
    model: "MDX",
    year: "2019",
    partType: "Seatbelt",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271763"
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPINDLES — MDX 2019
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "AAP-2249362",
    title: "Acura MDX 2019 Spindle 3.5L Driver Side",
    description: "Used OEM Spindle for Acura MDX 2019 (3.5L Driver Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(176),
    originalPrice: 176,
    image: getPartImage('Spindle'),
    mpn: "SPI-2019-2271775",
    model: "MDX",
    year: "2019",
    partType: "Spindle",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271775"
  },
  {
    id: "AAP-2249363",
    title: "Acura MDX 2019 Spindle 3.5L Passenger Side",
    description: "Used OEM Spindle for Acura MDX 2019 (3.5L Passenger Side). Recycled auto part from All Used Auto Parts. Professionally inspected. Verify VIN/fitment before shipping.",
    price: applyMarkup(241),
    originalPrice: 241,
    image: getPartImage('Spindle'),
    mpn: "SPI-2019-2271776",
    model: "MDX",
    year: "2019",
    partType: "Spindle",
    condition: "used",
    availability: "in_stock",
    link: "https://allusedautoparts.world/product.php?id=2271776"
  },
]

// Get unique models
export const ACURA_MODELS = [...new Set(ACURA_PARTS.map(p => p.model))].sort()

// Get unique part types
export const ACURA_PART_TYPES = [...new Set(ACURA_PARTS.map(p => p.partType))].sort()

// Get unique years
export const ACURA_YEARS = [...new Set(ACURA_PARTS.map(p => p.year))].sort((a, b) => Number(b) - Number(a))

// Get parts by model
export function getPartsByModel(model: string): AcuraPart[] {
  return ACURA_PARTS.filter(p => p.model === model)
}

// Get parts by type
export function getPartsByType(type: string): AcuraPart[] {
  return ACURA_PARTS.filter(p => p.partType === type)
}

// Get part by ID
export function getPartById(id: string): AcuraPart | undefined {
  return ACURA_PARTS.find(p => p.id === id)
}

// Total parts count
export const ACURA_PARTS_COUNT = ACURA_PARTS.length
