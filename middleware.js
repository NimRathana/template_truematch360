import { NextResponse } from 'next/server'

// Middleware to protect authenticated routes (dashboard and its subroutes)
// This checks for a cookie named 'authToken'. Replace with your real auth cookie or JWT verification as needed.

export function middleware(req) {
  const { pathname, search } = req.nextUrl

  // Public paths that should bypass auth
  const PUBLIC_PATHS = [
    '/login',
    '/register',
    '/forgot-password',
    '/favicon.ico',
  ]

  // Allow _next, static files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // static assets like .png, .css, etc.
  ) {
    return NextResponse.next()
  }

  // Allow explicitly public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Check for auth token cookie (simple presence check)
  const tokenCookie = req.cookies.get('authToken')
  const hasToken = !!(tokenCookie && tokenCookie.value)

  if (!hasToken) {
    // Redirect to login and preserve original path in `from` query param
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?from=${encodeURIComponent(pathname + (search || ''))}`
    return NextResponse.redirect(url)
  }

  // If token exists, allow
  return NextResponse.next()
}

// Apply middleware to all routes except those we explicitly allow via the logic above.
export const config = {
  matcher: ['/:path*']
}
