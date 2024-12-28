import localFont from 'next/font/local'
import './globals.css'
import { ConvexClientProvider } from './ConvexClientProvider'
import Navigation from '@/components/Navigation'
import { VT323 } from 'next/font/google'
import { metadata } from './layout.metadata'

export { metadata }

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

// const systemFont = FontSans.style.fontFamily

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
