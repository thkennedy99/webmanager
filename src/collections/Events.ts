import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Tenant Configurations',
    defaultColumns: ['title', 'date', 'venue', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: contentAccess,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: false,
      index: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ticketPrice',
      type: 'number',
      admin: {
        description: 'Price in cents (e.g. 2500 = $25.00)',
      },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      admin: {
        description: 'External ticket link (if not using Stripe)',
      },
    },
    {
      name: 'isSoldOut',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
    },
  ],
}
