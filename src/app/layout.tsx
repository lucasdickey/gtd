import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import { NavHeader } from '@/components/navigation/nav-header'
import { MainNav } from '@/components/navigation/main-nav'
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
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
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="fixed z-50 flex h-screen w-64 flex-col border-r bg-brand-gold">
            <NavHeader />
            <MainNav />
          </div>

          {/* Main Content */}
          <main className="flex-1 pl-64">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
