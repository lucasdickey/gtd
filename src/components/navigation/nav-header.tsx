import Image from 'next/image'
import Link from 'next/link'
import { SidebarHeader } from '@/components/ui/sidebar'

interface NavHeaderProps {
  isCollapsed?: boolean
  onCollapse?: (value: boolean) => void
}

export function NavHeader({ isCollapsed, onCollapse }: NavHeaderProps) {
  return (
    <SidebarHeader isCollapsed={isCollapsed} onCollapse={onCollapse}>
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/a-ok-face.png"
            alt="A-OK Face Logo"
            width={40}
            height={40}
            className="rounded-md transition-all duration-300"
          />
        </Link>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold">A-OK</span>
            <span className="text-xs text-muted-foreground">apesonkeys</span>
          </div>
        )}
      </div>
    </SidebarHeader>
  )
}
