import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/payload.config'
import type { Page, Event, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'eventList' }>

type Props = {
  block: Block
  tenantId?: string | number
}

export async function EventListBlockComponent({ block, tenantId }: Props) {
  if (!tenantId) return null

  const now = new Date().toISOString()
  const payload = await getPayload({ config: await config })

  const where: Where = block.showPast
    ? { tenant: { equals: tenantId } }
    : { and: [{ tenant: { equals: tenantId } }, { date: { greater_than_equal: now } }] }

  const { docs: events } = await payload.find({
    collection: 'events',
    where,
    limit: block.limit || 10,
    sort: block.showPast ? '-date' : 'date',
  })

  return (
    <section className="py-4">
      <Container>
        {block.heading && <h2 className="h4 mb-4 text-center">{block.heading}</h2>}
        <Row className="g-4">
          {events.map((event: Event) => {
            const image = event.image as Media | null | undefined
            const dateStr = new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            return (
              <Col key={event.id} md={6}>
                <div className="artist-card">
                  {image?.url && (
                    <Image
                      src={image.url}
                      alt={image.alt || event.title}
                      width={600}
                      height={300}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  )}
                  <div className="p-3">
                    <h3 className="h5">{event.title}</h3>
                    <p className="text-muted small mb-1">{dateStr}</p>
                    <p className="mb-2">{event.venue}</p>
                    {event.ticketPrice && !event.isSoldOut && (
                      <p className="fw-bold">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(event.ticketPrice / 100)}
                      </p>
                    )}
                    {event.isSoldOut && (
                      <span className="badge bg-danger">Sold Out</span>
                    )}
                    {event.ticketUrl && !event.isSoldOut && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent btn-sm"
                      >
                        Get Tickets
                      </a>
                    )}
                  </div>
                </div>
              </Col>
            )
          })}
          {events.length === 0 && (
            <Col>
              <p className="text-muted">No upcoming events.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}
