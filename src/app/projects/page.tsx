import { Metadata } from 'next'
import ProjectsList from './ProjectsList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Check out my latest projects and experiments',
  openGraph: {
    type: 'website',
    url: 'https://www.apesonkeys.com/projects',
    title: 'ꓘO-∀ Projects',
    description: 'Check out my latest projects and experiments',
    images: [
      {
        url: 'https://www.apesonkeys.com/a-okay-monkey-1.png',
        width: 800,
        height: 800,
        alt: 'ꓘO-∀ Monkey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ꓘO-∀ Projects',
    description: 'Check out my latest projects and experiments',
    images: [
      {
        url: 'https://www.apesonkeys.com/a-okay-monkey-1.png',
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
