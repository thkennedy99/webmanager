import type { Block } from 'payload'

export const TipJarBlock: Block = {
  slug: 'tipJar',
  labels: {
    singular: 'Tip Jar',
    plural: 'Tip Jars',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Leave a Tip',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Enjoyed the show? Leave a tip to support the artists.',
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
        },
        {
          name: 'emoji',
          type: 'text',
          admin: {
            description: 'Optional emoji label',
          },
        },
      ],
      defaultValue: [
        { amount: 3, emoji: 'coffee' },
        { amount: 5, emoji: 'beer' },
        { amount: 10, emoji: 'pizza' },
        { amount: 25, emoji: 'star' },
      ],
    },
    {
      name: 'allowCustomAmount',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
