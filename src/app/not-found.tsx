import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '4rem' }}>
        <h1>404 — Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/">Return Home</Link>
      </body>
    </html>
  )
}
