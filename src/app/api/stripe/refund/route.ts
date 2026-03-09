import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'

/**
 * POST /api/stripe/refund
 * Admin-only endpoint to issue refunds.
 * Body: { tenantId, transactionId, amount? (partial refund in cents) }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, transactionId, amount } = body

    if (!tenantId || !transactionId) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId or transactionId' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    // Fetch the transaction
    const transaction = await payload.findByID({
      collection: 'transactions',
      id: Number(transactionId),
    })

    const txData = transaction as unknown as {
      stripePaymentIntentId?: string
      stripeChargeId?: string
      amount: number
      refundedAmount: number
      status: string
    }

    if (txData.status === 'refunded') {
      return NextResponse.json(
        { success: false, error: 'Transaction has already been fully refunded' },
        { status: 400 },
      )
    }

    if (!txData.stripePaymentIntentId && !txData.stripeChargeId) {
      return NextResponse.json(
        { success: false, error: 'No Stripe payment reference found on this transaction' },
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

    const refundAmount = amount || (txData.amount - txData.refundedAmount)
    const maxRefundable = txData.amount - txData.refundedAmount

    if (refundAmount > maxRefundable) {
      return NextResponse.json(
        { success: false, error: `Maximum refundable amount is ${maxRefundable} cents` },
        { status: 400 },
      )
    }

    // Create refund in Stripe
    const refundParams: Record<string, unknown> = {
      amount: refundAmount,
    }

    if (txData.stripePaymentIntentId) {
      refundParams.payment_intent = txData.stripePaymentIntentId
    } else if (txData.stripeChargeId) {
      refundParams.charge = txData.stripeChargeId
    }

    const refund = await stripe.refunds.create(refundParams as Parameters<typeof stripe.refunds.create>[0])

    // The charge.refunded webhook will handle updating the transaction record
    // But we can also optimistically update here for faster UI feedback
    const newRefundedTotal = txData.refundedAmount + refundAmount
    await payload.update({
      collection: 'transactions',
      id: Number(transactionId),
      data: {
        refundedAmount: newRefundedTotal,
        status: newRefundedTotal >= txData.amount ? 'refunded' : 'partially_refunded',
      } as never,
    })

    return NextResponse.json({
      success: true,
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Refund failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
