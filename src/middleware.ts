import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3002'
  const hostname = host.split(':')[0]

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-host', hostname)

  // Support tenant preview via query param or cookie
  const tenantSlug = request.nextUrl.searchParams.get('__tenant')
  if (tenantSlug) {
    // Set the slug header and persist in a cookie for subsequent requests
    requestHeaders.set('x-tenant-slug', tenantSlug)
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    })
    response.cookies.set('__tenant', tenantSlug, {
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
      httpOnly: false,
      sameSite: 'lax',
    })
    return response
  }

  // Check cookie for persisted tenant override
  const cookieTenant = request.cookies.get('__tenant')?.value
  if (cookieTenant) {
    requestHeaders.set('x-tenant-slug', cookieTenant)
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|audio|api/.*|admin).*)'],
}
