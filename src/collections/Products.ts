import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'price', 'productType', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: contentAccess,
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
      unique: false,
      index: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in cents (e.g. 2500 = $25.00)',
      },
    },
    {
      name: 'productType',
      type: 'select',
      required: true,
      defaultValue: 'physical',
      options: [
        { label: 'Physical', value: 'physical' },
        { label: 'Digital', value: 'digital' },
        { label: 'Printful (Print on Demand)', value: 'printful' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'printfulProductId',
      type: 'text',
      admin: {
        description: 'Printful sync product ID (for print-on-demand items)',
        condition: (data) => data?.productType === 'printful',
      },
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Small", "Medium", "Large"' },
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'priceOverride',
          type: 'number',
          admin: {
            description:
              'Override price in cents (leave empty to use base price)',
          },
        },
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
