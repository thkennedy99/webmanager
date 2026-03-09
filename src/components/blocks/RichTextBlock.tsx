import { Container } from 'react-bootstrap'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'richText' }>

export function RichTextBlockComponent({ block }: { block: Block }) {
  const maxWidth = block.maxWidth === 'full' ? '100%' : `${block.maxWidth}px`

  const centered = block.alignment === 'center'

  return (
    <section className="py-4">
      <Container>
        <div className="mx-auto" style={{ maxWidth, textAlign: centered ? 'center' : undefined }}>
          <RichText data={block.content} />
        </div>
      </Container>
    </section>
  )
}
