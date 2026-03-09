import type { Block } from 'payload'
import { innerBlocks } from './innerBlocks'

export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: {
    singular: 'Columns',
    plural: 'Columns',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'half-half',
      options: [
        { label: '50 / 50', value: 'half-half' },
        { label: '33 / 33 / 33', value: 'thirds' },
        { label: '25 / 25 / 25 / 25', value: 'quarters' },
        { label: '66 / 33', value: 'two-thirds-one-third' },
        { label: '33 / 66', value: 'one-third-two-thirds' },
        { label: '75 / 25', value: 'three-quarters-one-quarter' },
        { label: '25 / 75', value: 'one-quarter-three-quarters' },
      ],
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
    {
      name: 'gap',
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
      name: 'columns',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: {
        description: 'Each column can contain any combination of blocks',
      },
      fields: [
        {
          name: 'blocks',
          type: 'blocks',
          blocks: innerBlocks,
          admin: {
            description: 'Add content blocks to this column',
          },
        },
      ],
    },
  ],
}
