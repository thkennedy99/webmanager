import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'

/**
 * POST /api/stripe/create-checkout
 * Creates a Stripe Checkout Session for one-time purchases or subscriptions.
 * Body: {
 *   tenantId, items: [{ productId, quantity, variantIndex? }],
 *   subscriptionPlanId?, discountCode?, customerEmail,
 *   successUrl, cancelUrl
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tenantId,
      items,
      subscriptionPlanId,
      discountCode,
      customerEmail,
      successUrl,
      cancelUrl,
    } = body

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
    }

    const stripe = await getStripeClient(tenantId)
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Stripe is not configured for this tenant' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    // Handle discount code validation
    let discountInfo: { id: number; discountType: string; value: number } | null = null
    if (discountCode) {
      const { docs: codes } = await payload.find({
        collection: 'discount-codes',
        where: {
          code: { equals: discountCode.toUpperCase() },
          tenant: { equals: Number(tenantId) },
          isActive: { equals: true },
        },
        limit: 1,
      })

      if (codes.length > 0) {
        const code = codes[0] as unknown as {
          id: number
          discountType: string
          value: number
          usesRemaining: number | null
          validFrom: string | null
          validUntil: string | null
        }
        const now = new Date()

        if (code.validFrom && new Date(code.validFrom) > now) {
          return NextResponse.json({ success: false, error: 'Discount code is not yet active' }, { status: 400 })
        }
        if (code.validUntil && new Date(code.validUntil) < now) {
          return NextResponse.json({ success: false, error: 'Discount code has expired' }, { status: 400 })
        }
        if (code.usesRemaining !== null && code.usesRemaining <= 0) {
          return NextResponse.json({ success: false, error: 'Discount code has been fully used' }, { status: 400 })
        }

        discountInfo = { id: code.id, discountType: code.discountType, value: code.value }
      } else {
        return NextResponse.json({ success: false, error: 'Invalid discount code' }, { status: 400 })
      }
    }

    // Subscription checkout
    if (subscriptionPlanId) {
      const plan = await payload.findByID({
        collection: 'subscription-plans',
        id: Number(subscriptionPlanId),
      })

      const planData = plan as unknown as {
        name: string
        stripePriceId: string | null
        price: number
        billingInterval: string
        trialDays: number
      }

      if (!planData.stripePriceId) {
        return NextResponse.json(
          { success: false, error: 'Subscription plan is not yet synced with Stripe' },
          { status: 400 },
        )
      }

      const sessionParams: Record<string, unknown> = {
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: customerEmail,
        line_items: [{ price: planData.stripePriceId, quantity: 1 }],
        success_url: successUrl || `${request.nextUrl.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${request.nextUrl.origin}/subscription/cancel`,
        metadata: {
          tenantId: String(tenantId),
          subscriptionPlanId: String(subscriptionPlanId),
          discountCodeId: discountInfo ? String(discountInfo.id) : '',
        },
        subscription_data: {
          metadata: {
            tenantId: String(tenantId),
            subscriptionPlanId: String(subscriptionPlanId),
          },
          ...(planData.trialDays > 0 ? { trial_period_days: planData.trialDays } : {}),
        },
      }

      const session = await stripe.checkout.sessions.create(sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0])

      return NextResponse.json({ success: true, data: { sessionId: session.id, url: session.url } })
    }

    // One-time purchase checkout
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items provided' }, { status: 400 })
    }

    const lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[] = []

    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: Number(item.productId),
      })

      const productData = product as unknown as {
        name: string
        price: number
        variants?: { label: string; priceOverride?: number }[]
      }

      let unitPrice = productData.price
      let productName = productData.name

      if (item.variantIndex !== undefined && productData.variants?.[item.variantIndex]) {
        const variant = productData.variants[item.variantIndex]
        if (variant.priceOverride) unitPrice = variant.priceOverride
        productName = `${productData.name} - ${variant.label}`
      }

      // Apply discount
      if (discountInfo) {
        if (discountInfo.discountType === 'percentage') {
          unitPrice = Math.round(unitPrice * (1 - discountInfo.value / 100))
        } else {
          unitPrice = Math.max(0, unitPrice - discountInfo.value)
        }
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: productName },
          unit_amount: unitPrice,
        },
        quantity: item.quantity || 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: successUrl || `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        tenantId: String(tenantId),
        discountCodeId: discountInfo ? String(discountInfo.id) : '',
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ success: true, data: { sessionId: session.id, url: session.url } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout creation failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
