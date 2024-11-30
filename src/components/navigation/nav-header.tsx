import Image from 'next/image'
import Link from 'next/link'

export function NavHeader() {
  return (
    <div className="flex h-16 items-center px-4 bg-brand-gold">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/a-ok-face.png"
          alt="A-OK Face Logo"
          width={75}
          height={55}
          className="mr-2 -ml-5 mt-5"
        />
      </Link>
    </div>
  )
}
