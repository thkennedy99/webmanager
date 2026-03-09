import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'title',
    group: 'Tenant Configurations',
    defaultColumns: ['title', 'year', 'organization', 'tenant'],
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: contentAccess,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Award name (e.g. "Best New Artist")',
      },
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
      admin: {
        description: 'Awarding body (e.g. "Grammy Awards")',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
