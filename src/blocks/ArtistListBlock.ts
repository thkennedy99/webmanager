import type { Block } from 'payload'

export const ArtistListBlock: Block = {
  slug: 'artistList',
  labels: {
    singular: 'Artist List',
    plural: 'Artist Lists',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the artist grid',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      admin: {
        description: 'Maximum number of artists to show',
      },
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
