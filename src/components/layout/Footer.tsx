import Link from 'next/link'
import { Container } from 'react-bootstrap'

type FooterLink = {
  label: string
  href: string
  openInNewTab?: boolean | null
}

type FooterProps = {
  tenantName: string
  footerText?: string | null
  footerLinks?: FooterLink[] | null
}

export default function Footer({ tenantName, footerText, footerLinks }: FooterProps) {
  const year = new Date().getFullYear()

  // Replace {{year}} placeholder in footer text
  const processedText = footerText
    ? footerText.replace(/\{\{year\}\}/g, String(year))
    : null

  const links = footerLinks && footerLinks.length > 0
    ? footerLinks
    : [{ label: 'Terms of Use', href: '/terms-of-use', openInNewTab: false }]

  return (
    <footer className="site-footer py-4">
      <Container className="text-center">
        {processedText ? (
          <p className="mb-2">{processedText}</p>
        ) : (
          <p className="mb-2">
            &copy; {year} {tenantName}
          </p>
        )}
        <p className="mb-0">
          {links.map((link, i) => {
            const isExternal = link.href.startsWith('http')
            if (isExternal || link.openInNewTab) {
              return (
                <a
                  key={i}
                  href={link.href}
                  className="footer-link me-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link key={i} href={link.href} className="footer-link me-3">
                {link.label}
              </Link>
            )
          })}
        </p>
      </Container>
    </footer>
  )
}
