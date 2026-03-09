import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Playlist, Track, Artist } from '@/payload-types'

type Props = {
  page: Page
  tenantId: string | number
}

export default async function MusicPlayerTemplate({ page: _page, tenantId }: Props) {
  const payload = await getPayload({ config: await config })
  const { docs: playlists } = await payload.find({
    collection: 'playlists',
    where: { tenant: { equals: tenantId } },
    limit: 50,
    depth: 2,
  })

  return (
    <section className="section-light">
      <Container>
        {playlists.map((playlist: Playlist) => {
          const tracks = (playlist.tracks || []) as Track[]
          return (
            <div key={playlist.id} className="mb-5">
              <h2 className="h4 mb-3">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-muted">{playlist.description}</p>
              )}
              <Row className="g-3">
                {tracks.map((track: Track) => {
                  const artist = track.artist as Artist | undefined
                  return (
                    <Col key={track.id} xs={12}>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <div className="flex-grow-1">
                          <strong>{track.title}</strong>
                          {artist && (
                            <span className="text-muted ms-2">
                              {artist.name}
                            </span>
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
            </div>
          )
        })}
        {playlists.length === 0 && (
          <p className="text-muted">No music available.</p>
        )}
      </Container>
    </section>
  )
}
