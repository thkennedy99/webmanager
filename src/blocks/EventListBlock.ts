import type { Block } from 'payload'

export const EventListBlock: Block = {
  slug: 'eventList',
  labels: {
    singular: 'Event List',
    plural: 'Event Lists',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the event list',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Maximum number of events to show',
      },
    },
    {
      name: 'showPast',
      type: 'checkbox',
      defaultValue: false,
      label: 'Include past events',
    },
  ],
}
