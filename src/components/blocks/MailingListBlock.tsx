'use client'

import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'mailingList' }>

const bgMap: Record<string, string> = {
  light: 'section-light',
  dark: 'section-dark',
  accent: 'section-accent',
}

export function MailingListBlockComponent({ block }: { block: Block }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const bgClass = bgMap[block.style || 'dark'] || 'section-dark'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/mailing-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: block.collectName ? name : undefined }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={`${bgClass} py-5`}>
      <Container>
        <div className="mx-auto text-center" style={{ maxWidth: '500px' }}>
          {block.heading && <h2 className="h4 mb-2">{block.heading}</h2>}
          {block.description && <p className="mb-4">{block.description}</p>}
          {status === 'success' ? (
            <p className="fw-bold">Thank you for subscribing!</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              {block.collectName && (
                <Form.Control
                  type="text"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                />
              )}
              <div className="d-flex gap-2">
                <Form.Control
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="btn-accent" disabled={status === 'sending'}>
                  {status === 'sending' ? '...' : block.buttonLabel || 'Subscribe'}
                </Button>
              </div>
              {status === 'error' && (
                <p className="text-danger small mt-2">Something went wrong. Please try again.</p>
              )}
            </Form>
          )}
        </div>
      </Container>
    </section>
  )
}
