import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware, auth } from '@clerk/nextjs/server'

export default clerkMiddleware()

// Custom middleware for basic auth on admin routes
export async function middleware(request: NextRequest) {
  // Handle admin routes with basic auth
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === 'admin' && pwd === 'Bananas0rKeys$') {
        return NextResponse.next()
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  // For all other routes, use Clerk middleware
  return clerkMiddleware()(request)
}

// Combined matcher configuration
export const config = {
  matcher: [
    // Admin routes
    '/admin/:path*',
    // Clerk routes (excluding Next.js internals and static files)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
