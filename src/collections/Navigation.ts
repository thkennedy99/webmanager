import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: {
    useAsTitle: 'label',
    group: 'Tenant Configurations',
    defaultColumns: ['label', 'href', 'order', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: contentAccess,
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'href',
      type: 'text',
      required: true,
      admin: {
        description: 'Relative path (e.g. "/music", "/about")',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Sort order in the navbar (lower = first)',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'children',
      type: 'array',
      admin: {
        description: 'Dropdown sub-items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
