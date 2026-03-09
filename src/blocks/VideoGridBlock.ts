import type { Block } from 'payload'

export const VideoGridBlock: Block = {
  slug: 'videoGrid',
  labels: {
    singular: 'Video Grid',
    plural: 'Video Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the grid',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      defaultValue: 9,
      admin: {
        description: 'Number of videos per page (should be a multiple of columns)',
      },
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show year/instrument/location filter controls',
      },
    },
    {
      name: 'showPlaylist',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show "Play All" playlist button',
      },
    },
  ],
}
