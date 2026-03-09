'use client'

import { Accordion, Container } from 'react-bootstrap'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'accordion' }>

export function AccordionBlockComponent({ block }: { block: Block }) {
  const defaultKey = block.defaultOpen ? '0' : undefined

  return (
    <section className="py-4">
      <Container>
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          {block.heading && <h2 className="h4 mb-3">{block.heading}</h2>}
          <Accordion defaultActiveKey={defaultKey}>
            {block.items?.map((item, idx) => (
              <Accordion.Item key={item.id || idx} eventKey={String(idx)}>
                <Accordion.Header>{item.title}</Accordion.Header>
                <Accordion.Body>
                  <RichText data={item.content} />
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
