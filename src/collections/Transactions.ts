import type { AccessArgs, CollectionConfig } from 'payload'

import { isSuperAdmin } from '../lib/access'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'description',
    group: 'Store',
    defaultColumns: ['description', 'type', 'amount', 'status', 'customerEmail', 'createdAt', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
      if (user.role === 'super-admin') return true
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req }: AccessArgs) => isSuperAdmin(req), // Created by webhooks/system only
    update: ({ req }: AccessArgs) => isSuperAdmin(req), // Only system updates (refunds)
    delete: ({ req }: AccessArgs) => isSuperAdmin(req),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'One-Time Payment', value: 'payment' },
        { label: 'Subscription Payment', value: 'subscription' },
        { label: 'Refund', value: 'refund' },
        { label: 'Donation', value: 'donation' },
        { label: 'Tip', value: 'tip' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Refunded', value: 'partially_refunded' },
        { label: 'Disputed', value: 'disputed' },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount in cents (e.g. 2500 = $25.00)',
      },
    },
    {
      name: 'refundedAmount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total amount refunded in cents',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'usd',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable description (e.g. "Premium Monthly Subscription", "Concert Ticket x2")',
      },
    },
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
      name: 'stripePaymentIntentId',
      type: 'text',
      index: true,
      admin: {
        description: 'Stripe PaymentIntent ID (pi_...)',
      },
    },
    {
      name: 'stripeChargeId',
      type: 'text',
      admin: {
        description: 'Stripe Charge ID (ch_...)',
      },
    },
    {
      name: 'stripeInvoiceId',
      type: 'text',
      admin: {
        description: 'Stripe Invoice ID for subscription payments (in_...)',
      },
    },
    {
      name: 'discountCode',
      type: 'relationship',
      relationTo: 'discount-codes',
      admin: {
        description: 'Discount code applied to this transaction',
      },
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'customer-subscriptions',
      admin: {
        description: 'Related subscription (for recurring payments)',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description: 'Related product (for one-time purchases)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data from Stripe or internal systems',
      },
    },
  ],
  timestamps: true,
}
