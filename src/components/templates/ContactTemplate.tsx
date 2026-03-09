'use client'

import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import type { Page } from '@/payload-types'

type Props = {
  page: Page
}

export default function ContactTemplate({ page: _page }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setStatus('sent')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {status === 'sent' ? (
              <div className="text-center py-5">
                <h2 className="h4 mb-3">Thank you!</h2>
                <p>Your message has been sent. We will get back to you soon.</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit} className="contact-form">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Your message..."
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="btn-accent w-100"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </Button>
                {status === 'error' && (
                  <p className="text-danger mt-3 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  )
}
