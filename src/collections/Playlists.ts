import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Playlists: CollectionConfig = {
  slug: 'playlists',
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'tenant'],
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
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tracks',
      type: 'relationship',
      relationTo: 'tracks',
      hasMany: true,
    },
  ],
}
