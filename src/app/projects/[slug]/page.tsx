import { Metadata } from 'next'
import ProjectDetails from './ProjectDetails'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.slug,
    description:
      'Explore our latest projects and developments in AI, web development, and creative coding.',
    openGraph: {
      type: 'article',
      url: `https://www.apesonkeys.com/projects/${params.slug}`,
      title: `ꓘO-∀ | ${params.slug}`,
      description:
        'Explore our latest projects and developments in AI, web development, and creative coding.',
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
      title: `ꓘO-∀ | ${params.slug}`,
      description:
        'Explore our latest projects and developments in AI, web development, and creative coding.',
      images: ['https://www.apesonkeys.com/a-okay-monkey-1.png'],
      creator: '@apesonkeys',
    },
  }
}

export default function ProjectPage({ params }: Props) {
  return <ProjectDetails slug={params.slug} />
}
