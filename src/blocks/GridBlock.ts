import type { Block } from 'payload'
import { innerBlocks } from './innerBlocks'

export const GridBlock: Block = {
  slug: 'grid',
  labels: {
    singular: 'Layout Grid',
    plural: 'Layout Grids',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      required: true,
      defaultValue: '3',
      label: 'Grid Columns',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
        { label: '5 Columns', value: '5' },
        { label: '6 Columns', value: '6' },
      ],
    },
    {
      name: 'mobileColumns',
      type: 'select',
      defaultValue: '1',
      label: 'Mobile Columns',
      admin: {
        description: 'Number of columns on small screens',
      },
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
    },
    {
      name: 'tabletColumns',
      type: 'select',
      defaultValue: '2',
      label: 'Tablet Columns',
      admin: {
        description: 'Number of columns on medium screens',
      },
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
    },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small (0.5rem)', value: 'small' },
        { label: 'Medium (1.5rem)', value: 'medium' },
        { label: 'Large (3rem)', value: 'large' },
      ],
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      defaultValue: 'stretch',
      options: [
        { label: 'Top', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'end' },
        { label: 'Stretch (equal height)', value: 'stretch' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Each item occupies one grid cell. Add blocks inside each cell.',
      },
      fields: [
        {
          name: 'colSpan',
          type: 'select',
          defaultValue: '1',
          label: 'Column Span',
          admin: {
            description: 'How many columns this cell spans',
          },
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: 'Full Row', value: 'full' },
          ],
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: innerBlocks,
        },
      ],
    },
  ],
}
