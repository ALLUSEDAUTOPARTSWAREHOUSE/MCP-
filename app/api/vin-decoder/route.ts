import { NextRequest, NextResponse } from 'next/server'

// Simple VIN decoder that extracts basic info from VIN
// Position guide:
// Positions 0-2: World Manufacturer Identifier (WMI)
// Position 3: Vehicle Type
// Position 8: Engine Code
// Position 9: Check digit
// Position 10: Model year
// Position 11: Assembly plant
// Positions 12-17: Sequential number

function decodeVin(vin: string) {
  if (!vin || vin.length !== 17) {
    return { error: 'Invalid VIN. Must be 17 characters.' }
  }

  // VIN format validation
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i
  if (!vinRegex.test(vin)) {
    return { error: 'Invalid VIN format.' }
  }

  const upperVin = vin.toUpperCase()
  
  // Extract manufacturer from first 3 characters
  const wmi = upperVin.substring(0, 3)
  
  // Extract model year (10th character)
  const modelYearChar = upperVin[9]
  const modelYearMap: { [key: string]: number } = {
    'Y': 2000, 'T': 1996, 'V': 1997, 'W': 1998, 'X': 1999,
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
    '6': 2006, '7': 2007, '8': 2008, '9': 2009, 'A': 2010,
    'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015,
    'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020,
    'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025,
  }
  const modelYear = modelYearMap[modelYearChar] || 2024

  // Manufacturer mapping (common manufacturers)
  const manufacturerMap: { [key: string]: string } = {
    '1G': 'General Motors',
    '1GC': 'General Motors - Chevrolet Trucks',
    '1GT': 'General Motors - GMC Trucks',
    '1GY': 'General Motors - Cadillac',
    'JH2': 'Honda - Motorcycle',
    'JHM': 'Honda - Auto',
    'JSA': 'Isuzu',
    'KL': 'Hyundai',
    'KN': 'Hyundai - Trucks',
    'KP': 'Kia',
    'LVV': 'Volvo',
    'MAT': 'Matsubishi',
    'MR': 'Mitsubishi',
    'NM': 'General Motors - China',
    'SAJ': 'Jaguar',
    'SAL': 'Land Rover',
    'SCC': 'Scion',
    'TMA': 'Toyota - USA',
    'TMB': 'Toyota - Canada',
    'TNT': 'Toyota - Indonesia',
    'VF': 'Peugeot, Citroën, Renault',
    'WBA': 'BMW',
    'WBX': 'BMW',
    'WVW': 'Volkswagen',
    'YV': 'Volvo',
    'ZAR': 'Aston Martin',
    'ZBE': 'Fairthorpe',
    'ZFF': 'Ferrari',
    'ZGE': 'Lotus',
    '1FA': 'Ford - USA',
    '2FA': 'Ford - Canada',
    '1FT': 'Ford - F-Series Trucks',
    '2FT': 'Ford - F-Series Trucks Canada',
    'AC': 'Acura',
    'JH': 'Honda',
    'JT': 'Toyota',
    'JN': 'Nissan',
    'MB': 'Mercedes-Benz',
    'SM': 'Subaru',
  }

  let manufacturer = manufacturerMap[wmi]
  if (!manufacturer) {
    // Try 2-character match
    manufacturer = manufacturerMap[wmi.substring(0, 2)]
  }

  return {
    vin: upperVin,
    modelYear,
    manufacturer,
    wmi,
    // These would be populated by a real VIN decoder API in production
    make: null,
    model: null,
    trim: null,
    engine: null,
    transmission: null,
    body: null,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { vin } = await request.json()

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN is required' },
        { status: 400 }
      )
    }

    const decoded = decodeVin(vin)

    if ('error' in decoded) {
      return NextResponse.json(
        decoded,
        { status: 400 }
      )
    }

    // In production, you would call a real VIN decoder API here
    // such as NHTSA, Edmunds, or others
    // For now, we return the basic decoded information

    return NextResponse.json(decoded)
  } catch (error) {
    console.error('[VIN Decoder Error]', error)
    return NextResponse.json(
      { error: 'Failed to decode VIN' },
      { status: 500 }
    )
  }
}
