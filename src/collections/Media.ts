import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'filename', 'alt', 'tenant'],
  },
  access: {
    ...contentAccess,
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*', 'audio/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Descriptive name for this media item',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
