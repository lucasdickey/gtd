import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import Navigation from '@/components/Navigation'

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

export const metadata: Metadata = {
  title: {
    template: 'ꓘO-∀: %s',
    default: 'ꓘO-∀',
  },
  description:
    "I might as well be a monkey. But I'm a monkey with far more than a thousand keyboards.",
  openGraph: {
    images: [
      {
        url: '/a-okay-monkey-1.png',
        width: 800,
        height: 800,
        alt: 'ꓘO-∀ Monkey',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navigation />
          <main className="pt-16">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
