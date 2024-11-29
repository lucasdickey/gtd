'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Link2Icon } from '@radix-ui/react-icons'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { showToast } from '@/utils/toast'

export const dynamic = 'force-dynamic'

export default function Projects() {
  // Memoize the projects array
  const projectsQuery = useQuery(api.projects.getAllProjects)
  const projects = useMemo(() => projectsQuery || [], [projectsQuery])

  // Sort projects by date using useMemo
  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [projects]
  )

  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  // Debug logging
  useEffect(() => {
    if (projects?.length) {
      console.log(
        'Project URLs:',
        projects.map((p) => p.imageUrl)
      )
    }
  }, [projects])

  const validateImageUrl = (url: string) => {
    try {
      // Check if the URL is already properly formatted
      if (
        url.startsWith(
          'https://aok-projects-images.s3.us-east-2.amazonaws.com/'
        )
      ) {
        return url
      }
      // If it's a relative path, construct the full URL
      if (url.startsWith('/')) {
        return `https://aok-projects-images.s3.us-east-2.amazonaws.com${url}`
      }
      // Otherwise, try to construct a valid URL
      new URL(url)
      return url
    } catch {
      console.error('Invalid URL:', url)
      return '/fallback-project-image.jpg'
    }
  }

  const imageData = useQuery(api.projects.checkImageUrls)

  useEffect(() => {
    if (imageData) {
      console.log('Image Data Check:', imageData)
    }
  }, [imageData])

  // For the Image onError handler, since we're not using the event parameter:
  const handleImageError = (projectId: string) => {
    console.error('Image load error for project:', projectId)
    setImageError((prev) => ({
      ...prev,
      [projectId]: true,
    }))
  }

  // Add scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1) // Remove the # symbol
        console.log('Hash found:', hash)

        // Wait for content to be available
        const checkElement = setInterval(() => {
          const element = document.getElementById(hash)
          if (element) {
            console.log('Element found:', element)
            clearInterval(checkElement)

            // Scroll into view
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          } else {
            console.log('Element not found yet')
          }
        }, 100)

        // Clear interval after 5 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkElement), 5000)
      }
    }

    handleScroll()
    window.addEventListener('hashchange', handleScroll)

    return () => {
      window.removeEventListener('hashchange', handleScroll)
    }
  }, [sortedProjects]) // Use memoized projects array

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
                id={project.slug}
                className="bg-white dark:bg-white rounded-lg shadow-md overflow-hidden scroll-mt-8"
              >
                <div className="relative h-48">
                  {imageError[project._id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  ) : (
                    <Image
                      src={validateImageUrl(project.imageUrl)}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(project._id)}
                      priority={sortedProjects.indexOf(project) === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{project.title}</h2>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#${project.slug}`
                        navigator.clipboard.writeText(url)
                        showToast('Link copied to clipboard!', 3000)
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Copy link to project"
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
                  <div
                    className="prose dark:prose-invert max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
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
