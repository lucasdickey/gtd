import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - The Apes are confused.</h2>
      <p className="mb-8">
        Or the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-blue-500 hover:text-blue-600 underline">
        Return Home
      </Link>
    </div>
  )
}

export const dynamic = 'force-dynamic'
