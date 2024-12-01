import { Metadata } from 'next'
import BlogList from './BlogList'
import { getRouteTitle } from '../metadata.config'

export const metadata: Metadata = {
  title: getRouteTitle('/blog'),
  description:
    'Random thoughts, musings, and explorations in AI and development.',
  openGraph: {
    title: 'ꓘO-∀ | Musings',
    description:
      'Random thoughts, musings, and explorations in AI and development.',
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
    title: 'ꓘO-∀ | Musings',
    description:
      'Random thoughts, musings, and explorations in AI and development.',
    images: ['https://www.apesonkeys.com/a-okay-monkey-1.png'],
    creator: '@apesonkeys',
  },
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        A small collection of thoughts
      </h1>
      <div className="space-y-12">
        <BlogList />
      </div>
    </div>
  )
}
