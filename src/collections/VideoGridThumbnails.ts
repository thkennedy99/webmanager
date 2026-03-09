import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const VideoGridThumbnails: CollectionConfig = {
  slug: 'video-grid-thumbnails',
  admin: {
    useAsTitle: 'alt',
    group: 'Video Grid',
    defaultColumns: ['alt', 'filename', 'tenant'],
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: ({ req }: AccessArgs) => isAdmin(req),
    update: ({ req }: AccessArgs) => isAdmin(req),
    delete: ({ req }: AccessArgs) => isAdmin(req),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility',
      },
    },
  ],
}
