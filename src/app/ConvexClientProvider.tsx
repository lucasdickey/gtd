'use client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useEffect, useState } from 'react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  throw new Error(
    'NEXT_PUBLIC_CONVEX_URL is not set - make sure to run `npx convex dev` or set a production URL'
  )
}

const convex = new ConvexReactClient(convexUrl)

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
