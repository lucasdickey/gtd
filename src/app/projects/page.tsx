import { Metadata } from 'next'
import ProjectsList from './ProjectsList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects | An Ape On Keys',
  description:
    'Explore our latest projects and developments in AI, web development, and creative coding. From practical applications to experimental concepts.',
  openGraph: {
    title: 'Projects | An Ape On Keys',
    description:
      'Explore our latest projects and developments in AI, web development, and creative coding. From practical applications to experimental concepts.',
    images: [
      {
        url: 'https://www.apesonkeys.com/a-okay-monkey-1.png',
        width: 1200,
        height: 630,
        alt: 'An Ape On Keys Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | An Ape On Keys',
    description:
      'Explore our latest projects and developments in AI, web development, and creative coding. From practical applications to experimental concepts.',
    images: ['https://www.apesonkeys.com/a-okay-monkey-1.png'],
    creator: '@apesonkeys',
  },
}

export default function ProjectsPage() {
  return <ProjectsList />
}
