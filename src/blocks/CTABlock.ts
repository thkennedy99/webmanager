import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Learn More',
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonStyle',
      type: 'select',
      defaultValue: 'accent',
      options: [
        { label: 'Accent (green)', value: 'accent' },
        { label: 'Dark', value: 'dark' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}
