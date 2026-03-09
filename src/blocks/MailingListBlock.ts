import type { Block } from 'payload'

export const MailingListBlock: Block = {
  slug: 'mailingList',
  labels: {
    singular: 'Mailing List Signup',
    plural: 'Mailing List Signups',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Stay in the Loop',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Sign up for our newsletter to get the latest news and updates.',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'collectName',
      type: 'checkbox',
      defaultValue: false,
      label: 'Also collect first name',
    },
  ],
}
