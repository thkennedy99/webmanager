import { Container } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'embed' }>

export function EmbedBlockComponent({ block }: { block: Block }) {
  const maxWidth = block.maxWidth === 'full' ? '100%' : `${block.maxWidth}px`

  return (
    <section className="py-4">
      <Container>
        <div className="mx-auto" style={{ maxWidth }}>
          <div dangerouslySetInnerHTML={{ __html: block.code }} />
          {block.caption && (
            <p className="text-muted small mt-2 text-center">{block.caption}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
