import type { AccessArgs, CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const VideoGridInstruments: CollectionConfig = {
  slug: 'video-grid-instruments',
  admin: {
    useAsTitle: 'name',
    group: 'Video Grid',
    defaultColumns: ['name', 'tenant'],
  },
  access: {
    read: ({ req }: AccessArgs) => {
      const user = req.user as { role?: string; tenant?: number | string } | null
      if (!user) return true
      if (user.role === 'super-admin') return true
      return { tenant: { equals: user.tenant } }
    },
    create: ({ req }: AccessArgs) => isAdmin(req),
    update: ({ req }: AccessArgs) => isAdmin(req),
    delete: ({ req }: AccessArgs) => isAdmin(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
