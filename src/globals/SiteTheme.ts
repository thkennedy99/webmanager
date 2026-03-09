import type { GlobalConfig } from 'payload'

export const SiteTheme: GlobalConfig = {
  slug: 'site-theme',
  label: 'Site Theme',
  admin: {
    description: 'Configure the visual appearance of your site',
  },
  access: {
    read: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      return (req.user as { role?: string }).role === 'super-admin' ||
        (req.user as { role?: string }).role === 'tenant-editor'
    },
  },
  fields: [
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
          admin: {
            description: 'Range: 28–60px',
            step: 1,
          },
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
  ],
}
