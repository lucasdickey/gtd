'use client'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ProjectDetailsProps {
  slug: string
}

export default function ProjectDetails({ slug }: ProjectDetailsProps) {
  const project = useQuery(api.projects.getProjectBySlug, { slug })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1) // Remove the # symbol
      const element = document.getElementById(id)
      if (element) {
        // Add a small delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [])

  if (!project) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl scroll-smooth">
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

      {/* Image Carousel */}
      <div className="relative h-96 mb-8">
        {React.createElement(Image, {
          src: project.images[currentImageIndex],
          alt: `${project.title} - Image ${currentImageIndex + 1}`,
          fill: true,
          className: 'object-cover rounded-lg',
        })}
        <div className="absolute bottom-4 right-4 space-x-2">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Markdown Content */}
      {renderContent(project.content)}
    </div>
  )
}

// Helper function
const renderContent = (content: string) => {
  // If content is HTML, parse it properly
  if (content.includes('<p>') || content.includes('</p>')) {
    return (
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Fallback for plain text/markdown
  return (
    <div className="prose dark:prose-invert max-w-none">
      {content.split('\n').map((paragraph, idx) => (
        <p key={idx} className="mb-4">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
