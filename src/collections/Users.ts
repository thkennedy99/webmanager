import type { AccessArgs, CollectionConfig } from 'payload'

import { isSuperAdmin, isAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Global Configurations',
    hidden: ({ user }) => {
      const role = (user as { role?: string })?.role
      return role === 'content-provider'
    },
  },
  auth: true,
  access: {
    read: ({ req }: AccessArgs) => {
      if (!req.user) return false
      if (isSuperAdmin(req)) return true
      if (isAdmin(req)) return true
      return { id: { equals: req.user.id } }
    },
    create: ({ req }: AccessArgs) => isSuperAdmin(req),
    update: ({ req }: AccessArgs) => {
      if (!req.user) return false
      if (isSuperAdmin(req)) return true
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }: AccessArgs) => isSuperAdmin(req),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'content-provider',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Content Provider', value: 'content-provider' },
      ],
      access: {
        update: ({ req }) => isSuperAdmin(req),
      },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
}
