'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import { Menu, X, ExternalLink } from 'lucide-react'
import React from 'react'

type NavItem = {
  href: string
  label: string
  isExternal?: boolean
  target?: string
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Musings' },
  { href: '/about', label: 'About' },
  {
    href: 'https://a-ok.transistor.fm/',
    label: 'Podcast',
    isExternal: true,
    target: '_blank',
  },
  {
    href: 'https://a-ok.shop/',
    label: 'Shop',
    isExternal: true,
    target: '_blank',
  },
  {
    href: 'https://a-ok.transistor.fm/',
    label: 'Listen  ',
    isExternal: true,
    target: '_blank',
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [activeWidth, setActiveWidth] = useState(0)
  const [activeLeft, setActiveLeft] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.href === pathname)
    const activeRef = navRefs.current[activeIndex]

    if (activeRef) {
      setActiveWidth(activeRef.offsetWidth)
      setActiveLeft(activeRef.offsetLeft)
    }
  }, [pathname])

  const currentPage = navItems.find((item) => item.href === pathname)

  return (
    <nav
      className="fixed top-0 z-10 w-full"
      style={{
        backgroundColor: 'var(--brand-red)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center justify-between w-full">
            {/* Logo section */}
            <div className="flex items-center gap-4">
              {React.createElement(
                Link,
                { href: '/', className: 'flex items-center gap-3' },
                React.createElement(Image, {
                  src: '/a-ok-face.png',
                  alt: 'A-OK Face Logo',
                  width: 40,
                  height: 40,
                  className: 'w-10 h-10',
                }),
                React.createElement(
                  'span',
                  { className: 'text-2xl font-bold' },
                  'ꓘO-∀'
                )
              )}
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block flex-1 overflow-x-auto pl-8">
              <div className="flex space-x-8 relative pb-1 pr-16">
                {/* Enhanced animated underline */}
                <div
                  className="absolute bottom-1 h-2 bg-background transition-all duration-300 ease-in-out"
                  style={{
                    left: activeLeft,
                    width: activeWidth,
                    transform: 'translateY(1px)',
                  }}
                />

                {navItems.map((link, index) =>
                  link.isExternal
                    ? React.createElement(
                        'a',
                        {
                          key: link.href,
                          href: link.href,
                          ref: (el: HTMLAnchorElement | null) =>
                            (navRefs.current[index] = el),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className:
                            'relative px-3 py-2 transition-colors duration-300 hover:text-action-accent text-brand-beige flex items-center gap-1',
                        },
                        link.label,
                        React.createElement(ExternalLink, {
                          className: 'h-4 w-4',
                        })
                      )
                    : React.createElement(
                        Link,
                        {
                          key: link.href,
                          ref: (el: HTMLAnchorElement | null) =>
                            (navRefs.current[index] = el),
                          href: link.href,
                          style: {
                            color:
                              pathname === link.href
                                ? 'var(--foreground)'
                                : undefined,
                          },
                          className: `relative px-3 py-2 transition-colors duration-300 hover:text-action-accent ${
                            pathname === link.href
                              ? 'font-bold text-foreground'
                              : 'text-brand-black'
                          }`,
                        },
                        link.label
                      )
                )}
              </div>
            </div>

            {/* Mobile current page and menu button */}
            <div className="md:hidden flex items-center gap-3">
              {!isMenuOpen &&
                currentPage &&
                React.createElement(
                  'span',
                  { className: 'text-base font-medium text-foreground' },
                  currentPage.label
                )}
              <button
                type="button"
                className="text-brand-beige hover:text-action-accent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen
                  ? React.createElement(X, { className: 'h-6 w-6' })
                  : React.createElement(Menu, { className: 'h-6 w-6' })}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((link) => (
                <div key={link.href} className="flex flex-col items-center">
                  {link.isExternal
                    ? React.createElement(
                        'a',
                        {
                          href: link.href,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className:
                            'relative px-3 py-2 text-base font-medium transition-colors duration-300 hover:text-action-accent text-brand-beige flex items-center gap-1',
                          onClick: () => setIsMenuOpen(false),
                        },
                        link.label,
                        React.createElement(ExternalLink, {
                          className: 'h-4 w-4',
                        })
                      )
                    : React.createElement(
                        Link,
                        {
                          href: link.href,
                          className: 'flex flex-col items-center',
                          onClick: () => setIsMenuOpen(false),
                        },
                        React.createElement(
                          'span',
                          {
                            className: `relative px-3 py-2 text-base transition-colors duration-300 hover:text-action-accent ${
                              pathname === link.href
                                ? 'font-bold text-foreground'
                                : 'text-brand-black'
                            }`,
                          },
                          link.label,
                          pathname === link.href &&
                            React.createElement('div', {
                              className:
                                'absolute bottom-0 left-0 right-0 h-0.5 bg-background transition-all duration-300 ease-in-out mx-auto',
                              style: {
                                transform: 'translateY(1px)',
                                width: '100%',
                              },
                            })
                        )
                      )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
