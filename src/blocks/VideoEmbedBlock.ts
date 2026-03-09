import type { Block } from 'payload'

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Vimeo or YouTube URL',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'large',
      options: [
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
    },
  ],
}
