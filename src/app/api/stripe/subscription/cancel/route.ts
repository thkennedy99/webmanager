import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'

/**
 * POST /api/stripe/subscription/cancel
 * Cancel a subscription (at period end by default).
 * Body: { tenantId, subscriptionId, immediate?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, subscriptionId, immediate } = body

    if (!tenantId || !subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId or subscriptionId' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    const sub = await payload.findByID({
      collection: 'customer-subscriptions',
      id: Number(subscriptionId),
    })

    const subData = sub as unknown as { stripeSubscriptionId: string }
    if (!subData.stripeSubscriptionId) {
      return NextResponse.json(
        { success: false, error: 'No Stripe subscription ID found' },
        { status: 400 },
      )
    }

    const stripe = await getStripeClient(tenantId)
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Stripe is not configured for this tenant' },
        { status: 400 },
      )
    }

    if (immediate) {
      await stripe.subscriptions.cancel(subData.stripeSubscriptionId)
      await payload.update({
        collection: 'customer-subscriptions',
        id: Number(subscriptionId),
        data: {
          status: 'canceled',
          canceledAt: new Date().toISOString(),
        } as never,
      })
    } else {
      await stripe.subscriptions.update(subData.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
      await payload.update({
        collection: 'customer-subscriptions',
        id: Number(subscriptionId),
        data: {
          cancelAtPeriodEnd: true,
        } as never,
      })
    }

    return NextResponse.json({
      success: true,
      data: { canceled: immediate ? 'immediately' : 'at_period_end' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cancellation failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
