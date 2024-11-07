'use client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

// Add console log to debug the environment variable
console.log('Convex URL:', process.env.NEXT_PUBLIC_CONVEX_URL)

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  // Enhance error message with more debugging info
  throw new Error(
    `NEXT_PUBLIC_CONVEX_URL is not set - Environment: ${process.env.NODE_ENV}\n` +
      'This error can occur if:\n' +
      '1. The environment variable is not set in Vercel\n' +
      '2. The environment variable is not prefixed with NEXT_PUBLIC_\n' +
      '3. The build process is not picking up the environment variable'
  )
}

// Create client only after URL check
const convex = new ConvexReactClient(convexUrl)

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
