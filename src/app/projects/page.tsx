'use client'
import Image from 'next/image'

// Define the Project type
type Project = {
  _id: string
  title: string
  description: string
  imageUrl: string
  tools: string[]
  publishedAt: Date
  projectUrl?: string // Optional URL
  projectUrlText?: string // Optional text for the URL
}

// Add constant projects data
const PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'Project Zero: To One',
    description:
      'Vercel. NextJS and Convex config. Deployment. Linting. Ugh. But also logos/icons, fun copywriting, and animations.',
    imageUrl: '/projectOne.jpg',
    tools: [
      'NextJS for front-end framework',
      'Convex for back-end and database',
      'Vercel for deployments and hosting',
      'Tailwind CSS for styling and motions',
      'TypeScript',
      'DALL-E for logo insipration and hero image',
      'Cursor with Sonnet for all code editing',
      'Claude app for macro asks and color palette',
      'ChatGPT with o1 for alternative POV',
      'Warp as (natural language) terminal',
      'Figma for logo',
    ],
    publishedAt: new Date('2024-11-01'),
    projectUrl: 'https://github.com/lucasdickey/gtd',
    projectUrlText: 'The project repo on GitHub',
  },
  {
    _id: '2',
    title: 'Project One: AI-Created Kids Science Podcast',
    description:
      'A kids education podcast using AI tools to create an engaging educational content for kids, based on school curriculum and their interests.',
    imageUrl: '/projectTwoJJPod.jpg',
    tools: [
      'ChatGPT with Web Search for topic research',
      'Claude/ChatGPT for SEO optimization (titles & descriptions)',
      'NotebookLM for summarization and TTS 2-agent conversation',
      'Eleven Labs for voice cloning and TTS for my sons voice',
      'Udio for intro/outro and music bed',
      'Human: Multi-track editor for final assembly',
      'Grok 2 for artwork, plus some Figma work',
      'Human: Spotify for distribution',
    ],
    publishedAt: new Date('2024-11-03'),
    projectUrl: 'https://open.spotify.com/show/2LMOQGJGnjS6uTFD9nqUOB',
    projectUrlText: '"JJ\'s Fun Facts and Interesting Iotas" on Spotify',
  },
  {
    _id: '3',
    title: 'Project Two: General Uploader',
    description:
      'A general file uploader to handle image or video uploads as part of the CMS for Projects and Blog',
    imageUrl:
      'https://aok-projects-images.s3.us-east-2.amazonaws.com/0afc4622-c850-4532-a882-1086f7f3c4a8-Screenshot%202024-11-07%20at%2011.31.09%E2%80%AFPM.png',
    tools: [
      'Cursor with Sonnet for all code editing',
      'Claude.ai for Vercel build detal misconfiguration debugging',
      'Images are stored in S3 with references in Convex DB',
      'Went with S3 for portability, used AWS S3 SDK',
    ],
    publishedAt: new Date('2024-11-07'),
    projectUrl:
      'https://aok-projects-images.s3.us-east-2.amazonaws.com/0afc4622-c850-4532-a882-1086f7f3c4a8-Screenshot%202024-11-07%20at%2011.31.09%E2%80%AFPM.png',
    projectUrlText: 'Project Two card image in S3',
  },
]

export const dynamic = 'force-dynamic'

export default function Projects() {
  // Sort projects by date (newest first)
  const projects = [...PROJECTS].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <div className="grid grid-cols-12 gap-6">
        {/* Left white space */}
        <div className="hidden md:block col-span-2" />

        {/* Center column with projects */}
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {project.publishedAt.toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {project.description}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 grid grid-cols-1 mb-4">
                    {project.tools.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {project.projectUrlText || 'View Project'}
                      <span className="ml-1">→</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right white space */}
        <div className="col-span-2" />
      </div>
    </div>
  )
}
