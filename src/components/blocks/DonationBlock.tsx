'use client'

import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'donation' }>

const bgMap: Record<string, string> = {
  light: 'section-light',
  dark: 'section-dark',
  accent: 'section-accent',
}

export function DonationBlockComponent({ block }: { block: Block }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const bgClass = bgMap[block.style || 'light'] || 'section-light'

  const amount = selected ?? (custom ? Number(custom) : 0)

  async function handleDonate() {
    if (!amount || amount <= 0) return
    // This would integrate with the Stripe payment intent API
    window.location.href = `/api/stripe/create-intent?amount=${amount * 100}&type=donation`
  }

  return (
    <section className={`${bgClass} py-5`}>
      <Container>
        <div className="mx-auto text-center" style={{ maxWidth: '500px' }}>
          {block.heading && <h2 className="h4 mb-2">{block.heading}</h2>}
          {block.description && <p className="mb-4">{block.description}</p>}
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
            {block.presetAmounts?.map((preset, idx) => (
              <Button
                key={idx}
                variant={selected === preset.amount ? 'dark' : 'outline-dark'}
                onClick={() => { setSelected(preset.amount); setCustom('') }}
                className="px-4"
              >
                ${preset.amount}
                {preset.label && <span className="d-block small">{preset.label}</span>}
              </Button>
            ))}
          </div>
          {block.allowCustomAmount && (
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                min="1"
                placeholder="Custom amount ($)"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null) }}
                className="text-center"
              />
            </Form.Group>
          )}
          <Button
            className="btn-accent btn-lg w-100"
            onClick={handleDonate}
            disabled={!amount || amount <= 0}
          >
            {block.buttonLabel || 'Donate'} {amount > 0 && `$${amount}`}
          </Button>
        </div>
      </Container>
    </section>
  )
}
