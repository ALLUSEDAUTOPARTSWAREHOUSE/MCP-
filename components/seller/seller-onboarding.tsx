'use client'

import { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { upsertSellerProfile } from '@/app/actions/marketplace'
import { CheckCircle, AlertCircle } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Business Info', icon: '📋' },
  { id: 2, label: 'Contact Details', icon: '📞' },
  { id: 3, label: 'Stripe Setup', icon: '💳' },
  { id: 4, label: 'Review & Confirm', icon: '✓' },
]

export function SellerOnboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    businessType: 'individual',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    taxId: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setError(null)

    // Validate current step
    if (step === 1) {
      if (!formData.businessName) {
        setError('Business name is required')
        return
      }
    } else if (step === 2) {
      if (!formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setError('All contact details are required')
        return
      }
    }

    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await upsertSellerProfile(formData)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/seller')
        }, 2000)
      } else {
        setError(result.error || 'Failed to create seller profile')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Become a Seller</h1>
        <p className="text-lg text-muted-foreground">Start selling quality auto parts to thousands of buyers</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition ${
                  step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.id ? '✓' : s.id}
              </div>
              <p className="text-sm font-medium text-center">{s.label}</p>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-1 w-full mx-2 mt-6 mb-6 rounded transition ${
                    step > s.id ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ gridColumn: `span ${Math.floor((100 / (STEPS.length - 1)) / 25)}` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold text-green-700">Profile created successfully!</p>
            <p className="text-sm text-green-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">Business Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your business name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell buyers about your business"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="individual">Individual/Sole Proprietor</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">Contact Details</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Los Angeles"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="CA"
                  maxLength={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="90001"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        )}

        {/* Step 3: Stripe Setup */}
        {step === 3 && (
          <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">Tax Information</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You'll connect your Stripe account in the next step. This info is needed for tax compliance.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">Tax ID (EIN/SSN)</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="XX-XXXXXXX"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-700">
                <strong>Next:</strong> After completing this form, you'll be guided to connect your Stripe account to receive payments.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">Review Your Information</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Business Name:</span>
                <span className="font-semibold">{formData.businessName}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Business Type:</span>
                <span className="font-semibold capitalize">{formData.businessType}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-semibold">{formData.phone}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-semibold text-right">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">
                By clicking "Complete Setup", you agree to our Seller Terms of Service and confirm that all information is accurate.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between pt-6">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
