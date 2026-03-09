import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifyWebhookSignature } from '@/lib/stripe'
import type Stripe from 'stripe'

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events for payment success/failure, subscription updates, refunds.
 * The tenantId is embedded in payment metadata.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ success: false, error: 'Missing stripe-signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  // We need to determine the tenant from the event metadata.
  // First, try to parse the event without verification to get tenantId,
  // then verify with the tenant's specific webhook secret.
  let rawEvent: { data: { object: { metadata?: Record<string, string> } } }
  try {
    rawEvent = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const metadata = rawEvent?.data?.object?.metadata
  const tenantId = metadata?.tenantId

  if (!tenantId) {
    // Could be a global webhook — use STRIPE_WEBHOOK_SECRET from env
    const globalSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!globalSecret) {
      return NextResponse.json({ success: false, error: 'No webhook secret configured' }, { status: 400 })
    }
    try {
      const event = verifyWebhookSignature(rawBody, signature, globalSecret)
      await handleEvent(event)
      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ success: false, error: 'Webhook signature verification failed' }, { status: 400 })
    }
  }

  // Get tenant-specific webhook secret
  const payload = await getPayload({ config: await config })
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: Number(tenantId),
    depth: 0,
  })

  const tenantData = tenant as unknown as Record<string, unknown>
  const webhookSecret = (tenantData.stripeWebhookSecret as string) || process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ success: false, error: 'No webhook secret for tenant' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = verifyWebhookSignature(rawBody, signature, webhookSecret)
  } catch {
    return NextResponse.json({ success: false, error: 'Webhook signature verification failed' }, { status: 400 })
  }

  await handleEvent(event, Number(tenantId))
  return NextResponse.json({ success: true })
}

/** Extract period timestamps from a subscription (handles API version differences) */
function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  // In newer Stripe API versions, period data may be on items rather than the subscription root
  const raw = subscription as unknown as Record<string, unknown>
  const start = raw.current_period_start as number | undefined
  const end = raw.current_period_end as number | undefined

  // Fallback: try to get from first subscription item
  if (!start || !end) {
    const items = subscription.items?.data?.[0]
    const itemRaw = items as unknown as Record<string, unknown> | undefined
    return {
      start: itemRaw?.current_period_start as number | undefined,
      end: itemRaw?.current_period_end as number | undefined,
    }
  }

  return { start, end }
}

async function handleEvent(event: Stripe.Event, tenantId?: number) {
  const payload = await getPayload({ config: await config })

  switch (event.type) {
    // ── One-time payment succeeded ──
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const tid = tenantId || Number(session.metadata?.tenantId)
      if (!tid) break

      if (session.mode === 'payment') {
        await payload.create({
          collection: 'transactions',
          data: {
            type: 'payment',
            status: 'succeeded',
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            description: `Order #${session.id.slice(-8)}`,
            customerEmail: session.customer_details?.email || session.customer_email || 'unknown',
            customerName: session.customer_details?.name || undefined,
            stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
            discountCode: session.metadata?.discountCodeId ? Number(session.metadata.discountCodeId) : undefined,
            metadata: { sessionId: session.id, items: session.metadata?.items },
            tenant: tid,
          } as never,
        })

        // Decrement discount code uses
        if (session.metadata?.discountCodeId) {
          const codeId = Number(session.metadata.discountCodeId)
          const code = await payload.findByID({ collection: 'discount-codes', id: codeId })
          const codeData = code as unknown as { usesRemaining: number | null }
          if (codeData.usesRemaining !== null) {
            await payload.update({
              collection: 'discount-codes',
              id: codeId,
              data: { usesRemaining: Math.max(0, codeData.usesRemaining - 1) } as never,
            })
          }
        }

        // Add to mailing list if opted in (checkout metadata)
        if (session.customer_details?.email && session.metadata?.mailingListOptIn === 'true') {
          const email = session.customer_details.email
          const existing = await payload.find({
            collection: 'mailing-list-subscribers',
            where: { email: { equals: email }, tenant: { equals: tid } },
            limit: 1,
          })
          if (existing.docs.length === 0) {
            await payload.create({
              collection: 'mailing-list-subscribers',
              data: {
                email,
                firstName: session.customer_details.name?.split(' ')[0],
                lastName: session.customer_details.name?.split(' ').slice(1).join(' '),
                status: 'active',
                source: 'checkout',
                tenant: tid,
              } as never,
            })
          }
        }
      }
      break
    }

    // ── Subscription created ──
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription
      const tid = tenantId || Number(subscription.metadata?.tenantId)
      if (!tid) break

      const planId = subscription.metadata?.subscriptionPlanId
      const period = getSubscriptionPeriod(subscription)
      const subRaw = subscription as unknown as Record<string, unknown>

      await payload.create({
        collection: 'customer-subscriptions',
        data: {
          customerEmail: (subRaw.customer_email as string) || 'unknown',
          plan: planId ? Number(planId) : undefined,
          status: subscription.status,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
          currentPeriodStart: period.start ? new Date(period.start * 1000).toISOString() : undefined,
          currentPeriodEnd: period.end ? new Date(period.end * 1000).toISOString() : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : undefined,
          tenant: tid,
        } as never,
      })
      break
    }

    // ── Subscription updated (renewals, status changes) ──
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const period = getSubscriptionPeriod(subscription)

      const { docs } = await payload.find({
        collection: 'customer-subscriptions',
        where: { stripeSubscriptionId: { equals: subscription.id } },
        limit: 1,
      })

      if (docs.length > 0) {
        await payload.update({
          collection: 'customer-subscriptions',
          id: docs[0].id,
          data: {
            status: subscription.status,
            currentPeriodStart: period.start ? new Date(period.start * 1000).toISOString() : undefined,
            currentPeriodEnd: period.end ? new Date(period.end * 1000).toISOString() : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : undefined,
          } as never,
        })
      }
      break
    }

    // ── Subscription deleted ──
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      const { docs } = await payload.find({
        collection: 'customer-subscriptions',
        where: { stripeSubscriptionId: { equals: subscription.id } },
        limit: 1,
      })

      if (docs.length > 0) {
        await payload.update({
          collection: 'customer-subscriptions',
          id: docs[0].id,
          data: {
            status: 'canceled',
            canceledAt: new Date().toISOString(),
          } as never,
        })
      }
      break
    }

    // ── Invoice payment succeeded (subscription renewal) ──
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const invoiceRaw = invoice as unknown as Record<string, unknown>
      const subDetails = invoiceRaw.subscription_details as Record<string, unknown> | undefined
      const subMeta = subDetails?.metadata as Record<string, string> | undefined
      const tid = tenantId || Number(invoice.metadata?.tenantId || subMeta?.tenantId)
      if (!tid) break

      if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_create') {
        await payload.create({
          collection: 'transactions',
          data: {
            type: 'subscription',
            status: 'succeeded',
            amount: invoice.amount_paid,
            currency: invoice.currency,
            description: `Subscription payment - ${invoice.lines?.data?.[0]?.description || 'Recurring'}`,
            customerEmail: invoice.customer_email || 'unknown',
            customerName: invoice.customer_name || undefined,
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: typeof invoiceRaw.payment_intent === 'string' ? invoiceRaw.payment_intent as string : undefined,
            tenant: tid,
          } as never,
        })
      }
      break
    }

    // ── Invoice payment failed ──
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const invRaw = invoice as unknown as Record<string, unknown>
      const failSubDetails = invRaw.subscription_details as Record<string, unknown> | undefined
      const failSubMeta = failSubDetails?.metadata as Record<string, string> | undefined
      const tid = tenantId || Number(invoice.metadata?.tenantId || failSubMeta?.tenantId)
      if (!tid) break

      await payload.create({
        collection: 'transactions',
        data: {
          type: 'subscription',
          status: 'failed',
          amount: invoice.amount_due,
          currency: invoice.currency,
          description: `Failed payment - ${invoice.lines?.data?.[0]?.description || 'Recurring'}`,
          customerEmail: invoice.customer_email || 'unknown',
          stripeInvoiceId: invoice.id,
          tenant: tid,
        } as never,
      })
      break
    }

    // ── Refund completed ──
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const tid = tenantId || Number(charge.metadata?.tenantId)
      if (!tid) break

      const refundedAmount = charge.amount_refunded

      // Find and update the original transaction
      const { docs: txDocs } = await payload.find({
        collection: 'transactions',
        where: { stripeChargeId: { equals: charge.id } },
        limit: 1,
      })

      if (txDocs.length > 0) {
        const tx = txDocs[0] as unknown as { amount: number }
        await payload.update({
          collection: 'transactions',
          id: txDocs[0].id,
          data: {
            status: refundedAmount >= tx.amount ? 'refunded' : 'partially_refunded',
            refundedAmount,
          } as never,
        })
      }

      // Create a refund transaction record
      await payload.create({
        collection: 'transactions',
        data: {
          type: 'refund',
          status: 'succeeded',
          amount: refundedAmount,
          currency: charge.currency,
          description: `Refund for charge ${charge.id.slice(-8)}`,
          customerEmail: charge.billing_details?.email || 'unknown',
          stripeChargeId: charge.id,
          tenant: tid,
        } as never,
      })
      break
    }
  }
}
