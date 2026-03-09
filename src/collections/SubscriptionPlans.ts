import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',
  admin: {
    useAsTitle: 'name',
    group: 'Store',
    defaultColumns: ['name', 'billingInterval', 'price', 'isActive', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return true // Public can view plans
      if (user.role === 'super-admin') return true
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req }: AccessArgs) => isAdmin(req),
    update: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
      if (user.role === 'super-admin') return true
      if (user.role === 'admin') return { tenant: { equals: user.tenant } }
      return false
    },
    delete: ({ req }: AccessArgs) => isAdmin(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name (e.g. "Premium Monthly", "Patron Annual")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'URL-safe identifier (e.g. "premium-monthly")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'planType',
      type: 'text',
      required: true,
      admin: {
        description: 'Group identifier for plan tiers (e.g. "premium", "patron", "supporter")',
      },
    },
    {
      name: 'billingInterval',
      type: 'select',
      required: true,
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annual', value: 'annual' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in cents per billing interval (e.g. 999 = $9.99/month)',
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'Stripe Price ID (auto-synced when Stripe keys are configured)',
      },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        description: 'Stripe Product ID (auto-synced)',
      },
    },
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'Feature list shown on pricing page',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'trialDays',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of free trial days (0 for no trial)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order on pricing page (lower = first)',
      },
    },
  ],
}
