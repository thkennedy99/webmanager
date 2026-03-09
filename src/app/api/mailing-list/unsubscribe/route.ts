import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * POST /api/mailing-list/unsubscribe
 * Body: { tenantId, email }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, email } = body

    if (!tenantId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId or email' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })

    const existing = await payload.find({
      collection: 'mailing-list-subscribers',
      where: {
        email: { equals: email },
        tenant: { equals: Number(tenantId) },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ success: true, data: { message: 'Email not found' } })
    }

    const subscriber = existing.docs[0]
    await payload.update({
      collection: 'mailing-list-subscribers',
      id: subscriber.id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      } as never,
    })

    return NextResponse.json({ success: true, data: { unsubscribed: true } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 },
    )
  }
}
