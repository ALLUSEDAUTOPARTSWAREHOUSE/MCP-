'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { addBusinessDays, format } from 'date-fns'

const MERCHANT_ID = 5828832429

type SurveyOptions = {
  merchant_id: number
  order_id: string
  email: string
  delivery_country: string
  estimated_delivery_date: string
  opt_in_style: 'CENTER_DIALOG'
}

type GoogleReviewsWindow = Window & {
  merchantwidget?: {
    start: (options: {
      merchant_id: number
      position: 'LEFT_BOTTOM'
      region: 'US'
    }) => void
  }
  gapi?: {
    load: (module: string, callback: () => void) => void
    surveyoptin?: { render: (options: SurveyOptions) => void }
  }
}

export function GoogleCustomerReviewsBadge() {
  const started = useRef(false)

  function startBadge() {
    const google = window as GoogleReviewsWindow
    if (started.current || !google.merchantwidget) return

    try {
      google.merchantwidget.start({
        merchant_id: MERCHANT_ID,
        position: 'LEFT_BOTTOM',
        region: 'US',
      })
      started.current = true
    } catch {
      // A blocked third-party widget must never prevent shopping or checkout.
    }
  }

  return (
    <Script
      id="merchantWidgetScript"
      src="https://www.gstatic.com/shopping/merchant/merchantwidget.js"
      strategy="afterInteractive"
      onReady={startBadge}
    />
  )
}

export function GoogleCustomerReviewsOptIn({
  orderId,
  email,
}: {
  orderId: string
  email: string
}) {
  const [ready, setReady] = useState(false)
  // The current checkout is US-only; the shipping policy allows 7–14 working days.
  const [estimatedDeliveryDate] = useState(() => format(addBusinessDays(new Date(), 14), 'yyyy-MM-dd'))
  const renderedOrder = useRef<string | null>(null)
  const customerEmail = email.trim()
  const validOrder = Boolean(orderId && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))

  useEffect(() => {
    if (!ready || !validOrder || renderedOrder.current === orderId) return
    const google = window as GoogleReviewsWindow
    if (!google.gapi) return
    let active = true

    try {
      google.gapi.load('surveyoptin', () => {
        if (!active || !google.gapi?.surveyoptin || renderedOrder.current === orderId) return
        try {
          google.gapi.surveyoptin.render({
            merchant_id: MERCHANT_ID,
            order_id: orderId,
            email: customerEmail,
            delivery_country: 'US',
            estimated_delivery_date: estimatedDeliveryDate,
            opt_in_style: 'CENTER_DIALOG',
          })
          renderedOrder.current = orderId
        } catch {
          // The order is already saved even when Google cannot display its opt-in.
        }
      })
    } catch {
      // Script blockers must not disrupt the order confirmation.
    }

    return () => { active = false }
  }, [ready, validOrder, orderId, customerEmail, estimatedDeliveryDate])

  if (!validOrder) return null

  return (
    <Script
      id="google-customer-reviews-platform"
      src="https://apis.google.com/js/platform.js"
      strategy="afterInteractive"
      onReady={() => setReady(true)}
    />
  )
}
