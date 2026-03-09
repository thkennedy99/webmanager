import Link from 'next/link'
import { Container } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'button' }>

const alignMap: Record<string, string> = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
}

const styleMap: Record<string, string> = {
  accent: 'btn-accent',
  dark: 'btn btn-dark',
  'outline-dark': 'btn btn-outline-dark',
  'outline-light': 'btn btn-outline-light',
}

export function ButtonBlockComponent({ block }: { block: Block }) {
  const alignClass = alignMap[block.alignment || 'center'] || 'text-center'

  return (
    <section className="py-4">
      <Container>
        <div className={`${alignClass} d-flex gap-3 flex-wrap ${block.alignment === 'center' ? 'justify-content-center' : block.alignment === 'right' ? 'justify-content-end' : ''}`}>
          {block.buttons?.map((btn, idx) => {
            const btnClass = styleMap[btn.style || 'accent'] || 'btn-accent'
            const sizeClass = btn.size && btn.size !== 'normal' ? `btn-${btn.size}` : ''
            const isExternal = btn.link.startsWith('http')
            const className = `btn ${btnClass} ${sizeClass}`.trim()

            if (isExternal || btn.openInNewTab) {
              return (
                <a
                  key={btn.id || idx}
                  href={btn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {btn.label}
                </a>
              )
            }
            return (
              <Link key={btn.id || idx} href={btn.link} className={className}>
                {btn.label}
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
