import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface NavHeaderProps {
  isCollapsed?: boolean
  onCollapse?: (value: boolean) => void
}

export function NavHeader({ isCollapsed, onCollapse }: NavHeaderProps) {
  return (
    <header className="flex h-[60px] items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        {React.createElement(
          Link,
          { href: '/', className: 'flex items-center' },
          [
            React.createElement(Image, {
              key: 'logo',
              src: '/a-ok-face.png',
              alt: 'A-OK Face Logo',
              width: 40,
              height: 40,
              className: 'w-10 h-10',
            }),
            React.createElement(
              'span',
              { key: 'text', className: 'text-2xl font-bold' },
              'ꓘO-∀'
            ),
          ]
        )}
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold">A-OK</span>
            <span className="text-xs text-muted-foreground">apesonkeys</span>
          </div>
        )}
      </div>
      {onCollapse && (
        <button
          onClick={() => onCollapse(!isCollapsed)}
          className="rounded-md p-2 hover:bg-accent"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      )}
    </header>
  )
}
