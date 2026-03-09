import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small (400px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Optional URL — image becomes clickable',
      },
    },
  ],
}
