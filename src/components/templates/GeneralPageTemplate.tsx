import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type Props = {
  page: Page
  images?: { src: string; alt: string }[]
}

function getImageCols(count: number) {
  if (count === 1) return { md: 8, lg: 6 }
  if (count === 2) return { md: 6 }
  if (count <= 4) return { md: 6, lg: 3 }
  return { md: 6, lg: 4 }
}

export default function GeneralPageTemplate({ page, images }: Props) {
  const colProps = images ? getImageCols(images.length) : {}

  return (
    <section className="section-light">
      <Container>
        {page.heroSubheadline && (
          <p className="lead text-center mb-4">{page.heroSubheadline}</p>
        )}
        {page.content && (
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <RichText data={page.content} />
          </div>
        )}
        {images && images.length > 0 && (
          <Row className="g-4 mt-4 justify-content-center">
            {images.map((img, idx) => (
              <Col key={idx} {...colProps}>
                <div className="image-card">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className="w-100"
                    style={{ objectFit: 'cover', height: images.length === 1 ? 'auto' : '280px' }}
                  />
                  {img.alt && (
                    <p className="image-card-caption">{img.alt}</p>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  )
}
