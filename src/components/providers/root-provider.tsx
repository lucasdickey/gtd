'use client'

import { ConvexClientProvider } from '@/app/ConvexClientProvider'
import { MainNav } from '@/components/navigation/main-nav'
import { NavHeader } from '@/components/navigation/nav-header'
import React from 'react'

interface RootProviderProps {
  children: React.ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  return React.createElement(
    ConvexClientProvider,
    null,
    React.createElement('div', { className: 'flex min-h-screen' }, [
      React.createElement(
        'div',
        {
          key: 'nav',
          className: 'fixed z-50 h-screen border-r bg-background',
        },
        [
          React.createElement(NavHeader, { key: 'header' }),
          React.createElement(MainNav, { key: 'nav' }),
        ]
      ),
      React.createElement(
        'div',
        {
          key: 'content',
          className: 'flex-1 pl-[250px]',
        },
        children
      ),
    ])
  )
}
