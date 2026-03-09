import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * GET /api/subscription/check?tenantId=1&email=user@example.com&planType=premium
 * Checks if a customer has an active subscription.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  const email = request.nextUrl.searchParams.get('email')
  const planType = request.nextUrl.searchParams.get('planType')

  if (!tenantId || !email) {
    return NextResponse.json(
      { success: false, error: 'Missing tenantId or email' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config: await config })

    const { docs } = await payload.find({
      collection: 'customer-subscriptions',
      where: {
        customerEmail: { equals: email },
        tenant: { equals: Number(tenantId) },
        status: { in: ['active', 'trialing'] },
      },
      limit: 10,
      depth: 1,
    })

    if (docs.length === 0) {
      return NextResponse.json({
        success: true,
        data: { hasActiveSubscription: false },
      })
    }

    // If planType specified, check if any active subscription matches
    if (planType) {
      const matchingSub = docs.find((doc) => {
        const plan = doc.plan as unknown as { planType?: string } | null
        return plan?.planType === planType
      })

      return NextResponse.json({
        success: true,
        data: {
          hasActiveSubscription: !!matchingSub,
          matchingPlanType: planType,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { hasActiveSubscription: true },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to check subscription' },
      { status: 500 },
    )
  }
}
