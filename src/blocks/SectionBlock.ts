import type { Block } from 'payload'
import { innerBlocks } from './innerBlocks'

export const SectionBlock: Block = {
  slug: 'section',
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'light',
      options: [
        { label: 'Light (white)', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Muted (gray)', value: 'muted' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'padding',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image',
      },
    },
    {
      name: 'containerWidth',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Narrow (800px)', value: 'narrow' },
        { label: 'Default (container)', value: 'default' },
        { label: 'Wide (1400px)', value: 'wide' },
        { label: 'Full Width', value: 'full' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: innerBlocks,
      admin: {
        description: 'Add content blocks inside this section',
      },
    },
  ],
}
