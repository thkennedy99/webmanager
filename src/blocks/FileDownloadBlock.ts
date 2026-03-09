import type { Block } from 'payload'

export const FileDownloadBlock: Block = {
  slug: 'fileDownload',
  labels: {
    singular: 'File Download',
    plural: 'File Downloads',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the file links',
      },
    },
    {
      name: 'files',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'file',
          type: 'relationship',
          relationTo: 'files',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Override display name (defaults to file name)',
          },
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'Simple List', value: 'list' },
        { label: 'Card Grid', value: 'cards' },
      ],
    },
  ],
}
