import type { AccessArgs, User } from 'payload'

type UserWithRole = {
  role?: 'super-admin' | 'admin' | 'content-provider'
  tenant?: number | string
  tenants?: { tenant: number | string | { id: number | string } }[]
} & User

function getUser(req: AccessArgs['req']): UserWithRole | null {
  return req.user as UserWithRole | null
}

export function isSuperAdmin(req: AccessArgs['req']): boolean {
  const user = getUser(req)
  return user?.role === 'super-admin'
}

export function isAdmin(req: AccessArgs['req']): boolean {
  const user = getUser(req)
  return user?.role === 'super-admin' || user?.role === 'admin'
}

export function isContentProvider(req: AccessArgs['req']): boolean {
  const user = getUser(req)
  return user?.role === 'content-provider'
}

/** Full access for super-admin and admin; content-providers can read + update only */
export const contentAccess = {
  read: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return true
    if (user.role === 'super-admin') return true
    return { tenant: { equals: user.tenant } }
  },
  create: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    if (user.role === 'super-admin') return true
    return user.role === 'admin'
  },
  update: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    if (user.role === 'super-admin') return true
    if (user.role === 'admin' || user.role === 'content-provider') {
      return { tenant: { equals: user.tenant } }
    }
    return false
  },
  delete: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    return user.role === 'super-admin' || user.role === 'admin'
  },
}

/** Content-providers can only update pages (edit content), not create/delete */
export const pagesAccess = {
  read: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return true
    if (user.role === 'super-admin') return true
    return { tenant: { equals: user.tenant } }
  },
  create: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    if (user.role === 'super-admin') return true
    return user.role === 'admin'
  },
  update: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    if (user.role === 'super-admin') return true
    if (user.role === 'admin' || user.role === 'content-provider') {
      return { tenant: { equals: user.tenant } }
    }
    return false
  },
  delete: ({ req }: AccessArgs) => {
    const user = getUser(req)
    if (!user) return false
    return user.role === 'super-admin' || user.role === 'admin'
  },
}
