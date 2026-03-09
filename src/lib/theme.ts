import { getPayload } from 'payload'
import config from '@/payload.config'

type ResponsiveOverrides = {
  h1Size?: number | null
  h2Size?: number | null
  h3Size?: number | null
  bodySize?: number | null
  heroHeight?: number | null
  heroMinHeight?: number | null
  heroHeadlineSize?: number | null
  heroSubheadlineSize?: number | null
  sectionPadding?: string | null
  navFontSize?: number | null
} | null

export type SiteProfileConfig = {
  siteName?: string | null
  siteIcon?: { url: string } | number | null
  footerText?: string | null
  footerLinks?: { label: string; href: string; openInNewTab?: boolean | null }[] | null
}

export type SeoConfig = {
  googleAnalyticsId?: string | null
  googleSearchConsoleVerification?: string | null
  defaultMetaKeywords?: string | null
  customHeadContent?: string | null
}

export type HeroSlide = {
  image: { url: string } | number
  alt: string
}

export type ThemeConfig = {
  heroSlides?: HeroSlide[] | null
  typography?: {
    headingFont?: string | null
    bodyFont?: string | null
    h1Size?: number | null
    h2Size?: number | null
    h3Size?: number | null
    h4Size?: number | null
    bodySize?: number | null
    headingWeight?: string | null
    lineHeight?: string | null
  } | null
  colors?: {
    primary?: string | null
    accent?: string | null
    accentHover?: string | null
    bodyBackground?: string | null
    bodyText?: string | null
    navBackground?: string | null
    navText?: string | null
    footerBackground?: string | null
    footerText?: string | null
    darkSectionBg?: string | null
  } | null
  navigation?: {
    fontSize?: number | null
    textTransform?: string | null
    fontWeight?: string | null
    letterSpacing?: string | null
  } | null
  hero?: {
    height?: number | null
    minHeight?: number | null
    maxHeight?: number | null
    overlayOpacity?: string | null
    headlineSize?: number | null
    subheadlineSize?: number | null
  } | null
  buttons?: {
    borderRadius?: string | null
    paddingX?: string | null
    paddingY?: string | null
    fontWeight?: string | null
    textTransform?: string | null
  } | null
  spacing?: {
    sectionPadding?: string | null
    containerWidth?: string | null
  } | null
  mobile?: ResponsiveOverrides
  tablet?: ResponsiveOverrides
  siteProfile?: SiteProfileConfig | null
  seo?: SeoConfig | null
}

export async function getSiteTheme(tenantId?: string | number): Promise<ThemeConfig> {
  if (!tenantId) return {}
  try {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'site-themes',
      where: { tenant: { equals: tenantId } },
      depth: 1,
      limit: 1,
    })
    if (docs.length === 0) return {}
    return docs[0] as ThemeConfig
  } catch {
    return {}
  }
}

function buildResponsiveVars(overrides: ResponsiveOverrides): string[] {
  if (!overrides) return []
  const vars: string[] = []

  if (overrides.h1Size) vars.push(`--h1-size: ${overrides.h1Size}px`)
  if (overrides.h2Size) vars.push(`--h2-size: ${overrides.h2Size}px`)
  if (overrides.h3Size) vars.push(`--h3-size: ${overrides.h3Size}px`)
  if (overrides.bodySize) vars.push(`--body-size: ${overrides.bodySize}px`)
  if (overrides.heroHeight) vars.push(`--hero-height: ${overrides.heroHeight}vh`)
  if (overrides.heroMinHeight) vars.push(`--hero-min-height: ${overrides.heroMinHeight}px`)
  if (overrides.heroHeadlineSize) vars.push(`--hero-headline-size: ${overrides.heroHeadlineSize}rem`)
  if (overrides.heroSubheadlineSize) vars.push(`--hero-subheadline-size: ${overrides.heroSubheadlineSize}rem`)
  if (overrides.sectionPadding) vars.push(`--section-padding: ${overrides.sectionPadding}rem`)
  if (overrides.navFontSize) vars.push(`--nav-font-size: ${overrides.navFontSize / 16}rem`)

  return vars
}

export function getHeroSlides(theme: ThemeConfig): { src: string; alt: string }[] {
  if (!theme.heroSlides || theme.heroSlides.length === 0) return []
  return theme.heroSlides
    .filter((s) => s.image && typeof s.image === 'object' && 'url' in s.image)
    .map((s) => ({
      src: (s.image as { url: string }).url,
      alt: s.alt || '',
    }))
}

export function themeToCSS(theme: ThemeConfig): string {
  const vars: string[] = []

  // Typography
  const t = theme.typography
  if (t?.headingFont) vars.push(`--font-heading: '${t.headingFont}', sans-serif`)
  if (t?.bodyFont) vars.push(`--font-family: '${t.bodyFont}', sans-serif`)
  if (t?.h1Size) vars.push(`--h1-size: ${t.h1Size}px`)
  if (t?.h2Size) vars.push(`--h2-size: ${t.h2Size}px`)
  if (t?.h3Size) vars.push(`--h3-size: ${t.h3Size}px`)
  if (t?.h4Size) vars.push(`--h4-size: ${t.h4Size}px`)
  if (t?.bodySize) vars.push(`--body-size: ${t.bodySize}px`)
  if (t?.headingWeight) vars.push(`--heading-weight: ${t.headingWeight}`)
  if (t?.lineHeight) vars.push(`--line-height: ${t.lineHeight}`)

  // Colors
  const c = theme.colors
  if (c?.primary) vars.push(`--color-primary: ${c.primary}`)
  if (c?.accent) vars.push(`--color-accent: ${c.accent}`)
  if (c?.accentHover) vars.push(`--color-accent-hover: ${c.accentHover}`)
  if (c?.bodyBackground) vars.push(`--body-bg: ${c.bodyBackground}`)
  if (c?.bodyText) vars.push(`--body-text: ${c.bodyText}`)
  if (c?.navBackground) vars.push(`--nav-bg: ${c.navBackground}`)
  if (c?.navText) vars.push(`--nav-text: ${c.navText}`)
  if (c?.footerBackground) vars.push(`--footer-bg: ${c.footerBackground}`)
  if (c?.footerText) vars.push(`--footer-text: ${c.footerText}`)
  if (c?.darkSectionBg) vars.push(`--section-dark-bg: ${c.darkSectionBg}`)

  // Navigation
  const n = theme.navigation
  if (n?.fontSize) vars.push(`--nav-font-size: ${n.fontSize / 16}rem`)
  if (n?.textTransform) vars.push(`--nav-text-transform: ${n.textTransform}`)
  if (n?.fontWeight) vars.push(`--nav-font-weight: ${n.fontWeight}`)
  if (n?.letterSpacing) vars.push(`--nav-letter-spacing: ${n.letterSpacing}px`)

  // Hero
  const h = theme.hero
  if (h?.height) vars.push(`--hero-height: ${h.height}vh`)
  if (h?.minHeight) vars.push(`--hero-min-height: ${h.minHeight}px`)
  if (h?.maxHeight) vars.push(`--hero-max-height: ${h.maxHeight}px`)
  if (h?.overlayOpacity) vars.push(`--hero-overlay: ${h.overlayOpacity}`)
  if (h?.headlineSize) vars.push(`--hero-headline-size: ${h.headlineSize}rem`)
  if (h?.subheadlineSize) vars.push(`--hero-subheadline-size: ${h.subheadlineSize}rem`)

  // Buttons
  const b = theme.buttons
  if (b?.borderRadius) vars.push(`--btn-radius: ${b.borderRadius}px`)
  if (b?.paddingX) vars.push(`--btn-padding-x: ${b.paddingX}rem`)
  if (b?.paddingY) vars.push(`--btn-padding-y: ${b.paddingY}rem`)
  if (b?.fontWeight) vars.push(`--btn-font-weight: ${b.fontWeight}`)
  if (b?.textTransform) vars.push(`--btn-text-transform: ${b.textTransform}`)

  // Spacing
  const s = theme.spacing
  if (s?.sectionPadding) vars.push(`--section-padding: ${s.sectionPadding}rem`)
  if (s?.containerWidth) vars.push(`--container-max-width: ${s.containerWidth}px`)

  if (vars.length === 0 && !theme.mobile && !theme.tablet) return ''

  // Desktop (default)
  let css = `:root { ${vars.join('; ')}; }`

  // Tablet overrides (768px – 991px)
  const tabletVars = buildResponsiveVars(theme.tablet ?? null)
  if (tabletVars.length > 0) {
    css += ` @media (max-width: 991px) { :root { ${tabletVars.join('; ')}; } }`
  }

  // Mobile overrides (< 768px)
  const mobileVars = buildResponsiveVars(theme.mobile ?? null)
  if (mobileVars.length > 0) {
    css += ` @media (max-width: 767px) { :root { ${mobileVars.join('; ')}; } }`
  }

  return css
}

export function getGoogleFontsUrl(theme: ThemeConfig): string {
  const fonts = new Set<string>()
  if (theme.typography?.headingFont) fonts.add(theme.typography.headingFont)
  if (theme.typography?.bodyFont) fonts.add(theme.typography.bodyFont)

  if (fonts.size === 0) return ''

  const families = Array.from(fonts)
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@300;400;600;700;800;900`)
    .join('&')

  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
