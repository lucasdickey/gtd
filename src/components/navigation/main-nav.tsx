'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderKanban, PenTool, User } from 'lucide-react'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function MainNav({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname()

  const items = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: <FolderKanban className="h-4 w-4" />,
    },
    {
      title: 'Musings',
      href: '/blog',
      icon: <PenTool className="h-4 w-4" />,
    },
    {
      title: 'About',
      href: '/about',
      icon: <User className="h-4 w-4" />,
    },
  ]

  return (
    <SidebarContent>
      <div className="px-2 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Navigation
        </h2>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="no-underline">
              <SidebarMenuItem
                icon={item.icon}
                title={item.title}
                isActive={
                  item.href === '/'
                    ? pathname === '/'
                    : (pathname?.startsWith(item.href) ?? false)
                }
                isCollapsed={isCollapsed}
              />
            </Link>
          ))}
        </SidebarMenu>
      </div>
    </SidebarContent>
  )
}
