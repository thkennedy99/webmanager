import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ExcelJS from 'exceljs'

/**
 * GET /api/video-grid/export?tenantId=1&empty=true
 * Exports video grid items as Excel.
 * ?empty=true returns an empty template with headers only.
 */
export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId')
  const empty = request.nextUrl.searchParams.get('empty') === 'true'

  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'Missing tenantId' }, { status: 400 })
  }

  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Video Grid Manager'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Video Grid')

    // Define columns
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Video URL', key: 'videoUrl', width: 50 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Instruments', key: 'instruments', width: 40 },
      { header: 'Location', key: 'location', width: 25 },
    ]

    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A6B37' },
    }
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }

    if (!empty) {
      const payload = await getPayload({ config: await config })

      const { docs } = await payload.find({
        collection: 'video-grid-items',
        where: { tenant: { equals: Number(tenantId) } },
        sort: 'sortOrder',
        limit: 5000,
        depth: 2,
      })

      for (const doc of docs) {
        const d = doc as unknown as {
          title: string
          videoUrl: string
          year?: number
          instruments?: { name: string }[]
          location?: { name: string }
        }

        worksheet.addRow({
          title: d.title,
          videoUrl: d.videoUrl,
          year: d.year || '',
          instruments: d.instruments?.map((i) => i.name).join(', ') || '',
          location: d.location?.name || '',
        })
      }
    }

    // Also add an instructions sheet for the template
    const instructionSheet = workbook.addWorksheet('Instructions')
    instructionSheet.getColumn(1).width = 60
    instructionSheet.addRow(['Video Grid Import Instructions'])
    instructionSheet.getRow(1).font = { bold: true, size: 14 }
    instructionSheet.addRow([])
    instructionSheet.addRow(['Fill in the "Video Grid" sheet with your video data.'])
    instructionSheet.addRow(['- Title: Required. The display name of the video.'])
    instructionSheet.addRow(['- Video URL: Required. Full YouTube or Vimeo URL.'])
    instructionSheet.addRow(['- Year: Optional. The year the video was recorded.'])
    instructionSheet.addRow(['- Instruments: Optional. Comma-separated list (e.g. "fiddle, guitar, vocals").'])
    instructionSheet.addRow(['  New instruments will be created automatically.'])
    instructionSheet.addRow(['- Location: Optional. The venue name (e.g. "O\'Flaherty Retreat").'])
    instructionSheet.addRow(['  New locations will be created automatically.'])
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
