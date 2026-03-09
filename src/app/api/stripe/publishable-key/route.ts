import { NextRequest, NextResponse } from 'next/server'
import { getStripePublishableKey } from '@/lib/stripe'

/**
 * GET /api/stripe/publishable-key?tenantId=1
 * Returns the Stripe publishable key for client-side use.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  try {
    const key = await getStripePublishableKey(tenantId)
    if (!key) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Stripe is not configured for this tenant',
      })
    }

    return NextResponse.json({ success: true, data: { publishableKey: key } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Stripe key' },
      { status: 500 },
    )
  }
}
