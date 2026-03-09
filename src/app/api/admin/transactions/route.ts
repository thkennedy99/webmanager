import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * GET /api/admin/transactions?tenantId=1
 * Returns transaction statistics and recent transactions for the admin dashboard.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: await config })

    // Fetch all succeeded transactions for revenue calc
    const { docs: allTransactions } = await payload.find({
      collection: 'transactions',
      where: {
        tenant: { equals: Number(tenantId) },
      },
      sort: '-createdAt',
      limit: 500,
    })

    const txList = allTransactions as unknown as {
      id: number
      type: string
      status: string
      amount: number
      refundedAmount: number
      currency: string
      description: string
      customerEmail: string
      customerName?: string
      createdAt: string
    }[]

    // Calculate stats
    let totalRevenue = 0
    let totalRefunds = 0
    let transactionCount = 0

    for (const tx of txList) {
      if (tx.type === 'refund') {
        totalRefunds += tx.amount
      } else if (tx.status === 'succeeded' || tx.status === 'partially_refunded') {
        totalRevenue += tx.amount
        transactionCount++
        if (tx.refundedAmount) {
          totalRefunds += tx.refundedAmount
        }
      }
    }

    // Active subscription count
    const { totalDocs: subscriptionCount } = await payload.find({
      collection: 'customer-subscriptions',
      where: {
        tenant: { equals: Number(tenantId) },
        status: { in: ['active', 'trialing'] },
      },
      limit: 0,
    })

    // Monthly revenue breakdown (last 12 months)
    const monthlyMap: Map<string, { revenue: number; count: number }> = new Map()
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, { revenue: 0, count: 0 })
    }

    for (const tx of txList) {
      if (tx.type === 'refund') continue
      if (tx.status !== 'succeeded' && tx.status !== 'partially_refunded') continue
      const date = new Date(tx.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const entry = monthlyMap.get(key)
      if (entry) {
        entry.revenue += tx.amount - (tx.refundedAmount || 0)
        entry.count++
      }
    }

    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      count: data.count,
    }))

    // Recent 20 transactions
    const recentTransactions = txList.slice(0, 20).map((tx) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      amount: tx.amount,
      refundedAmount: tx.refundedAmount,
      currency: tx.currency,
      description: tx.description,
      customerEmail: tx.customerEmail,
      customerName: tx.customerName,
      createdAt: tx.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue - totalRefunds,
        totalRefunds,
        transactionCount,
        subscriptionCount,
        recentTransactions,
        monthlyRevenue,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction data' },
      { status: 500 },
    )
  }
}
