import { Metadata } from 'next'
import ProjectsList from './ProjectsList'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Check out my latest projects and experiments',
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
  twitter: {
    card: 'summary_large_image',
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

export default function ProjectsPage() {
  return <ProjectsList />
}
