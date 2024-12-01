import './globals.css'
import { Inter } from 'next/font/google'
import { ConvexClientProvider } from './ConvexClientProvider'
import { defaultMetadata } from './metadata.config'

const inter = Inter({ subsets: ['latin'] })

export const metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <div id="toast" className="toast hidden" />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
