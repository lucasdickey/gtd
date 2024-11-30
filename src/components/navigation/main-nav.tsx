'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Home, FolderKanban, PenTool, User, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  variant: 'default' | 'ghost'
}

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const items: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />,
      variant: pathname === '/' ? 'default' : 'ghost',
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: <FolderKanban className="h-4 w-4" />,
      variant: pathname.startsWith('/projects') ? 'default' : 'ghost',
    },
    {
      title: 'Musings',
      href: '/blog',
      icon: <PenTool className="h-4 w-4" />,
      variant: pathname.startsWith('/blog') ? 'default' : 'ghost',
    },
    {
      title: 'About',
      href: '/about',
      icon: <User className="h-4 w-4" />,
      variant: pathname === '/about' ? 'default' : 'ghost',
    },
  ]

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-brand-gold">
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant={item.variant}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col">
        <ScrollArea className="w-full">
          <div className="flex flex-col space-y-2 p-2">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.variant}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-accent'
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </nav>
    </>
  )
}
