import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'genre', 'tenant'],
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
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'genre',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Spotify', value: 'spotify' },
            { label: 'Apple Music', value: 'apple-music' },
            { label: 'SoundCloud', value: 'soundcloud' },
            { label: 'Bandcamp', value: 'bandcamp' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
