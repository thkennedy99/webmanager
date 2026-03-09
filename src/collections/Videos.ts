import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    group: 'Tenant Configurations',
    defaultColumns: ['title', 'platform', 'tenant'],
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
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Vimeo URL (e.g. "https://vimeo.com/123456789")',
      },
    },
    {
      name: 'platform',
      type: 'select',
      defaultValue: 'vimeo',
      options: [
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order in video gallery',
      },
    },
  ],
}
