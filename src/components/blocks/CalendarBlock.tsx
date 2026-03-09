import { Container } from 'react-bootstrap'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/payload.config'
import type { Page, Event } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'calendar' }>

type Props = {
  block: Block
  tenantId?: string | number
}

export async function CalendarBlockComponent({ block, tenantId }: Props) {
  if (!tenantId) return null

  const now = new Date()
  const endDate = new Date(now)
  endDate.setMonth(endDate.getMonth() + (block.monthsToShow || 3))

  const payload = await getPayload({ config: await config })

  const conditions: Where[] = [
    { tenant: { equals: tenantId } },
    { date: { less_than_equal: endDate.toISOString() } },
  ]
  if (!block.showPast) {
    conditions.push({ date: { greater_than_equal: now.toISOString() } })
  }

  const { docs: events } = await payload.find({
    collection: 'events',
    where: { and: conditions },
    limit: 100,
    sort: 'date',
  })

  // Group events by month
  const grouped = new Map<string, Event[]>()
  for (const event of events) {
    const d = new Date(event.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(event)
    // Store label on first element for display
    if (!grouped.get(key)!.length) grouped.set(label, [])
  }

  return (
    <section className="py-4">
      <Container>
        {block.heading && <h2 className="h4 mb-4 text-center">{block.heading}</h2>}
        {events.length === 0 ? (
          <p className="text-muted text-center">No upcoming events.</p>
        ) : (
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            {Array.from(grouped.entries()).map(([monthKey, monthEvents]) => {
              const firstDate = new Date(monthEvents[0].date)
              const monthLabel = firstDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
              return (
                <div key={monthKey} className="mb-4">
                  <h3 className="h5 mb-3 pb-2 border-bottom">{monthLabel}</h3>
                  {monthEvents.map((event) => {
                    const d = new Date(event.date)
                    const dayStr = d.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                    const timeStr = d.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                    return (
                      <div key={event.id} className="d-flex align-items-start p-3 mb-2 bg-light rounded">
                        <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                          <div className="fw-bold">{d.getDate()}</div>
                          <div className="text-muted small">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        </div>
                        <div className="flex-grow-1">
                          <strong>{event.title}</strong>
                          <div className="text-muted small">{dayStr} at {timeStr}</div>
                          <div className="small">{event.venue}</div>
                        </div>
                        {event.ticketUrl && !event.isSoldOut && (
                          <a
                            href={event.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-accent btn-sm ms-2"
                          >
                            Tickets
                          </a>
                        )}
                        {event.isSoldOut && (
                          <span className="badge bg-danger ms-2 align-self-center">Sold Out</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
