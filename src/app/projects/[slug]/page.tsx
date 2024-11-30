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
      type: 'article',
      url: `https://www.apesonkeys.com/projects/${params.slug}`,
      title: `ꓘO-∀: ${params.slug}`,
      description: 'Check out this project on ꓘO-∀',
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
      title: `ꓘO-∀: ${params.slug}`,
      description: 'Check out this project on ꓘO-∀',
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
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetails slug={params.slug} />
}
