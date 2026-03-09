'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

const viewports = [
  { label: 'Mobile', width: 375, height: 812, icon: '📱' },
  { label: 'Tablet', width: 768, height: 1024, icon: '📋' },
  { label: 'Desktop', width: 1280, height: 800, icon: '🖥' },
] as const

type ViewportKey = 'Mobile' | 'Tablet' | 'Desktop'

function PreviewContent() {
  const searchParams = useSearchParams()
  const tenant = searchParams.get('tenant') || ''
  const [active, setActive] = useState<ViewportKey>('Desktop')
  const [customPath, setCustomPath] = useState('/')

  const viewport = viewports.find((v) => v.label === active)!
  const iframeSrc = `${customPath}${customPath.includes('?') ? '&' : '?'}__tenant=${tenant}`

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a2e', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Toolbar */}
      <div style={{ padding: '12px 20px', background: '#0d1117', borderBottom: '2px solid #F26522', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Back to admin */}
        <Link
          href="/admin"
          style={{ color: '#ffffffaa', textDecoration: 'none', fontSize: '13px', marginRight: '8px' }}
        >
          ← Admin
        </Link>

        <div style={{ width: '1px', height: '24px', background: '#ffffff30' }} />

        {/* Viewport toggles */}
        {viewports.map((vp) => (
          <button
            key={vp.label}
            type="button"
            onClick={() => setActive(vp.label)}
            style={{
              background: active === vp.label ? '#F26522' : 'transparent',
              color: '#fff',
              border: active === vp.label ? '2px solid #F26522' : '2px solid #ffffff40',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{vp.icon}</span>
            <span>{vp.label}</span>
            <span style={{ opacity: 0.7, fontSize: '11px' }}>{vp.width}px</span>
          </button>
        ))}

        <div style={{ width: '1px', height: '24px', background: '#ffffff30' }} />

        {/* Page path input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '12px', opacity: 0.7, whiteSpace: 'nowrap' }}>Path:</label>
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            style={{
              background: '#ffffff15',
              border: '1px solid #ffffff30',
              borderRadius: '4px',
              color: '#fff',
              padding: '5px 10px',
              fontSize: '13px',
              flex: 1,
              outline: 'none',
            }}
            placeholder="/"
          />
        </div>

        {/* Tenant badge */}
        {tenant && (
          <div style={{ fontSize: '11px', background: '#1A6B37', padding: '4px 10px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {tenant}
          </div>
        )}
      </div>

      {/* Viewport info bar */}
      <div style={{ padding: '6px 20px', background: '#13161d', fontSize: '12px', color: '#ffffff80', display: 'flex', gap: '16px' }}>
        <span>{viewport.width} × {viewport.height}</span>
        <span>{active === 'Desktop' ? 'Full width' : `Scaled to ${viewport.width}px`}</span>
      </div>

      {/* Preview area */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: active === 'Desktop' ? '0' : '20px',
        overflow: 'auto',
        background: active === 'Desktop' ? '#fff' : '#2a2a3e',
      }}>
        <div style={{
          width: active === 'Desktop' ? '100%' : `${viewport.width}px`,
          height: active === 'Desktop' ? '100%' : `${viewport.height}px`,
          borderRadius: active === 'Desktop' ? '0' : '12px',
          overflow: 'hidden',
          boxShadow: active === 'Desktop' ? 'none' : '0 8px 32px rgba(0,0,0,0.4)',
          border: active === 'Desktop' ? 'none' : '2px solid #ffffff20',
          flexShrink: 0,
        }}>
          <iframe
            src={iframeSrc}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#fff',
            }}
            title={`Preview - ${active}`}
          />
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', color: '#fff' }}>
        Loading preview...
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
