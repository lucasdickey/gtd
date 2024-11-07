'use client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useEffect, useState } from 'react'

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  )

  // Optional: Add error handling for missing URL
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      console.error('NEXT_PUBLIC_CONVEX_URL is not defined!')
    }
  }, [])

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
