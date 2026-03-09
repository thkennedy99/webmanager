import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Artist, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'artistList' }>

const colMap: Record<string, { sm: number; md: number; lg: number }> = {
  '2': { sm: 12, md: 6, lg: 6 },
  '3': { sm: 12, md: 6, lg: 4 },
  '4': { sm: 6, md: 6, lg: 3 },
}

type Props = {
  block: Block
  tenantId?: string | number
  tenantSlug?: string
}

export async function ArtistListBlockComponent({ block, tenantId }: Props) {
  if (!tenantId) return null

  const payload = await getPayload({ config: await config })
  const { docs: artists } = await payload.find({
    collection: 'artists',
    where: { tenant: { equals: tenantId } },
    limit: block.limit || 12,
    sort: 'name',
  })

  const cols = colMap[block.columns || '3'] || colMap['3']

  return (
    <section className="py-4">
      <Container>
        {block.heading && <h2 className="h4 mb-4 text-center">{block.heading}</h2>}
        <Row className="g-4">
          {artists.map((artist: Artist) => {
            const photo = artist.photo as Media | null | undefined
            return (
              <Col key={artist.id} sm={cols.sm} md={cols.md} lg={cols.lg}>
                <div className="artist-card">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt={artist.name}
                      width={500}
                      height={400}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '300px' }}
                    />
                  ) : (
                    <div className="artist-placeholder">
                      <span>{artist.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="h5">{artist.name}</h3>
                    {artist.genre && (
                      <p className="text-muted small mb-2">{artist.genre}</p>
                    )}
                    {artist.website && (
                      <a href={artist.website} target="_blank" rel="noopener noreferrer" className="me-2">
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
