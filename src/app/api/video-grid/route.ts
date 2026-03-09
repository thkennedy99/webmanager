import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * GET /api/video-grid?tenantId=1&year=2024&instruments=1,2&location=3&page=1&limit=9
 * Returns video grid items with filtering.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  const year = request.nextUrl.searchParams.get('year')
  const instruments = request.nextUrl.searchParams.get('instruments')
  const location = request.nextUrl.searchParams.get('location')
  const page = Number(request.nextUrl.searchParams.get('page') || '1')
  const limit = Number(request.nextUrl.searchParams.get('limit') || '9')

  try {
    const payload = await getPayload({ config: await config })

    const where: Record<string, unknown> = {
      tenant: { equals: Number(tenantId) },
    }

    if (year) {
      where.year = { equals: Number(year) }
    }

    if (instruments) {
      const instrumentIds = instruments.split(',').map(Number)
      where.instruments = { in: instrumentIds }
    }

    if (location) {
      where.location = { equals: Number(location) }
    }

    const { docs, totalDocs, totalPages } = await payload.find({
      collection: 'video-grid-items',
      where: where as never,
      sort: 'sortOrder',
      limit,
      page,
      depth: 2,
    })

    // Also fetch filter options
    const [instrumentOptions, locationOptions] = await Promise.all([
      payload.find({
        collection: 'video-grid-instruments',
        where: { tenant: { equals: Number(tenantId) } },
        sort: 'name',
        limit: 100,
      }),
      payload.find({
        collection: 'video-grid-locations',
        where: { tenant: { equals: Number(tenantId) } },
        sort: 'name',
        limit: 100,
      }),
    ])

    // Get distinct years from existing videos
    const allVideos = await payload.find({
      collection: 'video-grid-items',
      where: { tenant: { equals: Number(tenantId) } },
      limit: 1000,
      depth: 0,
    })
    const years = [...new Set(
      allVideos.docs
        .map((v) => (v as unknown as { year?: number }).year)
        .filter((y): y is number => y !== undefined && y !== null),
    )].sort((a, b) => b - a)

    const items = docs.map((doc) => {
      const d = doc as unknown as {
        id: number
        title: string
        videoUrl: string
        platform: string
        year?: number
        instruments?: { id: number; name: string }[]
        location?: { id: number; name: string }
        useAutoThumbnail: boolean
        thumbnail?: { url: string; alt: string } | null
        sortOrder: number
      }

      let thumbnailUrl: string | null = null
      if (!d.useAutoThumbnail && d.thumbnail) {
        thumbnailUrl = d.thumbnail.url
      } else {
        thumbnailUrl = getAutoThumbnail(d.videoUrl, d.platform)
      }

      return {
        id: d.id,
        title: d.title,
        videoUrl: d.videoUrl,
        platform: d.platform,
        year: d.year,
        instruments: d.instruments?.map((i) => ({ id: i.id, name: i.name })) || [],
        location: d.location ? { id: d.location.id, name: d.location.name } : null,
        thumbnailUrl,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        items,
        totalDocs,
        totalPages,
        page,
        filters: {
          years,
          instruments: instrumentOptions.docs.map((d) => ({
            id: d.id,
            name: (d as unknown as { name: string }).name,
          })),
          locations: locationOptions.docs.map((d) => ({
            id: d.id,
            name: (d as unknown as { name: string }).name,
          })),
        },
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video grid' },
      { status: 500 },
    )
  }
}

function getAutoThumbnail(url: string, platform: string): string | null {
  if (platform === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url)
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
  // Vimeo thumbnails require an API call; return null and let the client handle it
  return null
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/v\/)([^?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
