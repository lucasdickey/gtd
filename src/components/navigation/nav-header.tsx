import Image from 'next/image'
import Link from 'next/link'

interface NavHeaderProps {
  isCollapsed?: boolean
  onCollapse?: (value: boolean) => void
}

export function NavHeader({ isCollapsed, onCollapse }: NavHeaderProps) {
  return (
    <header className="flex h-[60px] items-center justify-between border-b px-6 py-3">
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
