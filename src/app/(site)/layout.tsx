import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { getTenant } from '@/lib/tenant'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSiteTheme, themeToCSS, getGoogleFontsUrl } from '@/lib/theme'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant()
  const siteTheme = await getSiteTheme(tenant?.id)
  const siteName = siteTheme?.siteProfile?.siteName || tenant?.name || 'Website'
  const seo = siteTheme?.seo

  const metadata: Metadata = {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: `${siteName} — official website`,
  }

  // Google Search Console verification
  if (seo?.googleSearchConsoleVerification) {
    metadata.verification = {
      google: seo.googleSearchConsoleVerification,
    }
  }

  // Default meta keywords
  if (seo?.defaultMetaKeywords) {
    metadata.keywords = seo.defaultMetaKeywords.split(',').map((k) => k.trim())
  }

  // Favicon from site profile
  const siteIcon = siteTheme?.siteProfile?.siteIcon
  if (siteIcon && typeof siteIcon === 'object' && 'url' in siteIcon) {
    metadata.icons = { icon: siteIcon.url }
  }

  return metadata
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenant()
  const tenantName = tenant?.name || 'Website'
  const tenantSlug = tenant?.slug || 'default'
  const tenantId = tenant?.id

  let navItems: {
    id: string | number
    label: string
    href: string
    order: number
    openInNewTab?: boolean | null
    children?: { label: string; href: string; openInNewTab?: boolean | null }[]
  }[] = []

  if (tenantId) {
    try {
      const payload = await getPayload({ config: await config })
      const { docs } = await payload.find({
        collection: 'navigation',
        where: { tenant: { equals: tenantId } },
        sort: 'order',
        limit: 50,
      })
      navItems = docs.map((doc) => ({
        id: doc.id,
        label: doc.label,
        href: doc.href,
        order: doc.order,
        openInNewTab: doc.openInNewTab,
        children: doc.children?.map((child) => ({
          label: child.label,
          href: child.href,
          openInNewTab: child.openInNewTab,
        })),
      }))
    } catch {
      // Navigation collection may not be seeded yet
    }
  }

  const socialLinks = [
    { platform: 'youtube', url: 'https://www.youtube.com/channel/UCRqGeK9FyC8bRsopFH1dV0w' },
    { platform: 'facebook', url: 'https://www.facebook.com/erinshoreprod/' },
    { platform: 'twitter', url: 'https://twitter.com/erinshoreprod' },
  ]

  // Load theme for this tenant
  const siteTheme = await getSiteTheme(tenantId)
  const themeCss = themeToCSS(siteTheme)
  const fontsUrl = getGoogleFontsUrl(siteTheme)
  const seo = siteTheme?.seo
  const siteProfile = siteTheme?.siteProfile
  const siteName = siteProfile?.siteName || tenantName

  // Footer config
  const footerText = siteProfile?.footerText || null
  const footerLinks = siteProfile?.footerLinks || null

  return (
    <html lang="en">
      <head>
        {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}

        {/* Google Analytics */}
        {seo?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.googleAnalyticsId}');`,
              }}
            />
          </>
        )}

        {/* Custom head content */}
        {seo?.customHeadContent && (
          <script
            dangerouslySetInnerHTML={{ __html: '' }}
            data-custom-head="true"
          />
        )}
        {seo?.customHeadContent && (
          <div dangerouslySetInnerHTML={{ __html: seo.customHeadContent }} />
        )}
      </head>
      <body>
        <Navbar
          tenantName={siteName}
          tenantSlug={tenantSlug}
          navItems={navItems}
          socialLinks={socialLinks}
        />
        <main>{children}</main>
        <Footer
          tenantName={siteName}
          footerText={footerText}
          footerLinks={footerLinks}
        />
      </body>
    </html>
  )
}
