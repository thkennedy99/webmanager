import type { Block } from 'payload'

export const ButtonBlock: Block = {
  slug: 'button',
  labels: {
    singular: 'Button',
    plural: 'Buttons',
  },
  fields: [
    {
      name: 'buttons',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'accent',
          options: [
            { label: 'Accent (green)', value: 'accent' },
            { label: 'Dark', value: 'dark' },
            { label: 'Outline Dark', value: 'outline-dark' },
            { label: 'Outline Light', value: 'outline-light' },
          ],
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Normal', value: 'normal' },
            { label: 'Large', value: 'lg' },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
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
  ],
}
