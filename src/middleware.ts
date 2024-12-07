import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add the paths that need authentication
const protectedPaths = [
  '/admin/blogs',
  '/admin/projects',
  '/chilled-monkey-brains',
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path needs authentication
  if (protectedPaths.some((prefix) => path.startsWith(prefix))) {
    // Check for session token
    const sessionToken = request.cookies.get('adminSessionToken')

    if (!sessionToken) {
      // Redirect to login if no session token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/chilled-monkey-brains'],
}
