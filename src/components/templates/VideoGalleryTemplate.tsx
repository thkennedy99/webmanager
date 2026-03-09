import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Video } from '@/payload-types'

type Props = {
  page: Page
  tenantId: string | number
}

export default async function VideoGalleryTemplate({ page: _page, tenantId }: Props) {
  const payload = await getPayload({ config: await config })
  const { docs: videos } = await payload.find({
    collection: 'videos',
    where: { tenant: { equals: tenantId } },
    limit: 50,
    sort: 'order',
  })

  return (
    <section className="section-light">
      <Container>
        <Row className="g-4">
          {videos.map((video: Video) => (
            <Col key={video.id} md={6}>
              <div className="ratio ratio-16x9 mb-2 rounded overflow-hidden shadow">
                <iframe
                  src={getEmbedUrl(video.url)}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h3 className="h6">{video.title}</h3>
              {video.description && (
                <p className="text-muted small">{video.description}</p>
              )}
            </Col>
          ))}
          {videos.length === 0 && (
            <Col>
              <p className="text-muted">No videos available.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}

function getEmbedUrl(url: string): string {
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`

  return url
}
