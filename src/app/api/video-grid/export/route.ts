import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ExcelJS from 'exceljs'

/**
 * GET /api/video-grid/export?tenantId=1&empty=true
 * Exports video grid items as Excel.
 * ?empty=true returns an empty template with headers only.
 *
 * Columns: Title | Video URL | Platform | Year | Instruments | Location
 * Platform & Location are single-select dropdowns.
 * Instruments is a comma-separated multi-select with dropdown hints.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  const empty = request.nextUrl.searchParams.get('empty') === 'true'

  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: await config })
    const tid = Number(tenantId)

    // Fetch instruments and locations for dropdown lists
    const [instrumentDocs, locationDocs] = await Promise.all([
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

    const instrumentNames = instrumentDocs.docs
      .map((d) => (d as unknown as { name: string }).name)
      .sort((a, b) => a.localeCompare(b))
    const locationNames = locationDocs.docs
      .map((d) => (d as unknown as { name: string }).name)
      .sort((a, b) => a.localeCompare(b))

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Video Grid Manager'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Video Grid')

    // Define columns (6 columns now — Platform added)
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Video URL', key: 'videoUrl', width: 50 },
      { header: 'Platform', key: 'platform', width: 14 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Instruments', key: 'instruments', width: 40 },
      { header: 'Location', key: 'location', width: 25 },
    ]

    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A6B37' },
    }

    // Add data rows when exporting (not template)
    if (!empty) {
      const { docs } = await payload.find({
        collection: 'video-grid-items',
        where: { tenant: { equals: tid } },
        sort: 'sortOrder',
        limit: 5000,
        depth: 2,
      })

      for (const doc of docs) {
        const d = doc as unknown as {
          title: string
          videoUrl: string
          platform?: string
          year?: number
          instruments?: { name: string }[]
          location?: { name: string }
        }

        worksheet.addRow({
          title: d.title,
          videoUrl: d.videoUrl,
          platform: d.platform || '',
          year: d.year || '',
          instruments: d.instruments?.map((i) => i.name).join(', ') || '',
          location: d.location?.name || '',
        })
      }
    }

    // Apply data validation (dropdowns) to data rows 2–1001
    const lastDataRow = 1001

    // Platform dropdown (column C = 3)
    for (let r = 2; r <= lastDataRow; r++) {
      worksheet.getCell(r, 3).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"YouTube,Vimeo"'],
        showErrorMessage: true,
        errorTitle: 'Invalid Platform',
        error: 'Please select YouTube or Vimeo.',
      }
    }

    // Location dropdown (column F = 6) — from existing locations
    if (locationNames.length > 0) {
      const locationList = locationNames.join(',')
      for (let r = 2; r <= lastDataRow; r++) {
        worksheet.getCell(r, 6).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${locationList}"`],
          showErrorMessage: false,
        }
      }
    }

    // Instruments hint dropdown (column E = 5) — shows known instruments but
    // allows free-text entry since multiple comma-separated values are supported
    if (instrumentNames.length > 0) {
      const instrumentList = instrumentNames.join(',')
      for (let r = 2; r <= lastDataRow; r++) {
        worksheet.getCell(r, 5).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${instrumentList}"`],
          showErrorMessage: false,
        }
      }
    }

    // Hidden sheet with full instrument list for reference
    const refSheet = workbook.addWorksheet('_InstrumentList', { state: 'hidden' })
    instrumentNames.forEach((name, i) => {
      refSheet.getCell(i + 1, 1).value = name
    })

    // Instructions sheet
    const instructionSheet = workbook.addWorksheet('Instructions')
    instructionSheet.getColumn(1).width = 70
    instructionSheet.addRow(['Video Grid Import Instructions'])
    instructionSheet.getRow(1).font = { bold: true, size: 14 }
    instructionSheet.addRow([])
    instructionSheet.addRow(['Fill in the "Video Grid" sheet with your video data.'])
    instructionSheet.addRow([])
    instructionSheet.addRow(['- Title: Required. The display name of the video.'])
    instructionSheet.addRow(['- Video URL: Required. Full YouTube or Vimeo URL.'])
    instructionSheet.addRow(['- Platform: Select YouTube or Vimeo from the dropdown. Auto-detected from URL if left empty.'])
    instructionSheet.addRow(['- Year: Optional. The year the video was recorded.'])
    instructionSheet.addRow(['- Instruments: Select from the dropdown for a single instrument, or type a'])
    instructionSheet.addRow(['  comma-separated list for multiple (e.g. "Fiddle, Guitar, Vocals").'])
    instructionSheet.addRow(['  New instruments not in the dropdown will be created automatically.'])
    instructionSheet.addRow(['- Location: Select from the dropdown, or type a new location name.'])
    instructionSheet.addRow(['  New locations will be created automatically.'])
    instructionSheet.addRow([])
    instructionSheet.addRow(['Available Instruments: ' + (instrumentNames.join(', ') || '(none yet — they will be created on import)')])
    instructionSheet.addRow(['Available Locations: ' + (locationNames.join(', ') || '(none yet — they will be created on import)')])
    instructionSheet.addRow([])
    instructionSheet.addRow(['Upload this file at the Video Grid import page.'])

    const buffer = await workbook.xlsx.writeBuffer()

    const filename = empty ? 'video-grid-template.xlsx' : 'video-grid-export.xlsx'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 },
    )
  }
}
