import type { CollectionConfig } from 'payload'

import { contentAccess } from '../lib/access'

export const Files: CollectionConfig = {
  slug: 'files',
  labels: {
    singular: 'File',
    plural: 'Files',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Tenant Configurations',
    defaultColumns: ['name', 'description', 'filename', 'tenant'],
    description: 'Upload files for download on your site',
  },
  access: contentAccess,
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'text/plain',
      'text/csv',
      'audio/*',
      'video/*',
      'image/*',
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name shown to visitors (the actual filename is hidden)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of the file',
      },
    },
  ],
}
