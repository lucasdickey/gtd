import { Metadata } from 'next'
import ProjectDetails from './ProjectDetails'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  return {
    title: `Project: ${params.slug}`,
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
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetails slug={params.slug} />
}
