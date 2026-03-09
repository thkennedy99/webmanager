import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: {
    singular: 'Embed Code',
    plural: 'Embed Codes',
  },
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Paste embed code (iframe, script tag, etc.)',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: '800',
      options: [
        { label: 'Small (400px)', value: '400' },
        { label: 'Medium (600px)', value: '600' },
        { label: 'Large (800px)', value: '800' },
        { label: 'Full Width', value: 'full' },
      ],
    },
  ],
}
