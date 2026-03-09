'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

type AnalyticsData = {
  gaId: string
  period: string
  summary: {
    totalVisitors: number
    totalPageViews: number
    avgSessionDuration: string
    bounceRate: string
  }
  dailyVisitors: { date: string; visitors: number; pageViews: number }[]
  topPages: { path: string; pageViews: number; avgTimeOnPage: string }[]
  topLocations: { country: string; city: string; visitors: number }[]
  deviceBreakdown: { device: string; percentage: number }[]
}

export default function AnalyticsDashboard() {
  const { selectedTenantID } = useTenantSelection()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!selectedTenantID) return
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch(`/api/analytics?tenantId=${selectedTenantID}`)
      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Failed to load analytics')
      } else if (!json.data) {
        setMessage(json.message || 'No analytics data available')
      } else {
        setData(json.data)
      }
    } catch {
      setError('Failed to connect to analytics API')
    } finally {
      setLoading(false)
    }
  }, [selectedTenantID])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const maxVisitors = data
    ? Math.max(...data.dailyVisitors.map((d) => d.visitors), 1)
    : 1

  return (
    <div style={{ padding: '20px 24px', fontFamily: 'system-ui, sans-serif', maxWidth: 1200 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a2e' }}>
        Analytics Dashboard
      </h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
        Website traffic and visitor data
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          Loading analytics...
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

      {message && !data && !loading && (
        <div
          style={{
            padding: 24,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 6,
            color: '#135200',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}

      {data && !loading && (
        <>
          {/* GA ID badge */}
          <div style={{ marginBottom: 20, fontSize: 12, color: '#888' }}>
            GA4: {data.gaId} | Period: Last {data.period}
          </div>

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
              { label: 'Total Visitors', value: data.summary.totalVisitors.toLocaleString(), color: '#1A6B37' },
              { label: 'Page Views', value: data.summary.totalPageViews.toLocaleString(), color: '#F26522' },
              { label: 'Avg. Session', value: data.summary.avgSessionDuration, color: '#1a1a2e' },
              { label: 'Bounce Rate', value: data.summary.bounceRate, color: '#722ed1' },
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
                <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Visitor chart */}
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
              Daily Visitors (Last 30 Days)
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
                height: 160,
              }}
            >
              {data.dailyVisitors.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.visitors} visitors, ${day.pageViews} page views`}
                  style={{
                    flex: 1,
                    background: '#1A6B37',
                    borderRadius: '3px 3px 0 0',
                    height: `${(day.visitors / maxVisitors) * 100}%`,
                    minHeight: 4,
                    cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.7' }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1' }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#999' }}>
              <span>{data.dailyVisitors[0]?.date}</span>
              <span>{data.dailyVisitors[data.dailyVisitors.length - 1]?.date}</span>
            </div>
          </div>

          {/* Two-column grid: Top Pages + Top Locations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* Top Pages */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' }}>
                Top Pages
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Page</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', color: '#888', fontWeight: 600 }}>Views</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', color: '#888', fontWeight: 600 }}>Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page) => (
                    <tr key={page.path} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '8px 0', color: '#1A6B37', fontWeight: 500 }}>{page.path}</td>
                      <td style={{ textAlign: 'right', padding: '8px 0' }}>{page.pageViews}</td>
                      <td style={{ textAlign: 'right', padding: '8px 0', color: '#888' }}>{page.avgTimeOnPage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Locations */}
            <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' }}>
                Top Locations
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Location</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', color: '#888', fontWeight: 600 }}>Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topLocations.map((loc) => {
                    const maxLoc = data.topLocations[0]?.visitors || 1
                    return (
                      <tr key={`${loc.country}-${loc.city}`} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '8px 0' }}>
                          <div>{loc.city}</div>
                          <div style={{ fontSize: 11, color: '#999' }}>{loc.country}</div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                            <div
                              style={{
                                width: `${(loc.visitors / maxLoc) * 80}px`,
                                height: 8,
                                background: '#F26522',
                                borderRadius: 4,
                                opacity: 0.7,
                              }}
                            />
                            <span>{loc.visitors}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device breakdown */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a1a2e' }}>
              Device Breakdown
            </h3>
            <div style={{ display: 'flex', gap: 24 }}>
              {data.deviceBreakdown.map((item) => {
                const colors: Record<string, string> = { Desktop: '#1A6B37', Mobile: '#F26522', Tablet: '#722ed1' }
                return (
                  <div key={item.device} style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{item.device}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors[item.device] || '#333' }}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5 }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${item.percentage}%`,
                          background: colors[item.device] || '#333',
                          borderRadius: 5,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center' }}>
            Data is refreshed periodically. For real-time analytics, visit your Google Analytics dashboard directly.
          </p>
        </>
      )}
    </div>
  )
}
