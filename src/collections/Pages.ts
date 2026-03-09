import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'
import {
  RichTextBlock,
  ImageBlock,
  ImageGalleryBlock,
  VideoEmbedBlock,
  MusicPlaylistBlock,
  ColumnsBlock,
  SectionBlock,
  GridBlock,
  CTABlock,
  SpacerBlock,
  AccordionBlock,
  CardGridBlock,
  ArtistListBlock,
  EventListBlock,
  ButtonBlock,
  MailingListBlock,
  DonationBlock,
  TipJarBlock,
  EmbedBlock,
  CalendarBlock,
  FileDownloadBlock,
  VideoGridBlock,
} from '../blocks'

const RESERVED_SLUGS = [
  'api',
  'admin',
  '_next',
  'static',
  'favicon.ico',
  'sitemap.xml',
  'robots.txt',
  'media',
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Tenant Configurations',
    defaultColumns: ['title', 'slug', 'pageType', '_status', 'tenant'],
  },
  access: contentAccess,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: false,
      index: true,
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is required'
        if (RESERVED_SLUGS.includes(value)) {
          return `"${value}" is a reserved slug and cannot be used`
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Slug must be lowercase alphanumeric with hyphens only'
        }
        return true
      },
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'General', value: 'general' },
        { label: 'Artists', value: 'artists' },
        { label: 'Events', value: 'events' },
        { label: 'Store', value: 'store' },
        { label: 'Video Gallery', value: 'video-gallery' },
        { label: 'Music', value: 'music' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      admin: {
        description: 'Legacy content field — use Layout blocks below for new pages',
        condition: (data) => !data?.layout || data.layout.length === 0,
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        RichTextBlock,
        ImageBlock,
        ImageGalleryBlock,
        VideoEmbedBlock,
        MusicPlaylistBlock,
        ColumnsBlock,
        SectionBlock,
        GridBlock,
        CTABlock,
        SpacerBlock,
        AccordionBlock,
        CardGridBlock,
        ArtistListBlock,
        EventListBlock,
        ButtonBlock,
        MailingListBlock,
        DonationBlock,
        TipJarBlock,
        EmbedBlock,
        CalendarBlock,
        FileDownloadBlock,
        VideoGridBlock,
      ],
      admin: {
        description: 'Build your page by adding blocks',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      admin: {
        description: 'Optional hero section headline',
      },
    },
    {
      name: 'heroSubheadline',
      type: 'text',
      admin: {
        description: 'Optional hero section subheadline',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'SEO title override (defaults to page title)',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO description',
      },
    },
    {
      name: 'metaKeywords',
      type: 'text',
      admin: {
        description: 'Comma-separated keywords for this page (overrides site-wide defaults)',
      },
    },
    // Content gating
    {
      name: 'requiresSubscription',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Restrict this page to subscribers only',
      },
    },
    {
      name: 'requiredPlanTypes',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Plan types that grant access (e.g. "premium", "patron"). Leave empty for any active subscription.',
        condition: (data) => data?.requiresSubscription === true,
      },
    },
    {
      name: 'gatedMessage',
      type: 'textarea',
      admin: {
        description: 'Message shown to non-subscribers (defaults to a generic prompt)',
        condition: (data) => data?.requiresSubscription === true,
      },
    },
  ],
}
