'use client'

import { cn } from '@/lib/utils'
import {
  SidebarProvider,
  useSidebar,
} from '@/components/providers/sidebar-context'
import { ConvexClientProvider } from '@/app/ConvexClientProvider'

interface RootProviderProps {
  children: React.ReactNode
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  return (
    <main
      className={cn(
        'flex-1 transition-all duration-300',
        isCollapsed ? 'pl-16' : 'pl-72'
      )}
    >
      <div className="h-full p-8">{children}</div>
    </main>
  )
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ConvexClientProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="fixed z-50 h-screen border-r bg-background">
            {children}
          </div>

          {/* Main Content */}
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </ConvexClientProvider>
  )
}
