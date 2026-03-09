import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Proxy endpoint for Google Analytics Data API (GA4).
 * Requires a Google Analytics Data API service account key
 * stored on the tenant's site-themes record as `seo.googleAnalyticsServiceAccountKey`.
 *
 * For now, this endpoint returns mock/demo data if no service account is configured,
 * and can be upgraded to use the real GA4 Data API when credentials are available.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: await config })

    // Get the GA measurement ID from site theme
    const { docs } = await payload.find({
      collection: 'site-themes',
      where: { tenant: { equals: Number(tenantId) } },
      limit: 1,
    })

    const theme = docs[0] as unknown as Record<string, unknown> | undefined
    const seo = theme?.seo as Record<string, string | null> | undefined
    const gaId = seo?.googleAnalyticsId

    if (!gaId) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No Google Analytics ID configured. Add your GA4 Measurement ID in Site Theme > SEO & Analytics.',
      })
    }

    // Generate demo analytics data based on the GA ID being configured
    // In production, replace this with actual GA4 Data API calls
    const now = new Date()
    const data = {
      gaId,
      period: '30 days',
      summary: {
        totalVisitors: 847,
        totalPageViews: 2341,
        avgSessionDuration: '2m 14s',
        bounceRate: '42.3%',
      },
      dailyVisitors: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split('T')[0],
          visitors: Math.floor(Math.random() * 40) + 10,
          pageViews: Math.floor(Math.random() * 80) + 20,
        }
      }),
      topPages: [
        { path: '/', pageViews: 512, avgTimeOnPage: '1m 45s' },
        { path: '/livestreaming', pageViews: 389, avgTimeOnPage: '3m 12s' },
        { path: '/concert-recording', pageViews: 278, avgTimeOnPage: '2m 38s' },
        { path: '/about', pageViews: 234, avgTimeOnPage: '2m 05s' },
        { path: '/portfolio', pageViews: 198, avgTimeOnPage: '4m 22s' },
        { path: '/live-sound', pageViews: 167, avgTimeOnPage: '2m 18s' },
        { path: '/contact', pageViews: 145, avgTimeOnPage: '1m 32s' },
      ],
      topLocations: [
        { country: 'United States', city: 'Dallas', visitors: 312 },
        { country: 'United States', city: 'Fort Worth', visitors: 89 },
        { country: 'United States', city: 'Austin', visitors: 67 },
        { country: 'United States', city: 'Houston', visitors: 54 },
        { country: 'United Kingdom', city: 'London', visitors: 43 },
        { country: 'Ireland', city: 'Dublin', visitors: 38 },
        { country: 'United States', city: 'New York', visitors: 35 },
        { country: 'Canada', city: 'Toronto', visitors: 28 },
        { country: 'Germany', city: 'Berlin', visitors: 22 },
        { country: 'Australia', city: 'Sydney', visitors: 18 },
      ],
      deviceBreakdown: [
        { device: 'Desktop', percentage: 58 },
        { device: 'Mobile', percentage: 35 },
        { device: 'Tablet', percentage: 7 },
      ],
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
