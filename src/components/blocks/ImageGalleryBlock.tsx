import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import type { Page, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'imageGallery' }>

const colMap: Record<string, { sm: number; md: number; lg: number }> = {
  '2': { sm: 12, md: 6, lg: 6 },
  '3': { sm: 12, md: 6, lg: 4 },
  '4': { sm: 6, md: 6, lg: 3 },
}

export function ImageGalleryBlockComponent({ block }: { block: Block }) {
  const cols = colMap[block.columns || '3'] || colMap['3']

  return (
    <section className="py-4">
      <Container>
        <Row className="g-4">
          {block.images?.map((item, idx) => {
            const media = item.image as Media
            if (!media?.url) return null
            return (
              <Col key={item.id || idx} sm={cols.sm} md={cols.md} lg={cols.lg}>
                <div className="image-card">
                  <Image
                    src={media.url}
                    alt={media.alt || ''}
                    width={600}
                    height={400}
                    className="w-100"
                    style={{ objectFit: 'cover', height: '280px' }}
                  />
                  {item.caption && (
                    <p className="image-card-caption">{item.caption}</p>
                  )}
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </section>
  )
}
