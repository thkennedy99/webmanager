import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Playlist, Track, Artist, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'musicPlaylist' }>

type Props = {
  block: Block
  tenantId?: string | number
}

export async function MusicPlaylistBlockComponent({ block }: Props) {
  const playlistRef = block.playlist
  const playlistId = typeof playlistRef === 'object' ? playlistRef.id : playlistRef

  const payload = await getPayload({ config: await config })
  const playlist = await payload.findByID({
    collection: 'playlists',
    id: playlistId,
    depth: 2,
  }) as Playlist

  if (!playlist) return null

  const tracks = (playlist.tracks || []) as Track[]
  const coverImage = playlist.coverImage as Media | null | undefined

  return (
    <section className="py-4">
      <Container>
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          {block.showCoverImage && coverImage?.url && (
            <div className="text-center mb-3">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || playlist.name}
                width={300}
                height={300}
                className="rounded shadow"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <h3 className="h4 mb-2">{playlist.name}</h3>
          {block.showDescription && playlist.description && (
            <p className="text-muted mb-3">{playlist.description}</p>
          )}
          <Row className="g-2">
            {tracks.map((track: Track, idx) => {
              const artist = track.artist as Artist | undefined
              return (
                <Col key={track.id || idx} xs={12}>
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <span className="text-muted me-3 small">{idx + 1}</span>
                    <div className="flex-grow-1">
                      <strong>{track.title}</strong>
                      {artist && (
                        <span className="text-muted ms-2">{artist.name}</span>
                      )}
                    </div>
                    {track.duration && (
                      <span className="text-muted small">{track.duration}</span>
                    )}
                  </div>
                </Col>
              )
            })}
          </Row>
          {tracks.length === 0 && (
            <p className="text-muted">No tracks in this playlist.</p>
          )}
        </div>
      </Container>
    </section>
  )
}
