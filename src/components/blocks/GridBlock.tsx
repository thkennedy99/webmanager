import { Container } from 'react-bootstrap'
import { RenderBlocks } from './RenderBlocks'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

const gapMap: Record<string, string> = {
  none: '0',
  small: '0.5rem',
  medium: '1.5rem',
  large: '3rem',
}

type Props = {
  block: Block
  tenantId?: string | number
  tenantSlug?: string
}

export function GridBlockComponent({ block, tenantId, tenantSlug }: Props) {
  const items = block.items || []
  const cols = Number(block.columns) || 3
  const mobileCols = Number(block.mobileColumns) || 1
  const tabletCols = Number(block.tabletColumns) || 2
  const gap = gapMap[block.gap || 'medium'] || '1.5rem'
  const align = block.verticalAlignment || 'stretch'

  // Generate a unique ID for scoped CSS
  const gridId = `grid-${block.id || Math.random().toString(36).slice(2, 8)}`

  const gridCSS = `
    #${gridId} {
      display: grid;
      grid-template-columns: repeat(${mobileCols}, 1fr);
      gap: ${gap};
      align-items: ${align};
    }
    @media (min-width: 768px) {
      #${gridId} {
        grid-template-columns: repeat(${tabletCols}, 1fr);
      }
    }
    @media (min-width: 992px) {
      #${gridId} {
        grid-template-columns: repeat(${cols}, 1fr);
      }
    }
  `

  return (
    <section className="py-4">
      <Container>
        <style dangerouslySetInnerHTML={{ __html: gridCSS }} />
        <div id={gridId}>
          {items.map((item: Block, idx: number) => {
            const colSpan = item.colSpan === 'full' ? cols : Number(item.colSpan) || 1
            const innerBlocks = item.blocks || []
            return (
              <div
                key={item.id || idx}
                style={colSpan > 1 ? { gridColumn: `span ${colSpan}` } : undefined}
              >
                <RenderBlocks blocks={innerBlocks} tenantId={tenantId} tenantSlug={tenantSlug} />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
