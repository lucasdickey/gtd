import { Metadata } from 'next'
import BlogList from './BlogList'
import { getRouteTitle } from '../metadata.config'
import React from 'react'

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
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 -skew-y-2 bg-tan-200/50 transform -z-10" />
          <h1 className="text-4xl font-bold mb-12 pt-4">
            A small collection of thoughts
          </h1>
        </div>
        <div className="space-y-12 mt-8">{React.createElement(BlogList)}</div>
      </div>
    </div>
  )
}
