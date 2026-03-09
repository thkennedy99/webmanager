import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const DiscountCodes: CollectionConfig = {
  slug: 'discount-codes',
  admin: {
    useAsTitle: 'code',
    group: 'Store',
    defaultColumns: ['code', 'discountType', 'value', 'isActive', 'usesRemaining', 'tenant'],
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
      name: 'code',
      type: 'text',
      required: true,
      unique: false,
      index: true,
      admin: {
        description: 'The code customers enter at checkout (e.g. SUMMER25)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Internal note about this discount',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage Off', value: 'percentage' },
        { label: 'Fixed Amount Off', value: 'fixed' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: {
        description: 'Percentage (e.g. 25 for 25%) or fixed amount in cents (e.g. 500 for $5.00)',
      },
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      admin: {
        description: 'Minimum order total in cents for this code to apply. Leave blank for no minimum.',
      },
    },
    {
      name: 'maxUses',
      type: 'number',
      admin: {
        description: 'Total number of times this code can be used. Leave blank for unlimited.',
      },
    },
    {
      name: 'usesRemaining',
      type: 'number',
      admin: {
        description: 'Uses remaining (auto-managed). Set equal to maxUses when creating.',
      },
    },
    {
      name: 'maxUsesPerCustomer',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Max times a single customer email can use this code.',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Code is valid starting from this date. Leave blank for immediate.',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Code expires after this date. Leave blank for no expiration.',
      },
    },
    {
      name: 'appliesToProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Limit discount to specific products. Leave empty for all products.',
      },
    },
    {
      name: 'appliesToPlans',
      type: 'relationship',
      relationTo: 'subscription-plans',
      hasMany: true,
      admin: {
        description: 'Limit discount to specific subscription plans. Leave empty for all plans.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
