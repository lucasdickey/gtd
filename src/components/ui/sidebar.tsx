'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  children: React.ReactNode
}

interface CollapsibleProps {
  isCollapsed: boolean
  onCollapse: (value: boolean) => void
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      <div className="flex h-full flex-col">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<CollapsibleProps>,
              {
                isCollapsed,
                onCollapse: setIsCollapsed,
              }
            )
          }
          return child
        })}
      </div>
    </aside>
  )
}

export function SidebarHeader({
  children,
  isCollapsed,
  onCollapse,
}: React.PropsWithChildren<CollapsibleProps>) {
  return (
    <div className="sticky top-0 z-10 bg-background">
      <header
        className={cn(
          'flex h-16 items-center justify-between border-b px-4',
          isCollapsed && 'justify-center'
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {children}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => onCollapse(!isCollapsed)}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </header>
    </div>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-2 p-4">{children}</div>
    </ScrollArea>
  )
}

export function SidebarCollapseButton({
  isCollapsed,
  onCollapse,
}: CollapsibleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => onCollapse(!isCollapsed)}
    >
      {isCollapsed ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  )
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="flex flex-col gap-1">{children}</nav>
}

export function SidebarMenuItem({
  icon,
  title,
  isActive,
  href,
  onClick,
  isCollapsed,
}: {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  href?: string
  onClick?: () => void
  isCollapsed?: boolean
}) {
  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent/50',
        isCollapsed && 'justify-center px-2'
      )}
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </Component>
  )
}
