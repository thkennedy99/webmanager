import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  admin: {
    useAsTitle: 'title',
    group: 'Tenant Configurations',
    defaultColumns: ['title', 'artist', 'duration', 'tenant'],
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
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
    },
    {
      name: 'audioFile',
      type: 'text',
      required: true,
      admin: {
        description:
          'Path to MP3 file (e.g. "/audio/erinshore/track-name.mp3")',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Track duration (e.g. "3:45")',
      },
    },
    {
      name: 'trackNumber',
      type: 'number',
    },
    {
      name: 'albumTitle',
      type: 'text',
    },
    {
      name: 'albumArt',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'year',
      type: 'number',
    },
  ],
}
