import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const VideoGridItems: CollectionConfig = {
  slug: 'video-grid-items',
  admin: {
    useAsTitle: 'title',
    group: 'Video Grid',
    defaultColumns: ['title', 'year', 'platform', 'tenant'],
    components: {
      beforeListTable: ['@/components/admin/VideoGridImportExport'],
    },
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return true
      if (user.role === 'super-admin') return true
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req }: AccessArgs) => isAdmin(req),
    update: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return false
      if (user.role === 'super-admin') return true
      if (user.role === 'admin' || user.role === 'content-provider') {
        return { tenant: { equals: user.tenant } }
      }
      return false
    },
    delete: ({ req }: AccessArgs) => isAdmin(req),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube or Vimeo URL',
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
      ],
      admin: {
        description: 'Auto-detected from URL if left empty',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) => {
            if (value) return value
            const url = siblingData?.videoUrl as string | undefined
            if (!url) return value
            if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
            if (url.includes('vimeo.com')) return 'vimeo'
            return value
          },
        ],
      },
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        description: 'Year the video was recorded',
      },
    },
    {
      name: 'instruments',
      type: 'relationship',
      relationTo: 'video-grid-instruments',
      hasMany: true,
      admin: {
        description: 'Instruments featured in this video',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'video-grid-locations',
      admin: {
        description: 'Where the video was recorded',
      },
    },
    {
      name: 'useAutoThumbnail',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Use the video platform thumbnail automatically',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'video-grid-thumbnails',
      admin: {
        description: 'Custom thumbnail (overrides auto-thumbnail)',
        condition: (data) => !data?.useAutoThumbnail,
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower = first)',
      },
    },
  ],
}
