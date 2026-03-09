import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * POST /api/mailing-list/subscribe
 * Public endpoint for mailing list signup from website forms.
 * Body: { tenantId, email, firstName?, lastName?, tags?, source? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, email, firstName, lastName, tags, source } = body

    if (!tenantId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId or email' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    // Check if already subscribed for this tenant
    const existing = await payload.find({
      collection: 'mailing-list-subscribers',
      where: {
        email: { equals: email },
        tenant: { equals: Number(tenantId) },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0] as unknown as { status: string; id: number }
      if (subscriber.status === 'unsubscribed') {
        // Re-subscribe
        await payload.update({
          collection: 'mailing-list-subscribers',
          id: subscriber.id,
          data: {
            status: 'active',
            subscribedAt: new Date().toISOString(),
          } as Record<string, unknown>,
        })
        return NextResponse.json({ success: true, data: { resubscribed: true } })
      }
      return NextResponse.json({ success: true, data: { alreadySubscribed: true } })
    }

    // Create new subscriber
    await payload.create({
      collection: 'mailing-list-subscribers',
      data: {
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        status: 'active',
        source: source || 'website',
        tags: tags || [],
        subscribedAt: new Date().toISOString(),
        tenant: Number(tenantId),
      } as never,
    })

    return NextResponse.json({ success: true, data: { subscribed: true } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 },
    )
  }
}
