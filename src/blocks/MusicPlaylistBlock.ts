import type { Block } from 'payload'

export const MusicPlaylistBlock: Block = {
  slug: 'musicPlaylist',
  labels: {
    singular: 'Music Playlist',
    plural: 'Music Playlists',
  },
  fields: [
    {
      name: 'playlist',
      type: 'relationship',
      relationTo: 'playlists',
      required: true,
      admin: {
        description: 'Select a playlist to embed on this page',
      },
    },
    {
      name: 'showCoverImage',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show cover image',
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show playlist description',
    },
  ],
}
