import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Artists } from './collections/Artists'
import { Awards } from './collections/Awards'
import { CustomerSubscriptions } from './collections/CustomerSubscriptions'
import { DiscountCodes } from './collections/DiscountCodes'
import { Events } from './collections/Events'
import { Files } from './collections/Files'
import { MailingListSubscribers } from './collections/MailingListSubscribers'
import { Media } from './collections/Media'
import { Navigation } from './collections/Navigation'
import { Pages } from './collections/Pages'
import { Playlists } from './collections/Playlists'
import { Products } from './collections/Products'
import { SubscriptionPlans } from './collections/SubscriptionPlans'
import { Tenants } from './collections/Tenants'
import { Tracks } from './collections/Tracks'
import { Transactions } from './collections/Transactions'
import { Users } from './collections/Users'
import { SiteThemes } from './collections/SiteThemes'
import { VideoGridInstruments } from './collections/VideoGridInstruments'
import { VideoGridItems } from './collections/VideoGridItems'
import { VideoGridLocations } from './collections/VideoGridLocations'
import { VideoGridThumbnails } from './collections/VideoGridThumbnails'
import { Videos } from './collections/Videos'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
    components: {
      beforeNav: ['@/components/admin/TenantBanner'],
      views: {
        analytics: {
          Component: '@/components/admin/AnalyticsDashboard',
          path: '/analytics',
          meta: {
            title: 'Analytics',
          },
        },
        transactions: {
          Component: '@/components/admin/TransactionDashboard',
          path: '/transactions',
          meta: {
            title: 'Transactions',
          },
        },
      },
    },
  },
  collections: [
    // Tenant Content (ordered logically in sidebar)
    Pages,
    Navigation,
    Artists,
    Tracks,
    Playlists,
    Videos,
    Events,
    Awards,
    Media,
    Files,
    SiteThemes,
    // Store
    Products,
    SubscriptionPlans,
    CustomerSubscriptions,
    DiscountCodes,
    Transactions,
    // Video Grid
    VideoGridItems,
    VideoGridInstruments,
    VideoGridLocations,
    VideoGridThumbnails,
    // Marketing
    MailingListSubscribers,
    // Global
    Tenants,
    Users,
  ],
  globals: [],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      collections: {
        navigation: {},
        pages: {},
        artists: {},
        tracks: {},
        playlists: {},
        videos: {},
        events: {},
        products: {},
        awards: {},
        media: {},
        files: {},
        'site-themes': { isGlobal: true },
        'subscription-plans': {},
        'customer-subscriptions': {},
        'discount-codes': {},
        transactions: {},
        'video-grid-items': {},
        'video-grid-instruments': {},
        'video-grid-locations': {},
        'video-grid-thumbnails': {},
        'mailing-list-subscribers': {},
      },
      tenantsSlug: 'tenants',
      userHasAccessToAllTenants: (user) => {
        const role = (user as { role?: string }).role
        return role === 'super-admin'
      },
      tenantsArrayField: {
        includeDefaultField: true,
        rowFields: [
          {
            name: 'roles',
            type: 'select',
            defaultValue: ['editor'],
            hasMany: true,
            options: [
              { label: 'Editor', value: 'editor' },
              { label: 'Admin', value: 'admin' },
            ],
          },
        ],
      },
    }),
  ],
})
