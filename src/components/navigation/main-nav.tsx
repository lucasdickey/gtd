'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, ExternalLink, FileText, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

export function MainNav({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname()

  const items = [
    {
      title: 'Home',
      href: '/',
      icon: React.createElement(Home, { className: 'h-4 w-4' }),
      isExternal: false,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: React.createElement(Briefcase, { className: 'h-4 w-4' }),
      isExternal: false,
    },
    {
      title: 'Musings',
      href: '/blog',
      icon: React.createElement(FileText, { className: 'h-4 w-4' }),
      isExternal: false,
    },
    {
      title: 'About',
      href: '/about',
      icon: React.createElement(User, { className: 'h-4 w-4' }),
      isExternal: false,
    },
    {
      title: 'Shop',
      href: 'https://a-ok.shop/',
      icon: React.createElement(ExternalLink, { className: 'h-4 w-4' }),
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
              {item.isExternal
                ? React.createElement(
                    Link,
                    {
                      key: item.href,
                      href: item.href,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: cn(
                        'flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent',
                        isCollapsed && 'justify-center'
                      ),
                    },
                    [
                      item.icon,
                      !isCollapsed &&
                        React.createElement(
                          'span',
                          { key: 'title' },
                          item.title
                        ),
                    ].filter(Boolean)
                  )
                : React.createElement(
                    Link,
                    {
                      key: item.href,
                      href: item.href,
                      className: cn(
                        'flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent',
                        pathname === item.href && 'bg-accent',
                        isCollapsed && 'justify-center'
                      ),
                    },
                    [
                      item.icon,
                      !isCollapsed &&
                        React.createElement(
                          'span',
                          { key: 'title' },
                          item.title
                        ),
                    ].filter(Boolean)
                  )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
