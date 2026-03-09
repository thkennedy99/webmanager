'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

type Transaction = {
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
}

type TransactionStats = {
  totalRevenue: number
  totalRefunds: number
  transactionCount: number
  subscriptionCount: number
  recentTransactions: Transaction[]
  monthlyRevenue: { month: string; revenue: number; count: number }[]
}

export default function TransactionDashboard() {
  const { selectedTenantID } = useTenantSelection()
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!selectedTenantID) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/transactions?tenantId=${selectedTenantID}`)
      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Failed to load transaction data')
      } else {
        setStats(json.data)
      }
    } catch {
      setError('Failed to connect to transactions API')
    } finally {
      setLoading(false)
    }
  }, [selectedTenantID])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  const statusColor: Record<string, string> = {
    succeeded: '#1A6B37',
    pending: '#F26522',
    failed: '#cf1322',
    refunded: '#722ed1',
    partially_refunded: '#9254de',
    disputed: '#cf1322',
  }

  const typeLabel: Record<string, string> = {
    payment: 'Purchase',
    subscription: 'Subscription',
    refund: 'Refund',
    donation: 'Donation',
    tip: 'Tip',
  }

  return (
    <div style={{ padding: '20px 24px', fontFamily: 'system-ui, sans-serif', maxWidth: 1200 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a2e' }}>
        Transaction Dashboard
      </h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
        Revenue, payments, and subscription analytics
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          Loading transactions...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: 16,
            background: '#fff3f3',
            border: '1px solid #ffccc7',
            borderRadius: 6,
            color: '#cf1322',
          }}
        >
          {error}
        </div>
      )}

      {stats && !loading && (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {[
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#1A6B37' },
              { label: 'Total Refunds', value: formatCurrency(stats.totalRefunds), color: '#722ed1' },
              { label: 'Transactions', value: stats.transactionCount.toString(), color: '#F26522' },
              { label: 'Active Subscriptions', value: stats.subscriptionCount.toString(), color: '#1a1a2e' },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: '#fff',
                  border: '1px solid #e8e8e8',
                  borderRadius: 8,
                  padding: '20px 24px',
                  borderTop: `3px solid ${card.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  {card.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Monthly revenue chart */}
          {stats.monthlyRevenue.length > 0 && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' }}>
                Monthly Revenue
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 180 }}>
                {(() => {
                  const maxRev = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1)
                  return stats.monthlyRevenue.map((month) => (
                    <div
                      key={month.month}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div
                        title={`${month.month}: ${formatCurrency(month.revenue)} (${month.count} txns)`}
                        style={{
                          width: '100%',
                          maxWidth: 60,
                          background: '#1A6B37',
                          borderRadius: '4px 4px 0 0',
                          height: `${(month.revenue / maxRev) * 140}px`,
                          minHeight: 4,
                          cursor: 'pointer',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.target as HTMLElement).style.opacity = '0.7'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.target as HTMLElement).style.opacity = '1'
                        }}
                      />
                      <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{month.month}</div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          )}

          {/* Recent transactions table */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e8e8e8',
              borderRadius: 8,
              padding: 24,
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' }}>
              Recent Transactions
            </h3>
            {stats.recentTransactions.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>
                No transactions yet
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Description</th>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Type</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', color: '#888', fontWeight: 600 }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: '8px 0', color: '#888', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '8px 0', color: '#666' }}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '8px 0', fontWeight: 500 }}>{tx.description}</td>
                      <td style={{ padding: '8px 0', color: '#666' }}>{tx.customerEmail}</td>
                      <td style={{ padding: '8px 0' }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: '#f0f0f0',
                          }}
                        >
                          {typeLabel[tx.type] || tx.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: 600 }}>
                        {tx.type === 'refund' ? '-' : ''}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px 0' }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 4,
                            color: '#fff',
                            background: statusColor[tx.status] || '#666',
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
