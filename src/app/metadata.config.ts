import { Metadata } from 'next'

const SITE_URL = 'https://www.apesonkeys.com'

export const metadataBase = new URL(SITE_URL)

export function getRouteTitle(route: string): string {
  const baseTitle = 'ꓘO-∀'
  const routeTitles: { [key: string]: string } = {
    '/': 'Home',
    '/blog': 'Musings',
    '/projects': 'Projects',
    '/chilled-monkey-brains': 'Chilled Monkey Brains',
  }

  const pageTitle = routeTitles[route] || ''
  return pageTitle ? `${baseTitle} | ${pageTitle}` : baseTitle
}

export const defaultMetadata: Metadata = {
  metadataBase,
  title: {
    default: getRouteTitle('/'),
    template: '%s | ꓘO-∀',
  },
  description: 'A personal site for projects and musings.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ꓘO-∀',
    images: [
      {
        url: '/a-okay-monkey-1.png',
        width: 1200,
        height: 630,
        alt: 'An Ape On Keys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ꓘO-∀',
    description: 'A personal site for projects and musings.',
    images: ['/a-okay-monkey-1.png'],
    creator: '@apesonkeys',
  },
}
