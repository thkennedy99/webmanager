import { Col, Container, Row } from 'react-bootstrap'
import { RenderBlocks } from './RenderBlocks'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

function getColSizes(layout: string, index: number, total: number): { md: number } {
  switch (layout) {
    case 'half-half':
      return { md: 6 }
    case 'thirds':
      return { md: 4 }
    case 'quarters':
      return { md: 3 }
    case 'two-thirds-one-third':
      return { md: index === 0 ? 8 : 4 }
    case 'one-third-two-thirds':
      return { md: index === 0 ? 4 : 8 }
    case 'three-quarters-one-quarter':
      return { md: index === 0 ? 9 : 3 }
    case 'one-quarter-three-quarters':
      return { md: index === 0 ? 3 : 9 }
    default:
      return { md: Math.floor(12 / total) }
  }
}

const alignMap: Record<string, string> = {
  top: 'align-items-start',
  center: 'align-items-center',
  bottom: 'align-items-end',
}

const gapMap: Record<string, string> = {
  none: 'g-0',
  small: 'g-2',
  medium: 'g-4',
  large: 'g-5',
}

type Props = {
  block: Block
  tenantId?: string | number
  tenantSlug?: string
}

export function ColumnsBlockComponent({ block, tenantId, tenantSlug }: Props) {
  const columns = block.columns || []
  const alignClass = alignMap[block.verticalAlignment || 'top'] || ''
  const gapClass = gapMap[block.gap || 'medium'] || 'g-4'

  return (
    <section className="py-4">
      <Container>
        <Row className={`${gapClass} ${alignClass}`}>
          {columns.map((col: Block, idx: number) => {
            const colSize = getColSizes(block.layout, idx, columns.length)
            const innerBlocks = col.blocks || []
            return (
              <Col key={col.id || idx} md={colSize.md}>
                <RenderBlocks blocks={innerBlocks} tenantId={tenantId} tenantSlug={tenantSlug} />
              </Col>
            )
          })}
        </Row>
      </Container>
    </section>
  )
}
