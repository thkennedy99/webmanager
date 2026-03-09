import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ExcelJS from 'exceljs'

/**
 * POST /api/video-grid/import
 * Imports video grid items from an Excel spreadsheet.
 * Columns: Title, Video URL, Year, Instruments (comma-separated), Location
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

    // Skip header row
    worksheet.eachRow({ includeEmpty: false }, async () => {})

    const rows: { title: string; videoUrl: string; year: number | null; instruments: string; location: string }[] = []
    let isHeader = true

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (isHeader) {
        isHeader = false
        return
      }

      const title = String(row.getCell(1).value || '').trim()
      const videoUrl = String(row.getCell(2).value || '').trim()
      const yearVal = row.getCell(3).value
      const year = typeof yearVal === 'number' ? yearVal : yearVal ? Number(yearVal) : null
      const instruments = String(row.getCell(4).value || '').trim()
      const location = String(row.getCell(5).value || '').trim()

      if (title && videoUrl) {
        rows.push({ title, videoUrl, year, instruments, location })
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
              // Create new instrument
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

        // Detect platform
        let platform: string | undefined
        if (row.videoUrl.includes('youtube.com') || row.videoUrl.includes('youtu.be')) {
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
