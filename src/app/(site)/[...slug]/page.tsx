import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getTenant } from '@/lib/tenant'
import { getSiteTheme, getHeroSlides } from '@/lib/theme'
import HeroCarousel from '@/components/ui/HeroCarousel'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import SubscriptionGate from '@/components/blocks/SubscriptionGate'

import GeneralPageTemplate from '@/components/templates/GeneralPageTemplate'
import ArtistsTemplate from '@/components/templates/ArtistsTemplate'
import EventsTemplate from '@/components/templates/EventsTemplate'
import StoreTemplate from '@/components/templates/StoreTemplate'
import VideoGalleryTemplate from '@/components/templates/VideoGalleryTemplate'
import MusicPlayerTemplate from '@/components/templates/MusicPlayerTemplate'
import ContactTemplate from '@/components/templates/ContactTemplate'

type PageProps = {
  params: Promise<{ slug: string[] }>
}

// Legacy page-specific images (kept for backward compatibility)
const pageImages: Record<string, { src: string; alt: string }[]> = {}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const tenant = await getTenant()
  if (!tenant) return { title: 'Not Found' }

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slugPath },
      tenant: { equals: tenant.id },
    },
    limit: 1,
  })

  if (docs.length === 0) return { title: 'Not Found' }
  const page = docs[0]
  const pageData = page as typeof page & { metaKeywords?: string | null }

  const metadata: Record<string, unknown> = {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  }

  if (pageData.metaKeywords) {
    metadata.keywords = pageData.metaKeywords.split(',').map((k: string) => k.trim())
  }

  return metadata
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const tenant = await getTenant()
  if (!tenant) notFound()

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slugPath },
      tenant: { equals: tenant.id },
      _status: { equals: 'published' },
    },
    limit: 1,
  })

  if (docs.length === 0) notFound()
  const page = docs[0]
  const pageData = page as typeof page & {
    requiresSubscription?: boolean
    requiredPlanTypes?: string[]
    gatedMessage?: string
  }
  const images = pageImages[slugPath]
  const hasLayoutBlocks = page.layout && page.layout.length > 0

  const renderTemplate = () => {
    // If page has layout blocks, render them instead of legacy templates
    if (hasLayoutBlocks) {
      return <RenderBlocks blocks={page.layout!} tenantId={tenant.id} tenantSlug={tenant.slug} />
    }

    // Legacy template fallback for existing pages
    switch (page.pageType) {
      case 'general':
        return <GeneralPageTemplate page={page} images={images} />
      case 'artists':
        return <ArtistsTemplate page={page} tenantId={tenant.id} tenantSlug={tenant.slug} />
      case 'events':
        return <EventsTemplate page={page} tenantId={tenant.id} />
      case 'store':
        return <StoreTemplate page={page} tenantId={tenant.id} />
      case 'video-gallery':
        return <VideoGalleryTemplate page={page} tenantId={tenant.id} />
      case 'music':
        return <MusicPlayerTemplate page={page} tenantId={tenant.id} />
      case 'contact':
        return <ContactTemplate page={page} />
      case 'home':
        return <GeneralPageTemplate page={page} images={images} />
      default:
        return <GeneralPageTemplate page={page} images={images} />
    }
  }

  const theme = await getSiteTheme(tenant.id)
  const heroSlides = getHeroSlides(theme)

  const content = (
    <>
      {heroSlides.length > 0 && (
        <HeroCarousel
          slides={heroSlides}
          headline={page.heroHeadline || page.title}
          subheadline={page.heroSubheadline || undefined}
        />
      )}
      {renderTemplate()}
    </>
  )

  if (pageData.requiresSubscription) {
    return (
      <SubscriptionGate
        tenantId={tenant.id}
        requiredPlanTypes={pageData.requiredPlanTypes}
        gatedMessage={pageData.gatedMessage || undefined}
      >
        {content}
      </SubscriptionGate>
    )
  }

  return content
}
