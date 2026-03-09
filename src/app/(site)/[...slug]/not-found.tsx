import Link from 'next/link'
import { Container } from 'react-bootstrap'

export default function NotFound() {
  return (
    <section className="section-light text-center py-5">
      <Container>
        <h1>Page Not Found</h1>
        <p className="text-muted mb-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-accent">
          Return Home
        </Link>
      </Container>
    </section>
  )
}
