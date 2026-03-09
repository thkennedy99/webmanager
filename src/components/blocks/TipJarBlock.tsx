'use client'

import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'tipJar' }>

const emojiMap: Record<string, string> = {
  coffee: '\u2615',
  beer: '\uD83C\uDF7A',
  pizza: '\uD83C\uDF55',
  star: '\u2B50',
  heart: '\u2764\uFE0F',
  fire: '\uD83D\uDD25',
  music: '\uD83C\uDFB5',
}

export function TipJarBlockComponent({ block }: { block: Block }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom] = useState('')

  const amount = selected ?? (custom ? Number(custom) : 0)

  async function handleTip() {
    if (!amount || amount <= 0) return
    window.location.href = `/api/stripe/create-intent?amount=${amount * 100}&type=tip`
  }

  return (
    <section className="py-5">
      <Container>
        <div className="mx-auto text-center" style={{ maxWidth: '400px' }}>
          {block.heading && <h2 className="h4 mb-2">{block.heading}</h2>}
          {block.description && <p className="text-muted mb-4">{block.description}</p>}
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
            {block.presetAmounts?.map((preset, idx) => {
              const emoji = preset.emoji ? (emojiMap[preset.emoji] || preset.emoji) : ''
              return (
                <Button
                  key={idx}
                  variant={selected === preset.amount ? 'dark' : 'outline-dark'}
                  onClick={() => { setSelected(preset.amount); setCustom('') }}
                  className="px-3 py-2"
                >
                  {emoji && <span className="d-block" style={{ fontSize: '1.5rem' }}>{emoji}</span>}
                  ${preset.amount}
                </Button>
              )
            })}
          </div>
          {block.allowCustomAmount && (
            <Form.Control
              type="number"
              min="1"
              placeholder="Custom amount ($)"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(null) }}
              className="text-center mb-3"
            />
          )}
          <Button
            className="btn-accent w-100"
            onClick={handleTip}
            disabled={!amount || amount <= 0}
          >
            Send Tip {amount > 0 && `$${amount}`}
          </Button>
        </div>
      </Container>
    </section>
  )
}
