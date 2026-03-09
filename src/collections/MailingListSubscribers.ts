import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const MailingListSubscribers: CollectionConfig = {
  slug: 'mailing-list-subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Marketing',
    defaultColumns: ['email', 'firstName', 'lastName', 'status', 'subscribedAt', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
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
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website Form', value: 'website' },
        { label: 'Admin Import', value: 'import' },
        { label: 'Checkout', value: 'checkout' },
        { label: 'Subscription Signup', value: 'subscription' },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for segmenting subscribers (e.g. "newsletter", "concert-alerts")',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        condition: (data) => data?.status === 'unsubscribed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
