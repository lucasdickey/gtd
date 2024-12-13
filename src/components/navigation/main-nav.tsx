'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderKanban, PenTool, User, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MainNav({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname()

  const items = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />,
      isExternal: false,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: <FolderKanban className="h-4 w-4" />,
      isExternal: false,
    },
    {
      title: 'Musings',
      href: '/blog',
      icon: <PenTool className="h-4 w-4" />,
      isExternal: false,
    },
    {
      title: 'About',
      href: '/about',
      icon: <User className="h-4 w-4" />,
      isExternal: false,
    },
    {
      title: 'Shop',
      href: 'https://a-ok.shop/',
      icon: <ExternalLink className="h-4 w-4" />,
      isExternal: true,
    },
  ]

  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="px-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">
          Navigation
        </h2>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent'
                  )}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="flex items-center gap-1">
                      {item.title}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
                    (
                      item.href === '/'
                        ? pathname === '/'
                        : pathname?.startsWith(item.href)
                    )
                      ? 'bg-accent'
                      : 'transparent'
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
