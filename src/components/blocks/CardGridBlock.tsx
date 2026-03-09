import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import type { Page, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'cardGrid' }>

const colMap: Record<string, { sm: number; md: number; lg: number }> = {
  '2': { sm: 12, md: 6, lg: 6 },
  '3': { sm: 12, md: 6, lg: 4 },
  '4': { sm: 6, md: 6, lg: 3 },
}

export function CardGridBlockComponent({ block }: { block: Block }) {
  const cols = colMap[block.columns || '3'] || colMap['3']

  return (
    <section className="py-4">
      <Container>
        {block.heading && <h2 className="h4 mb-4 text-center">{block.heading}</h2>}
        <Row className="g-4">
          {block.cards?.map((card, idx) => {
            const image = card.image as Media | null | undefined
            return (
              <Col key={card.id || idx} sm={cols.sm} md={cols.md} lg={cols.lg}>
                <div className="artist-card h-100">
                  {image?.url && (
                    <Image
                      src={image.url}
                      alt={image.alt || card.title}
                      width={400}
                      height={300}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '220px' }}
                    />
                  )}
                  <div className="p-3">
                    <h3 className="h5">{card.title}</h3>
                    {card.description && (
                      <p className="text-muted small">{card.description}</p>
                    )}
                    {card.link && (
                      <Link href={card.link} className="btn btn-accent btn-sm">
                        {card.linkLabel || 'Learn More'}
                      </Link>
                    )}
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </section>
  )
}
