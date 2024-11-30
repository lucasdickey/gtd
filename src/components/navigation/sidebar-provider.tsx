'use client'

import { SidebarProvider as Provider } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Note: Since we can't use cookies() in client component,
  // we'll handle persistence differently if needed later
  return <Provider defaultOpen={true}>{children}</Provider>
}
