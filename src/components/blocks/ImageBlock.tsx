import Image from 'next/image'
import { Container } from 'react-bootstrap'
import type { Page, Media } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'image' }>

const sizeMap: Record<string, number> = {
  small: 400,
  medium: 600,
  large: 800,
}

const alignMap: Record<string, string> = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
}

export function ImageBlockComponent({ block }: { block: Block }) {
  const media = block.image as Media
  if (!media?.url) return null

  const width = sizeMap[block.size || 'medium'] || 600
  const alignClass = alignMap[block.alignment || 'center'] || 'text-center'

  const img = (
    <Image
      src={media.url}
      alt={media.alt || ''}
      width={width}
      height={Math.round(width * 0.667)}
      className="rounded"
      style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
    />
  )

  return (
    <section className="py-4">
      <Container>
        <div className={alignClass}>
          {block.link ? (
            <a href={block.link} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            img
          )}
          {block.caption && (
            <p className="text-muted small mt-2">{block.caption}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
