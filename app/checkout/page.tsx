'use client'

import { useCartStore } from '@/lib/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { BrandLogosSection } from '@/components/brand-logos'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  
  const [step, setStep] = useState<'auth' | 'shipping' | 'payment' | 'confirmation'>('auth')
  const [isGuest, setIsGuest] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = getTotalPrice()
  const shipping = items.reduce((total, item) => total + (item.shippingCost ?? 0) * item.quantity, 0)
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email && formData.address && formData.city && formData.state && formData.zipCode) {
      setStep('payment' as const)
    }
  }

  const handlePaymentSubmit = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    clearCart()
    setStep('confirmation')
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
          </div>
        </div>
        <div className="pb-20">
        <div className="mx-auto max-w-4xl px-4">

          {step === 'auth' ? (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Checkout as:</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setStep('shipping')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-6 text-base font-semibold"
                >
                  Sign In to Account
                </Button>
                <Button
                  onClick={() => {
                    setIsGuest(true)
                    setStep('shipping')
                  }}
                  variant="outline"
                  className="flex-1 py-6 text-base font-semibold"
                >
                  Continue as Guest
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/sign-up">
                  <Button variant="ghost" className="w-full justify-start text-blue-400 hover:text-blue-300">
                    New to AUAPW? Create Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          {step === 'confirmation' ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-foreground/60 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
                <p className="text-sm text-foreground/60 mb-2">Order Number</p>
                <p className="text-2xl font-bold mb-6">ORD-{Date.now()}</p>
                <p className="text-sm text-foreground/60 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-blue-400">${finalTotal.toFixed(2)}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link href="/parts">
                  <Button size="lg">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    Back Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout form */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Shipping Info */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'shipping' || step === 'payment' ? 'bg-blue-500 text-white' : 'bg-white/10 text-foreground/60'}`}>
                        1
                      </div>
                      <h2 className="text-xl font-bold">Shipping Information</h2>
                    </div>

                    {step === 'shipping' && (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Input
                          placeholder="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <Input
                          placeholder="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        <Input
                          placeholder="Street Address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="City"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="State"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Input
                          placeholder="ZIP Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                        <Button size="lg" className="w-full" onClick={handleShippingSubmit}>
                          Continue to Payment
                        </Button>
                      </div>
                    )}

                    {step === 'payment' && (
                      <div className="text-sm text-foreground/60 space-y-1">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step !== 'shipping' ? 'bg-blue-500 text-white' : 'bg-white/10 text-foreground/60'}`}>
                        2
                      </div>
                      <h2 className="text-xl font-bold">Payment Information</h2>
                    </div>

                    {step === 'payment' && (
                      <div className="space-y-4">
                        <Input
                          placeholder="Card Number"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="MM/YY"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="CVV"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handlePaymentSubmit}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Complete Order'}
                        </Button>
                      </div>
                    )}

                  </div>
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
