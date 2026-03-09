import React from 'react'

/* Root layout — passthrough to route group layouts.
   Required so Next.js can statically generate the 404 page. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
