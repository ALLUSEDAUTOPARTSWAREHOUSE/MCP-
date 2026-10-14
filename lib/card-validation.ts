/**
 * Luhn algorithm for card number validation
 * Used to validate credit card, debit card numbers
 */
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  
  if (digits.length !== 16) {
    return false
  }

  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i])
    
    // Double every second digit
    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
  }
  
  return sum % 10 === 0
}

/**
 * Validate card expiry date (MM/YY format)
 */
export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  
  const [, month, year] = match
  const monthNum = parseInt(month)
  
  if (monthNum < 1 || monthNum > 12) return false
  
  const currentYear = new Date().getFullYear() % 100
  const currentMonth = new Date().getMonth() + 1
  const yearNum = parseInt(year)
  
  // Check if card is expired
  if (yearNum < currentYear) return false
  if (yearNum === currentYear && monthNum < currentMonth) return false
  
  return true
}

/**
 * Validate CVV (3-4 digits)
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

/**
 * Validate complete card details
 */
export function validateCardDetails(
  cardNumber: string,
  expiry: string,
  cvv: string
): { valid: boolean; error?: string } {
  if (!validateCardNumber(cardNumber)) {
    return { valid: false, error: 'Invalid card number' }
  }
  
  if (!validateExpiry(expiry)) {
    return { valid: false, error: 'Invalid or expired card' }
  }
  
  if (!validateCVV(cvv)) {
    return { valid: false, error: 'Invalid CVV' }
  }
  
  return { valid: true }
}

/**
 * Get card brand from number
 */
export function getCardBrand(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '')
  
  if (/^4/.test(number)) return 'VISA'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'American Express'
  if (/^6(?:011|5)/.test(number)) return 'Discover'
  
  return 'Unknown'
}

/**
 * Mask card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, '')
  const last4 = number.slice(-4)
  return `**** **** **** ${last4}`
}
