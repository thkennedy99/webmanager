import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Artist } from '@/payload-types'

type Props = {
  page: Page
  tenantId: string | number
  tenantSlug: string
}

// Map artist slugs to their static image files and extensions
const artistImages: Record<string, { file: string; width: number; height: number }> = {
  '2002': { file: 'artist-2002.webp', width: 500, height: 400 },
  'harber-row': { file: 'artist-harber-row.jpg', width: 500, height: 400 },
  'misty-posey': { file: 'artist-misty-posey.jpg', width: 500, height: 600 },
}

export default async function ArtistsTemplate({ page: _page, tenantId, tenantSlug }: Props) {
  const payload = await getPayload({ config: await config })
  const { docs: artists } = await payload.find({
    collection: 'artists',
    where: { tenant: { equals: tenantId } },
    limit: 50,
    sort: 'name',
  })

  return (
    <section className="section-light">
      <Container>
        <Row className="g-4">
          {artists.map((artist: Artist) => {
            const imgInfo = artistImages[artist.slug]
            const imgSrc = imgInfo
              ? `/images/${tenantSlug}/${imgInfo.file}`
              : null
            return (
              <Col key={artist.id} md={6} lg={4}>
                <div className="artist-card">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={artist.name}
                      width={imgInfo.width}
                      height={imgInfo.height}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '300px' }}
                    />
                  ) : (
                    <div className="artist-placeholder">
                      <span>{artist.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="card-body p-3">
                    <h3 className="h5 card-title">{artist.name}</h3>
                    {artist.genre && (
                      <p className="text-muted small mb-2">{artist.genre}</p>
                    )}
                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-2"
                      >
                        Website
                      </a>
                    )}
                    {artist.socialLinks?.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-2 text-capitalize"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </Col>
            )
          })}
          {artists.length === 0 && (
            <Col>
              <p className="text-muted">No artists found.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}
