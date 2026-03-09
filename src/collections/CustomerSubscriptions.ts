import type { AccessArgs, CollectionConfig } from 'payload'

import { isSuperAdmin } from '../lib/access'

export const CustomerSubscriptions: CollectionConfig = {
  slug: 'customer-subscriptions',
  admin: {
    useAsTitle: 'customerEmail',
    group: 'Store',
    defaultColumns: ['customerEmail', 'plan', 'status', 'currentPeriodEnd', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
      if (user.role === 'super-admin') return true
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req }: AccessArgs) => isSuperAdmin(req), // Created by webhook only
    update: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
      if (user.role === 'super-admin') return true
      if (user.role === 'admin') return { tenant: { equals: user.tenant } }
      return false
    },
    delete: ({ req }: AccessArgs) => isSuperAdmin(req),
  },
  fields: [
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'customerName',
      type: 'text',
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'subscription-plans',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Incomplete', value: 'incomplete' },
      ],
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stripe Subscription ID (sub_...)',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Stripe Customer ID (cus_...)',
      },
    },
    {
      name: 'currentPeriodStart',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, subscription cancels at end of current period',
      },
    },
    {
      name: 'canceledAt',
      type: 'date',
      admin: {
        condition: (data) => data?.status === 'canceled',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'trialEnd',
      type: 'date',
      admin: {
        condition: (data) => data?.status === 'trialing',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
