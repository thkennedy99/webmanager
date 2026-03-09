import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * POST /api/discount/validate
 * Validates a discount code and returns its details.
 * Body: { tenantId, code, customerEmail? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, code, customerEmail } = body

    if (!tenantId || !code) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId or code' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    const { docs } = await payload.find({
      collection: 'discount-codes',
      where: {
        code: { equals: code.toUpperCase() },
        tenant: { equals: Number(tenantId) },
        isActive: { equals: true },
      },
      limit: 1,
    })

    if (docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid discount code' },
        { status: 404 },
      )
    }

    const discount = docs[0] as unknown as {
      id: number
      code: string
      discountType: string
      value: number
      usesRemaining: number | null
      maxUsesPerCustomer: number
      validFrom: string | null
      validUntil: string | null
      minOrderAmount: number | null
    }

    const now = new Date()

    if (discount.validFrom && new Date(discount.validFrom) > now) {
      return NextResponse.json({ success: false, error: 'This code is not yet active' }, { status: 400 })
    }

    if (discount.validUntil && new Date(discount.validUntil) < now) {
      return NextResponse.json({ success: false, error: 'This code has expired' }, { status: 400 })
    }

    if (discount.usesRemaining !== null && discount.usesRemaining <= 0) {
      return NextResponse.json({ success: false, error: 'This code has been fully used' }, { status: 400 })
    }

    // Check per-customer usage limit
    if (customerEmail && discount.maxUsesPerCustomer) {
      const { totalDocs } = await payload.find({
        collection: 'transactions',
        where: {
          discountCode: { equals: discount.id },
          customerEmail: { equals: customerEmail },
          status: { in: ['succeeded', 'partially_refunded'] },
        },
        limit: 0,
      })

      if (totalDocs >= discount.maxUsesPerCustomer) {
        return NextResponse.json(
          { success: false, error: 'You have already used this code the maximum number of times' },
          { status: 400 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        code: discount.code,
        discountType: discount.discountType,
        value: discount.value,
        minOrderAmount: discount.minOrderAmount,
        description:
          discount.discountType === 'percentage'
            ? `${discount.value}% off`
            : `$${(discount.value / 100).toFixed(2)} off`,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to validate discount code' },
      { status: 500 },
    )
  }
}
