import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: {
    singular: 'Accordion / FAQ',
    plural: 'Accordions',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the accordion',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor(),
        },
      ],
    },
    {
      name: 'defaultOpen',
      type: 'checkbox',
      defaultValue: false,
      label: 'First item open by default',
    },
  ],
}
