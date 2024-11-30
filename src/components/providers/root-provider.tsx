'use client'

import { ConvexClientProvider } from '@/app/ConvexClientProvider'

interface RootProviderProps {
  children: React.ReactNode
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 pl-72 transition-all duration-300">
      <div className="h-full p-8">{children}</div>
    </main>
  )
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ConvexClientProvider>
      <div className="flex min-h-screen">
        {/* Navigation */}
        <div className="fixed z-50 h-screen border-r bg-background">
          {children}
        </div>

        {/* Main Content */}
        <MainContent>{children}</MainContent>
      </div>
    </ConvexClientProvider>
  )
}
