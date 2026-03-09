import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page, Product, Media } from '@/payload-types'

type Props = {
  page: Page
  tenantId: string | number
}

export default async function StoreTemplate({ page: _page, tenantId }: Props) {
  const payload = await getPayload({ config: await config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { tenant: { equals: tenantId } },
    limit: 50,
    sort: '-featured',
  })

  return (
    <section className="section-light">
      <Container>
        <Row className="g-4">
          {products.map((product: Product) => {
            const firstImage = product.images?.[0]?.image as Media | null | undefined
            return (
              <Col key={product.id} sm={6} lg={4}>
                <div className="artist-card">
                  {firstImage?.url && (
                    <Image
                      src={firstImage.url}
                      alt={firstImage.alt || product.name}
                      width={400}
                      height={400}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '300px' }}
                    />
                  )}
                  <div className="card-body p-3">
                    <h3 className="h5 card-title">{product.name}</h3>
                    <p className="fw-bold mb-2">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(product.price / 100)}
                    </p>
                    {!product.inStock && (
                      <span className="badge bg-secondary">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Col>
            )
          })}
          {products.length === 0 && (
            <Col>
              <p className="text-muted">No products available.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}
