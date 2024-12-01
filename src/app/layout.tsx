import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import Navigation from '@/components/Navigation'
import { VT323 } from 'next/font/google'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: {
    template: '%s | An Ape On Keys',
    default: 'An Ape On Keys',
  },
  description:
    'Explore our latest projects and developments in AI, web development, and creative coding.',
  metadataBase: new URL('https://www.apesonkeys.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.apesonkeys.com',
    title: 'An Ape On Keys',
    description:
      'Explore our latest projects and developments in AI, web development, and creative coding.',
    images: [
      {
        url: 'https://www.apesonkeys.com/a-okay-monkey-1.png',
        width: 1200,
        height: 630,
        alt: 'An Ape On Keys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'An Ape On Keys',
    description:
      'Explore our latest projects and developments in AI, web development, and creative coding.',
    creator: '@apesonkeys',
    images: ['https://www.apesonkeys.com/a-okay-monkey-1.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased relative`}
      >
        <div className="corner-triangle corner-triangle-top" />
        <div className="corner-triangle corner-triangle-bottom" />
        <Navigation />
        <main className="pt-16">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </main>
        <div
          id="toast"
          className="hidden fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50"
        />
      </body>
    </html>
  )
}
