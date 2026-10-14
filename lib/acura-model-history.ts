export const ACURA_MODEL_SLUGS = ['cl', 'ilx', 'integra', 'mdx', 'rdx', 'tl', 'tsx'] as const

export type AcuraModelSlug = (typeof ACURA_MODEL_SLUGS)[number]

export interface AcuraModelHistoryProfile {
  slug: AcuraModelSlug
  model: string
  yearRange: string
  vehicleType: string
  history: string[]
  ownershipContext: string
  mechanicFocus: string[]
}

const sharedMechanicChecks = [
  'Match the VIN, production date, engine or transmission code, drivetrain, and connector layout before ordering.',
  'Ask your installer to inspect seals, hoses, mounts, cooling components, sensors, and service items while access is open.',
  'Transfer required accessories only after comparing both assemblies; replace fluids and filters with manufacturer-specified products.',
  'Confirm whether immobilizer, control-module programming, calibration, or a relearn procedure is required before installation day.',
  'After installation, scan for codes, verify fluid levels and leaks, road-test under light load, and schedule an early recheck.',
]

export const ACURA_MODEL_HISTORY: Record<AcuraModelSlug, AcuraModelHistoryProfile> = {
  cl: {
    slug: 'cl', model: 'CL', yearRange: '1997–2003', vehicleType: 'luxury coupe',
    history: [
      'The Acura CL brought Honda-based engineering into a two-door premium format for two generations, first for 1997–1999 and again for 2001–2003.',
      'Because the CL has been out of production for years, complete used OEM assemblies can be a practical route when a vehicle-specific replacement is difficult to source new.',
    ],
    ownershipContext: 'CL buyers are often preserving a distinctive coupe rather than replacing the entire vehicle. A correctly matched used drivetrain assembly can keep that original Acura driving experience intact.',
    mechanicFocus: ['Pay special attention to generation, engine displacement, transmission type, emissions equipment, and axle or mount configuration.', ...sharedMechanicChecks],
  },
  ilx: {
    slug: 'ilx', model: 'ILX', yearRange: '2013–2022', vehicleType: 'compact luxury sedan',
    history: [
      'Introduced for the 2013 model year, the ILX served as Acura’s compact sedan through 2022, with powertrain and equipment changes across its production run.',
      'Used OEM ILX parts offer factory-origin dimensions and connection points, but year, engine, trim, and transmission details still need to be matched precisely.',
    ],
    ownershipContext: 'The ILX combines premium features with compact-car packaging, making repair with a properly identified used assembly an appealing alternative to taking on another vehicle payment.',
    mechanicFocus: ['Verify the exact engine family, transmission, emissions label, sensor package, and whether donor accessories must be transferred.', ...sharedMechanicChecks],
  },
  integra: {
    slug: 'integra', model: 'Integra', yearRange: '1986–2001; 2023–present', vehicleType: 'sport compact',
    history: [
      'The Integra established Acura’s sport-compact identity from 1986 through 2001, then returned for the 2023 model year as a modern liftback.',
      'Its long history includes very different generations and drivetrains, so the model name alone is never enough to establish interchange.',
    ],
    ownershipContext: 'Whether restoring an earlier Integra or repairing a modern daily driver, a verified used OEM part can preserve factory packaging and avoid gambling on a generic component.',
    mechanicFocus: ['Treat generation, engine code, manual or automatic transmission, OBD system, trim, and market specification as mandatory fitment checks.', ...sharedMechanicChecks],
  },
  mdx: {
    slug: 'mdx', model: 'MDX', yearRange: '2001–present', vehicleType: 'three-row luxury SUV',
    history: [
      'The MDX arrived for the 2001 model year and developed across multiple generations into Acura’s three-row luxury SUV.',
      'Generation changes brought different engines, transmissions, all-wheel-drive systems, electronics, and mounting details, making code-level verification essential.',
    ],
    ownershipContext: 'A well-equipped MDX represents substantial replacement value. Installing a properly matched used OEM assembly can return a familiar family SUV to service without paying for an entire replacement vehicle.',
    mechanicFocus: ['Confirm generation, engine and transmission code, 2WD or SH-AWD configuration, transfer components, harnesses, and cooling requirements.', ...sharedMechanicChecks],
  },
  rdx: {
    slug: 'rdx', model: 'RDX', yearRange: '2007–present', vehicleType: 'compact luxury SUV',
    history: [
      'Launched for 2007, the RDX has moved through distinct turbocharged and naturally aspirated eras before returning to turbo power in later generations.',
      'Those major engineering changes make the year range, engine family, transmission, drivetrain, and electronics critical when buying a used assembly.',
    ],
    ownershipContext: 'RDX owners can retain the size, features, and driving feel they already know by repairing the vehicle with a verified factory-origin part instead of starting over with another SUV.',
    mechanicFocus: ['Verify turbo or naturally aspirated configuration, drivetrain, engine and transmission codes, oil and coolant plumbing, sensors, and control requirements.', ...sharedMechanicChecks],
  },
  tl: {
    slug: 'tl', model: 'TL', yearRange: '1996–2014', vehicleType: 'luxury sport sedan',
    history: [
      'The TL was a central Acura sedan line from the 1996 model year through 2014, spanning several generations and multiple drivetrain combinations.',
      'Later TL generations added performance and all-wheel-drive variants, so visual similarity does not replace VIN and code verification.',
    ],
    ownershipContext: 'A clean TL remains a compelling, well-equipped sport sedan. A matched used OEM drivetrain can protect the value already invested in the chassis, interior, and maintenance history.',
    mechanicFocus: ['Confirm generation, displacement, transmission type, 2WD or SH-AWD layout, sensors, mounts, and ECU or immobilizer requirements.', ...sharedMechanicChecks],
  },
  tsx: {
    slug: 'tsx', model: 'TSX', yearRange: '2004–2014', vehicleType: 'compact sport sedan and wagon',
    history: [
      'Sold from the 2004 through 2014 model years, the TSX built its reputation as Acura’s compact sport sedan and later added a Sport Wagon.',
      'The two generations, four- and six-cylinder options, body styles, and transmission choices require more than a simple model-name match.',
    ],
    ownershipContext: 'The TSX balances premium equipment with an engaging chassis, and verified used OEM components can help preserve that combination at a sensible repair cost.',
    mechanicFocus: ['Verify generation, sedan or wagon body, four- or six-cylinder engine, transmission, emissions package, mounts, harnesses, and accessory layout.', ...sharedMechanicChecks],
  },
}

export const ACURA_MODEL_DIRECTORY = ACURA_MODEL_SLUGS.map((slug) => ({
  slug,
  label: `Acura ${ACURA_MODEL_HISTORY[slug].model}`,
  href: `/acura/${slug}`,
}))
