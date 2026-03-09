import { Container } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'spacer' }>

const sizeMap: Record<string, string> = {
  small: '1rem',
  medium: '2rem',
  large: '4rem',
  xlarge: '6rem',
}

export function SpacerBlockComponent({ block }: { block: Block }) {
  const height = sizeMap[block.size] || '2rem'

  return (
    <div style={{ height }}>
      {block.showDivider && (
        <Container>
          <hr className="m-0" style={{ position: 'relative', top: '50%' }} />
        </Container>
      )}
    </div>
  )
}
