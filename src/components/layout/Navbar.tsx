'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container, Nav, Navbar as BSNavbar, NavDropdown } from 'react-bootstrap'

type NavChild = {
  label: string
  href: string
  openInNewTab?: boolean | null
}

type NavItem = {
  id: string | number
  label: string
  href: string
  order: number
  openInNewTab?: boolean | null
  children?: NavChild[]
}

type SocialLink = {
  platform: string
  url: string
}

type NavbarProps = {
  tenantName: string
  tenantSlug: string
  navItems: NavItem[]
  socialLinks?: SocialLink[]
}

export default function Navbar({ tenantName, tenantSlug, navItems, socialLinks }: NavbarProps) {
  const pathname = usePathname()

  const sorted = [...navItems].sort((a, b) => a.order - b.order)

  return (
    <BSNavbar expand="lg" sticky="top" className="site-navbar" data-bs-theme="dark">
      <Container>
        <BSNavbar.Brand as={Link} href="/" className="d-flex align-items-center gap-2">
          <Image
            src={`/images/${tenantSlug}/logo.jpg`}
            alt={`${tenantName} logo`}
            width={50}
            height={50}
            className="rounded"
            style={{ objectFit: 'contain' }}
          />
          <span className="fw-bold">{tenantName}</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-label="Toggle navigation" />

        <BSNavbar.Collapse>
          <Nav className="ms-auto align-items-center">
            {sorted.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <NavDropdown
                    key={item.id}
                    title={item.label}
                    active={pathname.startsWith(item.href)}
                  >
                    {item.children.map((child, idx) => (
                      <NavDropdown.Item
                        key={idx}
                        as={Link}
                        href={child.href}
                        target={child.openInNewTab ? '_blank' : undefined}
                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                      >
                        {child.label}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                )
              }

              return (
                <Nav.Link
                  key={item.id}
                  as={Link}
                  href={item.href}
                  active={pathname === item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </Nav.Link>
              )
            })}

            {socialLinks && socialLinks.length > 0 && (
              <Nav className="flex-row ms-lg-3 gap-2">
                {socialLinks.map((link, idx) => (
                  <Nav.Link
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="px-1"
                  >
                    <SocialIcon platform={link.platform} />
                  </Nav.Link>
                ))}
              </Nav>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'youtube':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.6c-1 .3-1.7 1.1-2 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2.1 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.6c1-.3 1.7-1.1 2-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.4 3.6-6.4 3.6z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.1c0-6.6-5.4-12-12-12S0 5.5 0 12.1c0 6 4.4 10.9 10.1 11.9v-8.4H7.1v-3.5h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12.1z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.2 1h3.5l-7.7 8.8L23 23h-7.1l-5.5-7.2L4.5 23H1l8.2-9.4L.7 1h7.3l5 6.6L18.2 1zm-1.2 19.8h2L6.9 3h-2l12.1 17.8z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.3-2.2.4-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.3 2.2-.4 1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c0 1.3.2 2.2.5 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .5 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3 0 2.2-.2 3-.5.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.5-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c0-1.3-.2-2.2-.5-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.7-.5-3-.5C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
        </svg>
      )
    default:
      return <span>{platform}</span>
  }
}
