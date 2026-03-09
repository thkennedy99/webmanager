import type { Block } from 'payload'

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: {
    singular: 'Spacer / Divider',
    plural: 'Spacers / Dividers',
  },
  fields: [
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Small (1rem)', value: 'small' },
        { label: 'Medium (2rem)', value: 'medium' },
        { label: 'Large (4rem)', value: 'large' },
        { label: 'Extra Large (6rem)', value: 'xlarge' },
      ],
    },
    {
      name: 'showDivider',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show horizontal line',
    },
  ],
}
