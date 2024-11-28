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
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Apes on Keys" />
        <meta name="apple-mobile-web-app-title" content="Apes on Keys" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased relative`}
      >
        <div className="corner-triangle corner-triangle-top" />
        <div className="corner-triangle corner-triangle-bottom" />
        <Navigation />
        <main className="pt-16">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </main>
      </body>
    </html>
  )
}
