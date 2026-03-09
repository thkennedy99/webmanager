import { getPayload } from 'payload'
import config from '@/payload.config'
import { getTenant } from '@/lib/tenant'
import { getSiteTheme, getHeroSlides } from '@/lib/theme'
import HeroCarousel from '@/components/ui/HeroCarousel'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'

export async function generateMetadata() {
  const tenant = await getTenant()
  if (!tenant) return { title: 'Not Found' }

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      tenant: { equals: tenant.id },
    },
    limit: 1,
  })

  const page = docs[0]
  if (!page) {
    return {
      title: tenant.name,
      description: `Welcome to ${tenant.name}`,
    }
  }

  return {
    title: page.metaTitle || page.title || tenant.name,
    description: page.metaDescription || undefined,
  }
}

export default async function HomePage() {
  const tenant = await getTenant()
  if (!tenant) return null

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      tenant: { equals: tenant.id },
    },
    limit: 1,
  })

  const page = docs[0]

  const theme = await getSiteTheme(tenant.id)
  const heroSlides = getHeroSlides(theme)

  return (
    <>
      {heroSlides.length > 0 && (
        <HeroCarousel
          slides={heroSlides}
          headline={page?.heroHeadline || tenant.name}
          subheadline={page?.heroSubheadline || undefined}
        />
      )}
      {page?.layout && page.layout.length > 0 && (
        <RenderBlocks blocks={page.layout} tenantId={tenant.id} tenantSlug={tenant.slug} />
      )}
    </>
  )
}
