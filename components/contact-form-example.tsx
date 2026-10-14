'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AddressAutocomplete } from './address-autocomplete'
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  addressDetails?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
    lat?: number
    lng?: number
  }
  subject: string
  message: string
}

export function ContactFormExample() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (details: {
    street: string
    city: string
    state: string
    zip: string
    country: string
    lat?: number
    lng?: number
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: details?.street ?? '',
      addressDetails: details,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Submit contact form to database
      const contactResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          addressDetails: formData.addressDetails,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (!contactResponse.ok) {
        throw new Error('Failed to submit contact form')
      }

      const contactData = await contactResponse.json()

      // 2. Trigger notification (this happens automatically via the API,
      // but you could also trigger it explicitly from the server)
      console.log('[ContactForm] Contact form submitted successfully')
      console.log('[ContactForm] Notification will be sent to configured recipients')

      toast.success('Thank you! We received your message and will get back to you soon.')

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('[ContactForm] Error submitting form:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit contact form. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Contact Us
        </CardTitle>
        <CardDescription>
          Fill out this form and we&apos;ll get back to you as soon as possible. A notification
          will be sent to our team immediately.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              disabled={loading}
            />
          </div>

          {/* Address with Google Maps Autocomplete */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              Address (with suggestions)
            </label>
            <AddressAutocomplete
              onAddressSelect={handleAddressChange}
              placeholder="Start typing an address..."
              className="disabled:opacity-50"
            />
            {formData.addressDetails && (
              <div className="mt-2 p-3 bg-muted rounded text-xs space-y-1">
                <p>
                  <strong>Street:</strong> {formData.addressDetails.street}
                </p>
                <p>
                  <strong>City:</strong> {formData.addressDetails.city},{' '}
                  {formData.addressDetails.state} {formData.addressDetails.zip}
                </p>
                {formData.addressDetails.lat && (
                  <p>
                    <strong>Coordinates:</strong> {formData.addressDetails.lat.toFixed(4)},{' '}
                    {formData.addressDetails.lng?.toFixed(4)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What is this regarding?"
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us more about your inquiry..."
              rows={5}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            ✉️ When you submit this form, a notification will be sent to our team with all your
            details including your selected address from Google Maps.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
