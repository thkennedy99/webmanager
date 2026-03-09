'use client'

import { useCallback, useRef, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

export default function VideoGridImportExport() {
  const { selectedTenantID } = useTenantSelection()
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{
    imported: number
    errors: number
    errorMessages: string[]
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImport = useCallback(async () => {
    const file = fileRef.current?.files?.[0]
    if (!file || !selectedTenantID) return

    setImporting(true)
    setResult(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tenantId', String(selectedTenantID))

      const res = await fetch('/api/video-grid/import', { method: 'POST', body: formData })
      const json = await res.json()

      if (!json.success) {
        setError(json.error || 'Import failed')
      } else {
        setResult(json.data)
        // Reload the page to refresh the list after import
        if (json.data.imported > 0) {
          setTimeout(() => window.location.reload(), 1500)
        }
      }
    } catch {
      setError('Failed to connect to import API')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }, [selectedTenantID])

  const handleExport = useCallback(
    (empty: boolean) => {
      if (!selectedTenantID) return
      window.open(
        `/api/video-grid/export?tenantId=${selectedTenantID}${empty ? '&empty=true' : ''}`,
        '_blank',
      )
    },
    [selectedTenantID],
  )

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        {/* Export buttons */}
        <button
          type="button"
          onClick={() => handleExport(false)}
          style={{
            background: '#1A6B37',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Export All
        </button>
        <button
          type="button"
          onClick={() => handleExport(true)}
          style={{
            background: '#fff',
            color: '#1A6B37',
            border: '1.5px solid #1A6B37',
            borderRadius: 5,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Download Template
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: '#e0e0e0', margin: '0 4px' }} />

        {/* Import */}
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          style={{
            padding: '5px 8px',
            border: '1px solid #d9d9d9',
            borderRadius: 5,
            fontSize: 12,
            maxWidth: 220,
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
            borderRadius: 5,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: importing ? 'not-allowed' : 'pointer',
            opacity: importing ? 0.6 : 1,
          }}
        >
          {importing ? 'Importing...' : 'Import'}
        </button>
      </div>

      {/* Result / Error messages */}
      {result && (
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: result.errors > 0 ? '#fffbe6' : '#f6ffed',
            border: `1px solid ${result.errors > 0 ? '#ffe58f' : '#b7eb8f'}`,
            borderRadius: 5,
            fontSize: 13,
          }}
        >
          <strong>{result.imported}</strong> of {result.total} imported.
          {result.errors > 0 && (
            <span style={{ color: '#cf1322', marginLeft: 6 }}>{result.errors} errors.</span>
          )}
          {result.imported > 0 && (
            <span style={{ color: '#888', marginLeft: 6 }}>Refreshing list...</span>
          )}
          {result.errorMessages.length > 0 && (
            <ul style={{ fontSize: 12, color: '#cf1322', marginTop: 6, paddingLeft: 20, marginBottom: 0 }}>
              {result.errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: '#fff3f3',
            border: '1px solid #ffccc7',
            borderRadius: 5,
            color: '#cf1322',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
