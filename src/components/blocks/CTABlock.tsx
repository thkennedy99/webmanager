import Link from 'next/link'
import { Container } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

const bgMap: Record<string, string> = {
  light: 'section-light',
  dark: 'section-dark',
  accent: 'section-accent',
}

const btnMap: Record<string, string> = {
  accent: 'btn-accent',
  dark: 'btn btn-dark',
  outline: 'btn btn-outline-light',
}

export function CTABlockComponent({ block }: { block: Block }) {
  const bgClass = bgMap[block.style || 'dark'] || 'section-dark'
  const btnClass = btnMap[block.buttonStyle || 'accent'] || 'btn-accent'
  const isCenter = block.alignment !== 'left'
  const isExternal = block.buttonLink.startsWith('http')

  return (
    <section className={`${bgClass} py-5`}>
      <Container className={isCenter ? 'text-center' : ''}>
        <h2 className="mb-3">{block.heading}</h2>
        {block.text && <p className="mb-4" style={{ maxWidth: isCenter ? '600px' : undefined, margin: isCenter ? '0 auto 1.5rem' : undefined }}>{block.text}</p>}
        {isExternal ? (
          <a href={block.buttonLink} target="_blank" rel="noopener noreferrer" className={`btn ${btnClass}`}>
            {block.buttonLabel}
          </a>
        ) : (
          <Link href={block.buttonLink} className={`btn ${btnClass}`}>
            {block.buttonLabel}
          </Link>
        )}
      </Container>
    </section>
  )
}
