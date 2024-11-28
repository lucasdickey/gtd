'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Image from 'next/image'
import { Link2Icon } from '@radix-ui/react-icons'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function Projects() {
  // Fetch projects from Convex
  const projects = useQuery(api.projects.getAllProjects) || []

  // Sort projects by date
  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  // Add this debug log
  console.log('Projects data:', projects)

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <div className="grid grid-cols-12 gap-6">
        {/* Left white space */}
        <div className="hidden md:block col-span-2" />

        {/* Center column with projects */}
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 gap-6">
            {sortedProjects.map((project) => (
              <div
                key={project._id}
                id={`project-${project._id}`}
                className="bg-white dark:bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image for project:`, {
                          id: project._id,
                          url: project.imageUrl,
                        })
                        setImageError((prev) => ({
                          ...prev,
                          [project._id]: true,
                        }))
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-400">Image not available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#project-${project._id}`
                        navigator.clipboard.writeText(url)
                        // Optional: Add some visual feedback
                        alert('Link copied to clipboard!')
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Link2Icon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    {new Date(project.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-600 mb-3">
                    {project.description}
                  </p>
                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <ReactMarkdown>{project.content}</ReactMarkdown>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-600 grid grid-cols-1 mb-4">
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
