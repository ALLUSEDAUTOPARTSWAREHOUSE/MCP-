'use client'

import { useCartStore } from '@/lib/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Check, ArrowLeft, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BrandLogosSection } from '@/components/brand-logos'
import { useRouter } from 'next/navigation'
import { AddressAutocomplete } from '@/components/address-autocomplete'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  
  const [orderNumber, setOrderNumber] = useState('')
  const [step, setStep] = useState<'customer' | 'shipping' | 'vehicle' | 'payment' | 'review' | 'confirmation'>('customer')
  const [formData, setFormData] = useState({
    // Customer Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Billing Address
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingLat: 0,
    billingLng: 0,
    // Shipping Address
    sameAsBilling: true,
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingLat: 0,
    shippingLng: 0,
    // Vehicle Details
    vin: '',
    year: '',
    make: '',
    model: '',
    trim: '',
    engine: '',
    transmission: '',
    mileage: '',
    nickname: '',
    // Payment Details
    paymentMethod: 'credit_card',
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Generate order number on mount
  useEffect(() => {
    const num = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    setOrderNumber(num)
  }, [])

  const totalPrice = getTotalPrice()
  const shipping = items.reduce((total, item) => total + (item.shippingCost ?? 0) * item.quantity, 0)
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateCard = (cardNumber: string, expiry: string, cvv: string): boolean => {
    setCardError('')
    // Luhn algorithm for card validation
    const digits = cardNumber.replace(/\D/g, '')
    if (digits.length !== 16) {
      setCardError('Card number must be 16 digits')
      return false
    }
    let sum = 0
    for (let i = 0; i < digits.length; i++) {
      let digit = parseInt(digits[i])
      if (i % 2 === 0) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
    }
    if (sum % 10 !== 0) {
      setCardError('Invalid card number')
      return false
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setCardError('Expiry must be MM/YY')
      return false
    }
    if (cvv.length !== 3 && cvv.length !== 4) {
      setCardError('CVV must be 3-4 digits')
      return false
    }
    return true
  }

  const handleCustomerSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.billingAddress) {
      setStep('shipping')
    }
  }

  const handleShippingSubmit = () => {
    if (!formData.sameAsBilling) {
      if (formData.shippingAddress && formData.shippingCity && formData.shippingState && formData.shippingZip) {
        setStep('vehicle')
      }
    } else {
      setStep('vehicle')
    }
  }

  const handleVehicleSubmit = () => {
    if (formData.vin && formData.year && formData.make && formData.model) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = () => {
    if (!validateCard(formData.cardNumber, formData.expiryDate, formData.cvv)) {
      return
    }
    setStep('review')
  }

  const handleReviewSubmit = async () => {
    setIsProcessing(true)
    try {
      // Create order with all details
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          formData,
          cartItems: items,
          totalAmount: finalTotal,
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')

      const data = await response.json()
      setSuccessMessage(`Order ${orderNumber} created successfully! Confirmation sent to ${formData.email}`)
      clearCart()
      setIsProcessing(false)
      setStep('confirmation')
    } catch (error) {
      console.error('[v0] Order error:', error)
      setCardError('Failed to create order. Please try again.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <>
        <Navbar />
        <main className="pt-[58px]">
          <div className="py-12 pb-20">
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-foreground/60 mb-8">Add some parts before checking out</p>
              <Link href="/parts">
                <Button size="lg">Continue Shopping</Button>
              </Link>
            </div>
          </div>
          <BrandLogosSection />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-[58px]">
        <div className="relative bg-cover bg-center py-20 sm:py-28 border-b border-border/20 mb-12" style={{ backgroundImage: "linear-gradient(to bottom right, rgba(13,15,22,0.82), rgba(13,15,22,0.60), rgba(13,15,22,0.88)), url('/images/heroes/hero-warehouse.png')" }}>
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/cart" className="inline-flex items-center gap-2 text-slate-200 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">Checkout</h1>
          {orderNumber && <p className="text-slate-300">Order: <strong>{orderNumber}</strong></p>}
        </div>
      </div>
        <div className="pb-20">
        <div className="mx-auto max-w-4xl px-4">

          {step === 'confirmation' ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Order Submitted Successfully!</h2>
              <p className="text-foreground/60 mb-4">{successMessage}</p>
              <p className="text-sm text-foreground/60 mb-8">We have not charged anything yet. Check your email for next steps.</p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                <p className="text-sm text-foreground/60 mb-2">Order Number</p>
                <p className="text-2xl font-bold mb-6">{orderNumber}</p>
                <p className="text-sm text-foreground/60 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-blue-400">${finalTotal.toFixed(2)}</p>
                <p className="text-sm text-foreground/60 mt-4">Confirmation sent to: <strong>{formData.email}</strong></p>
              </div>

              {/* Create profile prompt — lets the customer track this order and see history */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-lg font-bold mb-2">Track Your Order</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Create a free profile to track this order, view your order history, and save your searches and comparisons.
                </p>
                <Link href={`/sign-up?redirect=/dashboard/orders`}>
                  <Button size="lg" className="w-full">Create My Profile</Button>
                </Link>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/parts">
                  <Button size="lg" variant="outline">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">Back Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout form */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Step 1: Customer Details */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['customer'].includes(step) ? 'bg-blue-500 text-white' : ['shipping', 'vehicle', 'payment', 'review'].includes(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-foreground/60'}`}>1</div>
                      <h2 className="text-xl font-bold">Customer Details</h2>
                    </div>

                    {step === 'customer' && (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                          <Input placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <Input placeholder="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        <Input placeholder="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <AddressAutocomplete
                          label="Billing Address"
                          onAddressSelect={(address) => {
                            setFormData(prev => ({
                              ...prev,
                              billingAddress: address.street,
                              billingCity: address.city,
                              billingState: address.state,
                              billingZip: address.zip,
                              billingLat: address.lat ?? 0,
                              billingLng: address.lng ?? 0,
                            }))
                          }}
                        />
                        <Button size="lg" className="w-full" onClick={handleCustomerSubmit}>Continue to Shipping</Button>
                      </div>
                    )}
                    {step !== 'customer' && (
                      <div className="text-sm text-foreground/60 space-y-1">
                        <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Shipping Address */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['shipping'].includes(step) ? 'bg-blue-500 text-white' : ['vehicle', 'payment', 'review'].includes(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-foreground/60'}`}>2</div>
                      <h2 className="text-xl font-bold">Shipping Address</h2>
                    </div>

                    {step === 'shipping' && (
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.sameAsBilling}
                            onChange={(e) => setFormData(prev => ({ ...prev, sameAsBilling: e.target.checked }))}
                          />
                          Same as billing address
                        </label>
                        {!formData.sameAsBilling && (
                          <>
                            <AddressAutocomplete
                              label="Shipping Address"
                              onAddressSelect={(address) => {
                                setFormData(prev => ({
                                  ...prev,
                                  shippingAddress: address.street,
                                  shippingCity: address.city,
                                  shippingState: address.state,
                                  shippingZip: address.zip,
                                  shippingLat: address.lat ?? 0,
                                  shippingLng: address.lng ?? 0,
                                }))
                              }}
                            />
                          </>
                        )}
                        <div className="flex gap-4">
                          <Button size="lg" variant="outline" onClick={() => setStep('customer')}>Back</Button>
                          <Button size="lg" className="flex-1" onClick={handleShippingSubmit}>Continue to Vehicle</Button>
                        </div>
                      </div>
                    )}
                    {step !== 'shipping' && (
                      <div className="text-sm text-foreground/60">
                        <p>{formData.sameAsBilling ? 'Same as billing' : `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`}</p>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Vehicle Details */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['vehicle'].includes(step) ? 'bg-blue-500 text-white' : ['payment', 'review'].includes(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-foreground/60'}`}>3</div>
                      <h2 className="text-xl font-bold">Vehicle Details</h2>
                    </div>

                    {step === 'vehicle' && (
                      <div className="space-y-4">
                        <Input placeholder="VIN (Vehicle ID Number)" name="vin" value={formData.vin} onChange={handleInputChange} />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input placeholder="Year" name="year" value={formData.year} onChange={handleInputChange} />
                          <Input placeholder="Make" name="make" value={formData.make} onChange={handleInputChange} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input placeholder="Model" name="model" value={formData.model} onChange={handleInputChange} />
                          <Input placeholder="Trim" name="trim" value={formData.trim} onChange={handleInputChange} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input placeholder="Engine" name="engine" value={formData.engine} onChange={handleInputChange} />
                          <Input placeholder="Transmission" name="transmission" value={formData.transmission} onChange={handleInputChange} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input placeholder="Mileage" name="mileage" value={formData.mileage} onChange={handleInputChange} />
                          <Input placeholder="Nickname (e.g. My Car)" name="nickname" value={formData.nickname} onChange={handleInputChange} />
                        </div>
                        <div className="flex gap-4">
                          <Button size="lg" variant="outline" onClick={() => setStep('shipping')}>Back</Button>
                          <Button size="lg" className="flex-1" onClick={handleVehicleSubmit}>Continue to Payment</Button>
                        </div>
                      </div>
                    )}
                    {step !== 'vehicle' && (
                      <div className="text-sm text-foreground/60 space-y-1">
                        <p><strong>{formData.year} {formData.make} {formData.model}</strong></p>
                        <p>VIN: {formData.vin}</p>
                      </div>
                    )}
                  </div>

                  {/* Step 4: Payment Details */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['payment'].includes(step) ? 'bg-blue-500 text-white' : ['review'].includes(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-foreground/60'}`}>4</div>
                      <h2 className="text-xl font-bold">Payment Method</h2>
                    </div>

                    {step === 'payment' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['credit_card', 'debit_card', 'paypal', 'bank_transfer'].map(method => (
                            <button
                              key={method}
                              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                              className={`p-3 rounded-lg border-2 transition-all ${formData.paymentMethod === method ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}
                            >
                              <span className="text-xs font-semibold capitalize">{method.replace('_', ' ')}</span>
                            </button>
                          ))}
                        </div>
                        {formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card' ? (
                          <>
                            <Input placeholder="Cardholder Name" name="cardHolder" value={formData.cardHolder} onChange={handleInputChange} />
                            <Input placeholder="Card Number (16 digits)" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} maxLength={16} />
                            <div className="grid sm:grid-cols-2 gap-4">
                              <Input placeholder="MM/YY" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} maxLength={5} />
                              <Input placeholder="CVV" name="cvv" value={formData.cvv} onChange={handleInputChange} maxLength={4} type="password" />
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-foreground/60">{formData.paymentMethod.toUpperCase()} payment will be processed separately</p>
                        )}
                        {cardError && (
                          <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {cardError}
                          </div>
                        )}
                        <div className="flex gap-4">
                          <Button size="lg" variant="outline" onClick={() => setStep('vehicle')}>Back</Button>
                          <Button size="lg" className="flex-1" onClick={handlePaymentSubmit}>Review Order</Button>
                        </div>
                      </div>
                    )}
                    {step !== 'payment' && (
                      <div className="text-sm text-foreground/60">
                        <p>Method: <strong>{formData.paymentMethod.toUpperCase()}</strong></p>
                      </div>
                    )}
                  </div>

                  {/* Step 5: Review */}
                  {step === 'review' && (
                    <div className="p-6 border border-blue-500/50 rounded-lg bg-blue-500/10">
                      <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-sm text-foreground/60">Customer</p>
                          <p className="font-semibold">{formData.firstName} {formData.lastName} • {formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Billing Address</p>
                          <p className="font-semibold">{formData.billingAddress} • {formData.billingCity}, {formData.billingState} {formData.billingZip}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Vehicle</p>
                          <p className="font-semibold">{formData.year} {formData.make} {formData.model} (VIN: {formData.vin})</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button size="lg" variant="outline" onClick={() => setStep('payment')}>Back</Button>
                        <Button size="lg" className="flex-1" onClick={handleReviewSubmit} disabled={isProcessing}>
                          {isProcessing ? 'Processing...' : 'Submit Order'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="h-fit sticky top-32">
                <div className="p-6 border border-white/10 rounded-lg bg-white/5 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground/60">{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Shipping</span>
                      <span className={shipping > 0 ? '' : 'text-green-400'}>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-400">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
