'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type SubscriptionGateProps = {
  tenantId: number | string
  requiredPlanTypes?: string[]
  gatedMessage?: string
  children: React.ReactNode
}

/**
 * Wraps page content that requires an active subscription.
 * Checks against a subscriber cookie (set during checkout/login).
 */
export default function SubscriptionGate({
  tenantId,
  requiredPlanTypes,
  gatedMessage,
  children,
}: SubscriptionGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    // Check for subscriber cookie
    const subscriberEmail = getSubscriberCookie()
    if (!subscriberEmail) {
      setHasAccess(false)
      return
    }

    // Verify subscription is still active
    const planTypeParam = requiredPlanTypes?.length
      ? `&planType=${requiredPlanTypes[0]}`
      : ''

    fetch(`/api/subscription/check?tenantId=${tenantId}&email=${encodeURIComponent(subscriberEmail)}${planTypeParam}`)
      .then((res) => res.json())
      .then((data) => {
        setHasAccess(data.data?.hasActiveSubscription === true)
      })
      .catch(() => setHasAccess(false))
  }, [tenantId, requiredPlanTypes])

  if (hasAccess === null) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="p-4 p-md-5 border rounded-3 bg-light">
              <h2 className="mb-3">Subscriber Content</h2>
              <p className="text-muted mb-4">
                {gatedMessage ||
                  'This content is available exclusively to subscribers. Sign up for a subscription to access this page and other premium content.'}
              </p>
              <Link href="/subscribe" className="btn btn-primary btn-lg">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function getSubscriberCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)subscriber_email=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}
