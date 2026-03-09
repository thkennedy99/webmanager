import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const SiteThemes: CollectionConfig = {
  slug: 'site-themes',
  labels: {
    singular: 'Site Theme',
    plural: 'Site Themes',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'tenant'],
    description: 'Configure the visual appearance of your site',
    hidden: ({ user }) => (user as { role?: string })?.role === 'content-provider',
  },
  access: contentAccess,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Default Theme',
      admin: {
        description: 'A label for this theme (e.g. "Default Theme")',
      },
    },

    // ── Site Profile ──────────────────────────────────
    {
      name: 'siteProfile',
      type: 'group',
      label: 'Site Profile',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Site Name',
          admin: {
            description: 'Display name used in metadata and browser tab (defaults to tenant name)',
          },
        },
        {
          name: 'siteIcon',
          type: 'upload',
          label: 'Site Icon (Favicon)',
          relationTo: 'media',
          admin: {
            description: 'Upload a square image (at least 32x32px) for the browser tab icon',
          },
        },
        {
          name: 'footerText',
          type: 'textarea',
          label: 'Footer Text',
          admin: {
            description: 'Custom footer text. Use {{year}} for the current year. Example: "© {{year}} My Company. All rights reserved."',
          },
        },
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          maxRows: 10,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    // ── Hero Slides ────────────────────────────────────
    {
      name: 'heroSlides',
      type: 'array',
      label: 'Hero Carousel Images',
      maxRows: 8,
      admin: {
        description: 'Images shown in the hero carousel on all pages. Upload at least one image.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: { description: 'Describe the image for accessibility' },
        },
      ],
    },

    // ── SEO & Analytics ───────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Analytics',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics Measurement ID',
          admin: {
            description: 'GA4 Measurement ID (e.g. G-XXXXXXXXXX)',
          },
        },
        {
          name: 'googleSearchConsoleVerification',
          type: 'text',
          label: 'Google Search Console Verification',
          admin: {
            description: 'Content value from the Google Search Console verification meta tag',
          },
        },
        {
          name: 'defaultMetaKeywords',
          type: 'text',
          label: 'Default Meta Keywords',
          admin: {
            description: 'Comma-separated keywords applied to all pages (page-level keywords override these)',
          },
        },
        {
          name: 'customHeadContent',
          type: 'code',
          label: 'Custom Head Content',
          admin: {
            language: 'html',
            description: 'Raw HTML injected into <head> on every page. Use for tracking scripts, custom meta tags, etc.',
          },
        },
      ],
    },

    // ── Typography ──────────────────────────────────────
    {
      name: 'typography',
      type: 'group',
      label: 'Typography',
      fields: [
        {
          name: 'headingFont',
          type: 'select',
          label: 'Heading Font',
          defaultValue: 'Open Sans',
          options: [
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Montserrat', value: 'Montserrat' },
            { label: 'Playfair Display', value: 'Playfair Display' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Lato', value: 'Lato' },
            { label: 'Poppins', value: 'Poppins' },
            { label: 'Raleway', value: 'Raleway' },
            { label: 'Merriweather', value: 'Merriweather' },
            { label: 'Oswald', value: 'Oswald' },
            { label: 'Georgia', value: 'Georgia' },
          ],
        },
        {
          name: 'bodyFont',
          type: 'select',
          label: 'Body Font',
          defaultValue: 'Assistant',
          options: [
            { label: 'Assistant', value: 'Assistant' },
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Lato', value: 'Lato' },
            { label: 'Source Sans Pro', value: 'Source Sans 3' },
            { label: 'Inter', value: 'Inter' },
            { label: 'Nunito', value: 'Nunito' },
            { label: 'PT Sans', value: 'PT Sans' },
          ],
        },
        {
          name: 'h1Size',
          type: 'number',
          label: 'H1 Size (px)',
          defaultValue: 40,
          admin: { description: 'Range: 28–60px', step: 1 },
          min: 28,
          max: 60,
        },
        {
          name: 'h2Size',
          type: 'number',
          label: 'H2 Size (px)',
          defaultValue: 32,
          min: 22,
          max: 48,
        },
        {
          name: 'h3Size',
          type: 'number',
          label: 'H3 Size (px)',
          defaultValue: 26,
          min: 18,
          max: 40,
        },
        {
          name: 'h4Size',
          type: 'number',
          label: 'H4 Size (px)',
          defaultValue: 22,
          min: 16,
          max: 36,
        },
        {
          name: 'bodySize',
          type: 'number',
          label: 'Body Text Size (px)',
          defaultValue: 16,
          min: 14,
          max: 22,
        },
        {
          name: 'headingWeight',
          type: 'select',
          label: 'Heading Weight',
          defaultValue: '700',
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Semi-Bold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
            { label: 'Extra Bold (800)', value: '800' },
            { label: 'Black (900)', value: '900' },
          ],
        },
        {
          name: 'lineHeight',
          type: 'select',
          label: 'Body Line Height',
          defaultValue: '1.6',
          options: [
            { label: 'Tight (1.4)', value: '1.4' },
            { label: 'Normal (1.6)', value: '1.6' },
            { label: 'Relaxed (1.8)', value: '1.8' },
          ],
        },
      ],
    },

    // ── Colors ──────────────────────────────────────────
    {
      name: 'colors',
      type: 'group',
      label: 'Colors',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Primary Color',
          defaultValue: '#1a1a2e',
          admin: { description: 'Main brand color (hex)' },
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Color',
          defaultValue: '#1fa85d',
          admin: { description: 'Buttons, links, highlights (hex)' },
        },
        {
          name: 'accentHover',
          type: 'text',
          label: 'Accent Hover Color',
          defaultValue: '#5c24eb',
        },
        {
          name: 'bodyBackground',
          type: 'text',
          label: 'Page Background',
          defaultValue: '#ffffff',
        },
        {
          name: 'bodyText',
          type: 'text',
          label: 'Body Text Color',
          defaultValue: '#222222',
        },
        {
          name: 'navBackground',
          type: 'text',
          label: 'Navbar Background',
          defaultValue: '#000000',
        },
        {
          name: 'navText',
          type: 'text',
          label: 'Navbar Text Color',
          defaultValue: '#ffffffd9',
          admin: { description: 'Supports hex with alpha (e.g. #ffffffd9)' },
        },
        {
          name: 'footerBackground',
          type: 'text',
          label: 'Footer Background',
          defaultValue: '#1a1a1a',
        },
        {
          name: 'footerText',
          type: 'text',
          label: 'Footer Text Color',
          defaultValue: '#ffffffb3',
        },
        {
          name: 'darkSectionBg',
          type: 'text',
          label: 'Dark Section Background',
          defaultValue: '#3b3b3b',
        },
      ],
    },

    // ── Navigation ──────────────────────────────────────
    {
      name: 'navigation',
      type: 'group',
      label: 'Navigation',
      fields: [
        {
          name: 'fontSize',
          type: 'number',
          label: 'Menu Font Size (px)',
          defaultValue: 14,
          min: 12,
          max: 20,
        },
        {
          name: 'textTransform',
          type: 'select',
          label: 'Menu Text Style',
          defaultValue: 'uppercase',
          options: [
            { label: 'Uppercase', value: 'uppercase' },
            { label: 'Normal', value: 'none' },
            { label: 'Capitalize', value: 'capitalize' },
          ],
        },
        {
          name: 'fontWeight',
          type: 'select',
          label: 'Menu Font Weight',
          defaultValue: '600',
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Semi-Bold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
          ],
        },
        {
          name: 'letterSpacing',
          type: 'select',
          label: 'Letter Spacing',
          defaultValue: '0.5',
          options: [
            { label: 'None', value: '0' },
            { label: 'Small (0.5px)', value: '0.5' },
            { label: 'Medium (1px)', value: '1' },
            { label: 'Wide (1.5px)', value: '1.5' },
          ],
        },
      ],
    },

    // ── Hero / Header ───────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      label: 'Hero / Page Header',
      fields: [
        {
          name: 'height',
          type: 'number',
          label: 'Hero Carousel Height (vh)',
          defaultValue: 70,
          min: 30,
          max: 100,
          admin: { description: 'Percentage of viewport height (30–100)' },
        },
        {
          name: 'minHeight',
          type: 'number',
          label: 'Minimum Height (px)',
          defaultValue: 400,
          min: 200,
          max: 800,
        },
        {
          name: 'maxHeight',
          type: 'number',
          label: 'Maximum Height (px)',
          defaultValue: 700,
          min: 400,
          max: 1200,
        },
        {
          name: 'overlayOpacity',
          type: 'select',
          label: 'Image Overlay Darkness',
          defaultValue: '0.5',
          options: [
            { label: 'None', value: '0' },
            { label: 'Light (0.2)', value: '0.2' },
            { label: 'Medium-Light (0.35)', value: '0.35' },
            { label: 'Medium (0.5)', value: '0.5' },
            { label: 'Dark (0.6)', value: '0.6' },
            { label: 'Very Dark (0.8)', value: '0.8' },
          ],
        },
        {
          name: 'headlineSize',
          type: 'number',
          label: 'Headline Font Size (rem)',
          defaultValue: 2.8,
          min: 1.5,
          max: 5,
          admin: { step: 0.1 },
        },
        {
          name: 'subheadlineSize',
          type: 'number',
          label: 'Subheadline Font Size (rem)',
          defaultValue: 1.2,
          min: 0.9,
          max: 2,
          admin: { step: 0.1 },
        },
      ],
    },

    // ── Buttons ─────────────────────────────────────────
    {
      name: 'buttons',
      type: 'group',
      label: 'Buttons',
      fields: [
        {
          name: 'borderRadius',
          type: 'select',
          label: 'Button Border Radius',
          defaultValue: '4',
          options: [
            { label: 'Square (0px)', value: '0' },
            { label: 'Slight (4px)', value: '4' },
            { label: 'Rounded (8px)', value: '8' },
            { label: 'Pill (50px)', value: '50' },
          ],
        },
        {
          name: 'paddingX',
          type: 'select',
          label: 'Horizontal Padding',
          defaultValue: '1.5',
          options: [
            { label: 'Compact (0.75rem)', value: '0.75' },
            { label: 'Normal (1.5rem)', value: '1.5' },
            { label: 'Wide (2.5rem)', value: '2.5' },
          ],
        },
        {
          name: 'paddingY',
          type: 'select',
          label: 'Vertical Padding',
          defaultValue: '0.6',
          options: [
            { label: 'Compact (0.4rem)', value: '0.4' },
            { label: 'Normal (0.6rem)', value: '0.6' },
            { label: 'Tall (0.8rem)', value: '0.8' },
          ],
        },
        {
          name: 'fontWeight',
          type: 'select',
          label: 'Button Font Weight',
          defaultValue: '600',
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Semi-Bold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
          ],
        },
        {
          name: 'textTransform',
          type: 'select',
          label: 'Button Text Style',
          defaultValue: 'none',
          options: [
            { label: 'Normal', value: 'none' },
            { label: 'Uppercase', value: 'uppercase' },
          ],
        },
      ],
    },

    // ── Spacing ─────────────────────────────────────────
    {
      name: 'spacing',
      type: 'group',
      label: 'Spacing',
      fields: [
        {
          name: 'sectionPadding',
          type: 'select',
          label: 'Section Padding',
          defaultValue: '4',
          options: [
            { label: 'Compact (2rem)', value: '2' },
            { label: 'Normal (4rem)', value: '4' },
            { label: 'Generous (5rem)', value: '5' },
            { label: 'Spacious (6rem)', value: '6' },
          ],
        },
        {
          name: 'containerWidth',
          type: 'select',
          label: 'Content Max Width',
          defaultValue: '1200',
          options: [
            { label: 'Narrow (960px)', value: '960' },
            { label: 'Standard (1200px)', value: '1200' },
            { label: 'Wide (1400px)', value: '1400' },
          ],
        },
      ],
    },

    // ── Mobile Overrides (< 768px) ─────────────────────
    {
      name: 'mobile',
      type: 'group',
      label: 'Mobile (< 768px)',
      admin: {
        description: 'Override settings for mobile screens. Leave blank to auto-scale from desktop values.',
      },
      fields: [
        {
          name: 'h1Size',
          type: 'number',
          label: 'H1 Size (px)',
          min: 22,
          max: 48,
          admin: { description: 'Leave blank to auto-scale (desktop × 0.7)' },
        },
        {
          name: 'h2Size',
          type: 'number',
          label: 'H2 Size (px)',
          min: 20,
          max: 40,
        },
        {
          name: 'h3Size',
          type: 'number',
          label: 'H3 Size (px)',
          min: 16,
          max: 32,
        },
        {
          name: 'bodySize',
          type: 'number',
          label: 'Body Text Size (px)',
          min: 14,
          max: 20,
        },
        {
          name: 'heroHeight',
          type: 'number',
          label: 'Hero Height (vh)',
          min: 20,
          max: 80,
          admin: { description: 'Hero carousel height on mobile' },
        },
        {
          name: 'heroMinHeight',
          type: 'number',
          label: 'Hero Min Height (px)',
          min: 150,
          max: 500,
        },
        {
          name: 'heroHeadlineSize',
          type: 'number',
          label: 'Hero Headline Size (rem)',
          min: 1.2,
          max: 3,
          admin: { step: 0.1 },
        },
        {
          name: 'heroSubheadlineSize',
          type: 'number',
          label: 'Hero Subheadline Size (rem)',
          min: 0.8,
          max: 1.6,
          admin: { step: 0.1 },
        },
        {
          name: 'sectionPadding',
          type: 'select',
          label: 'Section Padding',
          options: [
            { label: 'Compact (1.5rem)', value: '1.5' },
            { label: 'Normal (2.5rem)', value: '2.5' },
            { label: 'Generous (3.5rem)', value: '3.5' },
          ],
        },
        {
          name: 'navFontSize',
          type: 'number',
          label: 'Nav Font Size (px)',
          min: 12,
          max: 18,
        },
      ],
    },

    // ── Tablet Overrides (768px – 991px) ───────────────
    {
      name: 'tablet',
      type: 'group',
      label: 'Tablet (768px – 991px)',
      admin: {
        description: 'Override settings for tablet screens. Leave blank to use desktop values.',
      },
      fields: [
        {
          name: 'h1Size',
          type: 'number',
          label: 'H1 Size (px)',
          min: 24,
          max: 52,
        },
        {
          name: 'h2Size',
          type: 'number',
          label: 'H2 Size (px)',
          min: 20,
          max: 44,
        },
        {
          name: 'bodySize',
          type: 'number',
          label: 'Body Text Size (px)',
          min: 14,
          max: 20,
        },
        {
          name: 'heroHeight',
          type: 'number',
          label: 'Hero Height (vh)',
          min: 30,
          max: 90,
        },
        {
          name: 'heroHeadlineSize',
          type: 'number',
          label: 'Hero Headline Size (rem)',
          min: 1.5,
          max: 4,
          admin: { step: 0.1 },
        },
        {
          name: 'sectionPadding',
          type: 'select',
          label: 'Section Padding',
          options: [
            { label: 'Compact (2rem)', value: '2' },
            { label: 'Normal (3rem)', value: '3' },
            { label: 'Generous (4rem)', value: '4' },
          ],
        },
      ],
    },
  ],
}
