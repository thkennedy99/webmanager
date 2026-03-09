import type { Block } from 'payload'

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the cards',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional link URL',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          defaultValue: 'Learn More',
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
  ],
}
