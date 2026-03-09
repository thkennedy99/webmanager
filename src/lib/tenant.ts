import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export type TenantData = {
  id: number | string
  name: string
  slug: string
  domain: string
  theme: {
    colorPrimary?: string | null
    colorAccent?: string | null
    fontFamily?: string | null
  }
  stripePublishableKey?: string | null
  resendFromEmail?: string | null
}

function mapTenant(tenant: {
  id: number | string
  name: string
  slug: string
  domain: string
  theme?: { colorPrimary?: string | null; colorAccent?: string | null; fontFamily?: string | null } | null
  stripePublishableKey?: string | null
  resendFromEmail?: string | null
}): TenantData {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    domain: tenant.domain,
    theme: tenant.theme || {},
    stripePublishableKey: tenant.stripePublishableKey,
    resendFromEmail: tenant.resendFromEmail,
  }
}

export async function getTenant(): Promise<TenantData | null> {
  const headersList = await headers()
  const payload = await getPayload({ config: await config })

  // 1. Check for tenant slug override (preview mode)
  const tenantSlug = headersList.get('x-tenant-slug')
  if (tenantSlug) {
    const { docs } = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: tenantSlug } },
      limit: 1,
    })
    if (docs.length > 0) return mapTenant(docs[0])
  }

  // 2. Resolve by Host header (production mode)
  const host = headersList.get('x-tenant-host') || headersList.get('host') || 'localhost'
  const hostname = host.split(':')[0]

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: hostname } },
    limit: 1,
  })

  if (docs.length > 0) return mapTenant(docs[0])

  // 3. Fallback: return first tenant (dev convenience)
  const { docs: fallbackDocs } = await payload.find({
    collection: 'tenants',
    limit: 1,
    sort: 'createdAt',
  })
  if (fallbackDocs.length > 0) return mapTenant(fallbackDocs[0])

  return null
}
