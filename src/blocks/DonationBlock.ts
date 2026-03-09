import type { Block } from 'payload'

export const DonationBlock: Block = {
  slug: 'donation',
  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Support Our Work',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'presetAmounts',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            description: 'Amount in dollars (e.g. 10, 25, 50)',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional label (e.g. "Coffee", "Supporter")',
          },
        },
      ],
      defaultValue: [
        { amount: 10 },
        { amount: 25 },
        { amount: 50 },
        { amount: 100 },
      ],
    },
    {
      name: 'allowCustomAmount',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow custom amount',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Donate',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Accent', value: 'accent' },
      ],
    },
  ],
}
