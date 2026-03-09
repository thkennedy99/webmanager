import type { AccessArgs, CollectionConfig } from 'payload'

import { isSuperAdmin } from '../lib/access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: 'Global Configurations',
    hidden: ({ user }) => {
      const role = (user as { role?: string })?.role
      return role !== 'super-admin'
    },
  },
  access: {
    read: () => true,
    create: ({ req }: AccessArgs) => isSuperAdmin(req),
    update: ({ req }: AccessArgs) => isSuperAdmin(req),
    delete: ({ req }: AccessArgs) => isSuperAdmin(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier (e.g. "erinshore")',
      },
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Primary domain (e.g. "erinshoreprod.com")',
      },
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        {
          name: 'colorPrimary',
          type: 'text',
          defaultValue: '#1a1a2e',
          admin: { description: 'CSS color for --color-primary' },
        },
        {
          name: 'colorAccent',
          type: 'text',
          defaultValue: '#e94560',
          admin: { description: 'CSS color for --color-accent' },
        },
        {
          name: 'fontFamily',
          type: 'text',
          defaultValue: 'system-ui, sans-serif',
          admin: { description: 'CSS font-family for --font-family' },
        },
      ],
    },
    {
      name: 'features',
      type: 'group',
      admin: {
        description: 'Enable or disable features for this tenant',
      },
      fields: [
        {
          name: 'enableVideoGrid',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show Video Grid collections in admin sidebar',
          },
        },
        {
          name: 'enableStore',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show Store collections (Products, Subscriptions, etc.) in admin sidebar',
          },
        },
        {
          name: 'enableMailingList',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show Mailing List Subscribers in admin sidebar',
          },
        },
      ],
    },
    {
      name: 'stripeSecretKey',
      type: 'text',
      admin: {
        description: 'Stripe secret key for this tenant',
      },
      access: {
        read: ({ req }) => isSuperAdmin(req),
        update: ({ req }) => isSuperAdmin(req),
      },
    },
    {
      name: 'stripePublishableKey',
      type: 'text',
      admin: {
        description: 'Stripe publishable key for this tenant',
      },
      access: {
        read: ({ req }) => isSuperAdmin(req),
        update: ({ req }) => isSuperAdmin(req),
      },
    },
    {
      name: 'stripeWebhookSecret',
      type: 'text',
      admin: {
        description: 'Stripe webhook signing secret (whsec_...)',
      },
      access: {
        read: ({ req }) => isSuperAdmin(req),
        update: ({ req }) => isSuperAdmin(req),
      },
    },
    {
      name: 'printfulApiKey',
      type: 'text',
      admin: {
        description: 'Printful API key for this tenant',
      },
      access: {
        read: ({ req }) => isSuperAdmin(req),
        update: ({ req }) => isSuperAdmin(req),
      },
    },
    {
      name: 'resendFromEmail',
      type: 'email',
      admin: {
        description: 'From address for transactional emails',
      },
    },
  ],
}
