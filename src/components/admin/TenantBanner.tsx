'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

const adminThemeCSS = `
  /* ── Erin Shore Productions Admin Theme ── */
  /* Orange #F26522 · Green #1A6B37 · Light warm background */

  [data-theme="light"] {
    /* Background tones — warm off-white */
    --theme-bg: #faf8f5;
    --theme-elevation-0: #faf8f5;
    --theme-elevation-50: #f5f2ed;
    --theme-elevation-100: #efece6;
    --theme-elevation-150: #e8e4dd;
    --theme-elevation-200: #e0dbd3;
    --theme-elevation-250: #d6d1c8;
    --theme-elevation-300: #cbc5bb;
    --theme-elevation-350: #b8b1a6;
    --theme-elevation-400: #a49d91;
    --theme-elevation-450: #918a7e;
    --theme-elevation-500: #7d776b;
    --theme-elevation-550: #6a6459;
    --theme-elevation-600: #575148;
    --theme-elevation-650: #454038;
    --theme-elevation-700: #343029;
    --theme-elevation-750: #24211b;
    --theme-elevation-800: #18160f;
    --theme-elevation-850: #100e08;
    --theme-elevation-900: #0a0904;
    --theme-elevation-950: #050402;
    --theme-elevation-1000: #020201;

    /* Input fields */
    --theme-input-bg: #ffffff;

    /* Text */
    --theme-text: #1e2a1e;

    /* Success = green from logo */
    --theme-success-50: #e8f5ec;
    --theme-success-100: #c8e6d0;
    --theme-success-150: #a8d7b4;
    --theme-success-200: #88c898;
    --theme-success-250: #68b97c;
    --theme-success-300: #4aaa62;
    --theme-success-400: #2d9b4a;
    --theme-success-500: #1A6B37;
    --theme-success-600: #155a2e;
    --theme-success-650: #114a26;
    --theme-success-750: #0a3a1c;
    --theme-success-800: #072a14;
    --theme-success-850: #04200e;
    --theme-success-900: #021508;

    /* Error = warm red-orange */
    --theme-error-50: #fff3ee;
    --theme-error-100: #ffe0d0;
    --theme-error-150: #ffcdb2;
    --theme-error-200: #ffb494;
    --theme-error-300: #ff8a5c;
    --theme-error-400: #ff6e38;
    --theme-error-500: #e05520;
    --theme-error-600: #c04818;
    --theme-error-650: #a03c14;
    --theme-error-750: #802f0f;
    --theme-error-800: #60230b;
    --theme-error-900: #401806;
    --theme-error-950: #200c03;

    /* Warning = orange from logo */
    --theme-warning-100: #fef0e0;
    --theme-warning-150: #fde0c0;
    --theme-warning-600: #F26522;
    --theme-warning-800: #a04010;

    /* Border */
    --theme-border-color: #ddd6cb;
  }

  /* ── Nav sidebar ── */
  .nav {
    background: #1A6B37 !important;
  }

  .nav a,
  .nav span,
  .nav label,
  .nav .nav-group__toggle,
  .nav .group-label {
    color: #ffffffdd !important;
  }

  .nav a:hover,
  .nav .nav-group__toggle:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .nav a.active,
  .nav a[aria-current="page"] {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #ffffff !important;
    border-left: 3px solid #F26522 !important;
  }

  /* Nav group labels */
  .nav .group-label,
  .nav [class*="group-label"],
  .nav [class*="nav-group"] > button > span {
    color: #F26522 !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    font-size: 11px !important;
    letter-spacing: 1px !important;
  }

  /* ── Buttons ── */
  .btn.btn--style-primary,
  button[class*="btn--style-primary"] {
    background-color: #F26522 !important;
    border-color: #F26522 !important;
    color: #fff !important;
  }

  .btn.btn--style-primary:hover,
  button[class*="btn--style-primary"]:hover {
    background-color: #d9571c !important;
    border-color: #d9571c !important;
  }

  .btn.btn--style-secondary,
  button[class*="btn--style-secondary"] {
    color: #1A6B37 !important;
    border-color: #1A6B37 !important;
  }

  .btn.btn--style-secondary:hover,
  button[class*="btn--style-secondary"]:hover {
    background-color: #1A6B37 !important;
    color: #fff !important;
  }

  /* ── Links / accent color ── */
  a:not(.nav a):not(.btn) {
    color: #1A6B37;
  }

  a:not(.nav a):not(.btn):hover {
    color: #155a2e;
  }

  /* ── Payload admin logo area ── */
  .nav .nav__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  }

  /* ── Step nav / breadcrumbs ── */
  .step-nav a {
    color: #1A6B37 !important;
  }

  /* ── Table header ── */
  .table th {
    background: #f0ede7 !important;
    color: #1e2a1e !important;
  }

  /* ── Focus ring ── */
  *:focus-visible {
    outline-color: #F26522 !important;
  }

  /* ── Checkbox / toggle accents ── */
  input[type="checkbox"]:checked {
    background-color: #1A6B37 !important;
    border-color: #1A6B37 !important;
  }

  /* ── Pill / tag ── */
  .pill {
    background-color: #e8f5ec !important;
    color: #1A6B37 !important;
  }
`

interface TenantFeatures {
  enableVideoGrid?: boolean
  enableStore?: boolean
  enableMailingList?: boolean
}

export default function TenantBanner() {
  const { selectedTenantID, options } = useTenantSelection()
  const [tenantSlug, setTenantSlug] = useState<string | null>(null)
  const [features, setFeatures] = useState<TenantFeatures>({})

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(selectedTenantID),
  )
  const label = selectedOption?.label
  const tenantName = typeof label === 'string' ? label : label ? Object.values(label)[0] || 'Unknown' : 'No tenant selected'

  // Fetch tenant data when selection changes
  useEffect(() => {
    if (!selectedTenantID) {
      setTenantSlug(null)
      setFeatures({})
      return
    }
    fetch(`/api/tenants/${selectedTenantID}?depth=0`)
      .then((res) => res.json())
      .then((data) => {
        setTenantSlug(data.slug || null)
        setFeatures(data.features || {})
      })
      .catch(() => {
        setTenantSlug(null)
        setFeatures({})
      })
  }, [selectedTenantID])

  // Build CSS to hide disabled feature groups in nav
  const featureHideCSS = [
    !features.enableVideoGrid && `[id="nav-group-Video Grid"] { display: none !important; }`,
    !features.enableStore && `[id="nav-group-Store"] { display: none !important; }`,
    !features.enableMailingList && `[id="nav-group-Marketing"] { display: none !important; }`,
  ].filter(Boolean).join('\n')

  const handlePreview = useCallback(() => {
    if (!tenantSlug) return
    window.open(`/preview?tenant=${tenantSlug}`, '_blank')
  }, [tenantSlug])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: adminThemeCSS }} />
      {featureHideCSS && <style dangerouslySetInnerHTML={{ __html: featureHideCSS }} />}
      <div
        style={{
          padding: '10px 12px',
          background: 'linear-gradient(135deg, #1A6B37 0%, #22844a 100%)',
          color: '#ffffff',
          borderBottom: '3px solid #F26522',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '12px',
            textAlign: 'center',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: tenantSlug ? '8px' : 0,
            wordBreak: 'break-word',
          }}
        >
          {tenantName}
        </div>
        {tenantSlug && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              justifyContent: 'center',
            }}
          >
            {[
              { label: 'Preview', onClick: handlePreview, primary: true },
              { label: 'Analytics', onClick: () => { window.location.href = '/admin/analytics' }, primary: false },
              { label: 'Transactions', onClick: () => { window.location.href = '/admin/transactions' }, primary: false },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.onClick}
                style={{
                  background: btn.primary ? '#F26522' : 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '3px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
