import { Container } from 'react-bootstrap'
import { RenderBlocks } from './RenderBlocks'
import type { Media } from '@/payload-types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

const paddingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-3',
  medium: 'py-5',
  large: 'py-6',
}

const styleMap: Record<string, string> = {
  light: 'section-light',
  dark: 'section-dark',
  muted: 'section-muted',
  accent: 'section-accent',
}

const widthMap: Record<string, string | undefined> = {
  narrow: '800px',
  default: undefined,
  wide: '1400px',
  full: '100%',
}

type Props = {
  block: Block
  tenantId?: string | number
  tenantSlug?: string
}

export function SectionBlockComponent({ block, tenantId, tenantSlug }: Props) {
  const bgImage = block.backgroundImage as Media | null | undefined
  const sectionClass = styleMap[block.style || 'light'] || 'section-light'
  const paddingClass = paddingMap[block.padding || 'medium'] || 'py-5'
  const maxWidth = widthMap[block.containerWidth || 'default']
  const innerBlocks = block.blocks || []

  const bgStyle = bgImage?.url
    ? {
        backgroundImage: `url(${bgImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  return (
    <section className={`${sectionClass} ${paddingClass}`} style={bgStyle}>
      {block.containerWidth === 'full' ? (
        <div style={{ maxWidth: maxWidth || undefined }}>
          <RenderBlocks blocks={innerBlocks} tenantId={tenantId} tenantSlug={tenantSlug} />
        </div>
      ) : (
        <Container>
          <div style={{ maxWidth: maxWidth || undefined, margin: maxWidth ? '0 auto' : undefined }}>
            <RenderBlocks blocks={innerBlocks} tenantId={tenantId} tenantSlug={tenantSlug} />
          </div>
        </Container>
      )}
    </section>
  )
}
