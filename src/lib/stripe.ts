import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'

const stripeClients: Map<string, Stripe> = new Map()

/**
 * Get a Stripe client for the given tenant.
 * Caches clients by tenant ID to avoid re-creating them.
 */
export async function getStripeClient(tenantId: number | string): Promise<Stripe | null> {
  const key = String(tenantId)
  if (stripeClients.has(key)) {
    return stripeClients.get(key)!
  }

  const payload = await getPayload({ config: await config })
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: Number(tenantId),
    depth: 0,
  })

  const tenantData = tenant as unknown as Record<string, unknown>
  const secretKey = tenantData.stripeSecretKey as string | undefined

  if (!secretKey) {
    return null
  }

  const client = new Stripe(secretKey)

  stripeClients.set(key, client)
  return client
}

/**
 * Get the Stripe publishable key for client-side use.
 */
export async function getStripePublishableKey(tenantId: number | string): Promise<string | null> {
  const payload = await getPayload({ config: await config })
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: Number(tenantId),
    depth: 0,
  })

  const tenantData = tenant as unknown as Record<string, unknown>
  return (tenantData.stripePublishableKey as string) || null
}

/**
 * Get the Stripe webhook secret for signature verification.
 */
export async function getStripeWebhookSecret(tenantId: number | string): Promise<string | null> {
  const payload = await getPayload({ config: await config })
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: Number(tenantId),
    depth: 0,
  })

  const tenantData = tenant as unknown as Record<string, unknown>
  return (tenantData.stripeWebhookSecret as string) || null
}

/**
 * Verify a Stripe webhook event.
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
): Stripe.Event {
  return Stripe.webhooks.constructEvent(payload, signature, secret)
}

/**
 * Clear cached Stripe client (e.g. when tenant keys are updated).
 */
export function clearStripeCache(tenantId?: string | number): void {
  if (tenantId) {
    stripeClients.delete(String(tenantId))
  } else {
    stripeClients.clear()
  }
}
