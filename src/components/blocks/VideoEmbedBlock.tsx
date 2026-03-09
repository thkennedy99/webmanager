import { Container } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'videoEmbed' }>

const sizeMap: Record<string, string> = {
  medium: '600px',
  large: '800px',
  full: '100%',
}

function getEmbedUrl(url: string): string {
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`

  return url
}

export function VideoEmbedBlockComponent({ block }: { block: Block }) {
  const maxWidth = sizeMap[block.size || 'large'] || '800px'
  const embedUrl = getEmbedUrl(block.url)

  return (
    <section className="py-4">
      <Container>
        <div className="mx-auto" style={{ maxWidth }}>
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow">
            <iframe
              src={embedUrl}
              title={block.caption || 'Embedded video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <p className="text-muted small mt-2 text-center">{block.caption}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
