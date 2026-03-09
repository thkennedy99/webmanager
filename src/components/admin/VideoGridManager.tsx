'use client'

import { useCallback, useRef, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

export default function VideoGridManager() {
  const { selectedTenantID } = useTenantSelection()
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    imported: number
    errors: number
    errorMessages: string[]
    total: number
  } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImport = useCallback(async () => {
    const file = fileRef.current?.files?.[0]
    if (!file || !selectedTenantID) return

    setImporting(true)
    setImportResult(null)
    setImportError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tenantId', String(selectedTenantID))

      const res = await fetch('/api/video-grid/import', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()

      if (!json.success) {
        setImportError(json.error || 'Import failed')
      } else {
        setImportResult(json.data)
      }
    } catch {
      setImportError('Failed to connect to import API')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }, [selectedTenantID])

  const handleExport = useCallback(
    (empty: boolean) => {
      if (!selectedTenantID) return
      const url = `/api/video-grid/export?tenantId=${selectedTenantID}${empty ? '&empty=true' : ''}`
      window.open(url, '_blank')
    },
    [selectedTenantID],
  )

  return (
    <div style={{ padding: '20px 24px', fontFamily: 'system-ui, sans-serif', maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#1a1a2e' }}>
        Video Grid Manager
      </h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
        Import and export video grid data via Excel spreadsheets
      </p>

      {/* Export section */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#1a1a2e' }}>
          Export
        </h3>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Download your video grid data as an Excel spreadsheet, or download an empty template for bulk import.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => handleExport(false)}
            style={{
              background: '#1A6B37',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export All Videos
          </button>
          <button
            type="button"
            onClick={() => handleExport(true)}
            style={{
              background: '#fff',
              color: '#1A6B37',
              border: '2px solid #1A6B37',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download Empty Template
          </button>
        </div>
      </div>

      {/* Import section */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#1a1a2e' }}>
          Import
        </h3>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Upload an Excel file (.xlsx) to bulk-import videos. Use the template above for the correct format.
          New instruments and locations will be created automatically.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              fontSize: 13,
            }}
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            style={{
              background: '#F26522',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: importing ? 'not-allowed' : 'pointer',
              opacity: importing ? 0.6 : 1,
            }}
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>

        {/* Import result */}
        {importResult && (
          <div
            style={{
              padding: 16,
              background: importResult.errors > 0 ? '#fffbe6' : '#f6ffed',
              border: `1px solid ${importResult.errors > 0 ? '#ffe58f' : '#b7eb8f'}`,
              borderRadius: 6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Import Complete
            </div>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: '#1A6B37' }}>
                {importResult.imported} of {importResult.total} videos imported successfully.
              </span>
              {importResult.errors > 0 && (
                <span style={{ color: '#cf1322', marginLeft: 8 }}>
                  {importResult.errors} errors.
                </span>
              )}
            </div>
            {importResult.errorMessages.length > 0 && (
              <ul style={{ fontSize: 12, color: '#cf1322', marginTop: 8, paddingLeft: 20, marginBottom: 0 }}>
                {importResult.errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Import error */}
        {importError && (
          <div
            style={{
              padding: 16,
              background: '#fff3f3',
              border: '1px solid #ffccc7',
              borderRadius: 6,
              color: '#cf1322',
              fontSize: 13,
            }}
          >
            {importError}
          </div>
        )}
      </div>

      {/* Format reference */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#1a1a2e' }}>
          Spreadsheet Format
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Column</th>
              <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Required</th>
              <th style={{ textAlign: 'left', padding: '8px 0', color: '#888', fontWeight: 600 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              { col: 'Title', req: 'Yes', desc: 'Video display name' },
              { col: 'Video URL', req: 'Yes', desc: 'Full YouTube or Vimeo URL' },
              { col: 'Year', req: 'No', desc: 'Year recorded (e.g. 2024)' },
              { col: 'Instruments', req: 'No', desc: 'Comma-separated (e.g. "Fiddle, Guitar, Vocals")' },
              { col: 'Location', req: 'No', desc: 'Venue name (e.g. "O\'Flaherty Retreat")' },
            ].map((row) => (
              <tr key={row.col} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '8px 0', fontWeight: 500, fontFamily: 'monospace' }}>{row.col}</td>
                <td style={{ padding: '8px 0' }}>{row.req}</td>
                <td style={{ padding: '8px 0', color: '#666' }}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
