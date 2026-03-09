import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ExcelJS from 'exceljs'

/**
 * POST /api/video-grid/import
 * Imports video grid items from an Excel spreadsheet.
 *
 * Supports two column layouts:
 *   6-col: Title | Video URL | Platform | Year | Instruments | Location
 *   5-col (legacy): Title | Video URL | Year | Instruments | Location
 *
 * The header row is inspected to detect which layout is in use.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const tenantId = formData.get('tenantId') as string | null

    if (!file || !tenantId) {
      return NextResponse.json(
        { success: false, error: 'Missing file or tenantId' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) {
      return NextResponse.json(
        { success: false, error: 'No worksheet found in file' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: await config })
    const tid = Number(tenantId)

    // Detect column layout by inspecting the header row
    const headerRow = worksheet.getRow(1)
    const headers: string[] = []
    headerRow.eachCell({ includeEmpty: false }, (cell) => {
      headers.push(String(cell.value || '').trim().toLowerCase())
    })

    // Build a map of column name → 1-based column index
    const colIndex: Record<string, number> = {}
    headers.forEach((h, i) => {
      if (h.includes('title')) colIndex.title = i + 1
      else if (h.includes('url') || h.includes('video url')) colIndex.videoUrl = i + 1
      else if (h.includes('platform')) colIndex.platform = i + 1
      else if (h.includes('year')) colIndex.year = i + 1
      else if (h.includes('instrument')) colIndex.instruments = i + 1
      else if (h.includes('location')) colIndex.location = i + 1
    })

    // Fallback to positional detection if headers not found
    if (!colIndex.title) colIndex.title = 1
    if (!colIndex.videoUrl) colIndex.videoUrl = 2
    // If Platform column exists it shifts Year/Instruments/Location by 1
    const hasPlatformCol = !!colIndex.platform
    if (!colIndex.year) colIndex.year = hasPlatformCol ? 4 : 3
    if (!colIndex.instruments) colIndex.instruments = hasPlatformCol ? 5 : 4
    if (!colIndex.location) colIndex.location = hasPlatformCol ? 6 : 5

    // Pre-fetch existing instruments and locations for this tenant
    const [existingInstruments, existingLocations] = await Promise.all([
      payload.find({
        collection: 'video-grid-instruments',
        where: { tenant: { equals: tid } },
        limit: 500,
      }),
      payload.find({
        collection: 'video-grid-locations',
        where: { tenant: { equals: tid } },
        limit: 500,
      }),
    ])

    const instrumentMap = new Map<string, number>()
    for (const doc of existingInstruments.docs) {
      const d = doc as unknown as { id: number; name: string }
      instrumentMap.set(d.name.toLowerCase(), d.id)
    }

    const locationMap = new Map<string, number>()
    for (const doc of existingLocations.docs) {
      const d = doc as unknown as { id: number; name: string }
      locationMap.set(d.name.toLowerCase(), d.id)
    }

    let imported = 0
    let errors = 0
    const errorMessages: string[] = []

    interface ParsedRow {
      title: string
      videoUrl: string
      platform: string
      year: number | null
      instruments: string
      location: string
    }

    const rows: ParsedRow[] = []
    let isHeader = true

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (isHeader) {
        isHeader = false
        return
      }

      const title = String(row.getCell(colIndex.title).value || '').trim()
      const videoUrl = String(row.getCell(colIndex.videoUrl).value || '').trim()
      const platformVal = colIndex.platform
        ? String(row.getCell(colIndex.platform).value || '').trim().toLowerCase()
        : ''
      const yearVal = row.getCell(colIndex.year).value
      const year = typeof yearVal === 'number' ? yearVal : yearVal ? Number(yearVal) : null
      const instruments = String(row.getCell(colIndex.instruments).value || '').trim()
      const location = String(row.getCell(colIndex.location).value || '').trim()

      if (title && videoUrl) {
        rows.push({ title, videoUrl, platform: platformVal, year, instruments, location })
      }
    })

    for (const row of rows) {
      try {
        // Resolve instruments
        const instrumentIds: number[] = []
        if (row.instruments) {
          const names = row.instruments.split(',').map((n) => n.trim()).filter(Boolean)
          for (const name of names) {
            let id = instrumentMap.get(name.toLowerCase())
            if (!id) {
              const created = await payload.create({
                collection: 'video-grid-instruments',
                data: { name, tenant: tid } as never,
                overrideAccess: true,
              })
              id = created.id
              instrumentMap.set(name.toLowerCase(), id)
            }
            instrumentIds.push(id)
          }
        }

        // Resolve location
        let locationId: number | undefined
        if (row.location) {
          let id = locationMap.get(row.location.toLowerCase())
          if (!id) {
            const created = await payload.create({
              collection: 'video-grid-locations',
              data: { name: row.location, tenant: tid } as never,
              overrideAccess: true,
            })
            id = created.id
            locationMap.set(row.location.toLowerCase(), id)
          }
          locationId = id
        }

        // Detect platform — use explicit value from spreadsheet, or auto-detect from URL
        let platform: string | undefined
        if (row.platform === 'youtube' || row.platform === 'vimeo') {
          platform = row.platform
        } else if (row.videoUrl.includes('youtube.com') || row.videoUrl.includes('youtu.be')) {
          platform = 'youtube'
        } else if (row.videoUrl.includes('vimeo.com')) {
          platform = 'vimeo'
        }

        await payload.create({
          collection: 'video-grid-items',
          data: {
            title: row.title,
            videoUrl: row.videoUrl,
            platform,
            year: row.year || undefined,
            instruments: instrumentIds.length > 0 ? instrumentIds : undefined,
            location: locationId,
            useAutoThumbnail: true,
            tenant: tid,
          } as never,
          overrideAccess: true,
        })

        imported++
      } catch (err) {
        errors++
        errorMessages.push(`Row "${row.title}": ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        imported,
        errors,
        errorMessages: errorMessages.slice(0, 10),
        total: rows.length,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Import failed' },
      { status: 500 },
    )
  }
}
