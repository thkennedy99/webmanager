import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: '800',
      options: [
        { label: 'Narrow (600px)', value: '600' },
        { label: 'Medium (800px)', value: '800' },
        { label: 'Wide (1000px)', value: '1000' },
        { label: 'Full Width', value: 'full' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}
