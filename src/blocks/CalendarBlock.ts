import type { Block } from 'payload'

export const CalendarBlock: Block = {
  slug: 'calendar',
  labels: {
    singular: 'Event Calendar',
    plural: 'Event Calendars',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the calendar',
      },
    },
    {
      name: 'showPast',
      type: 'checkbox',
      defaultValue: false,
      label: 'Include past events',
    },
    {
      name: 'defaultView',
      type: 'select',
      defaultValue: 'month',
      options: [
        { label: 'Month', value: 'month' },
        { label: 'List', value: 'list' },
      ],
    },
    {
      name: 'monthsToShow',
      type: 'number',
      defaultValue: 3,
      admin: {
        description: 'Number of months ahead to load events for',
      },
    },
  ],
}
