'use client'

import React, { useEffect, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { LinkIcon } from 'lucide-react'
import { showToast } from '@/utils/toast'

export default function BlogList() {
  const blogsQuery = useQuery(api.blogs.getPublishedBlogs)
  const blogs = useMemo(() => blogsQuery || [], [blogsQuery])

  useEffect(() => {
    // Only run if we have blogs data
    if (!blogs.length) return

    const handleScroll = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1)
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    }

    handleScroll()
  }, [blogs]) // Re-run when blogs data changes

  return (
    <div className="space-y-12">
      {blogs.map((blog) => (
        <article
          key={blog._id}
          id={blog.slug}
          className="prose dark:prose-invert max-w-none scroll-mt-16 pb-12 border-b border-gray-200 dark:border-gray-800"
        >
          <header className="mb-4 flex items-center gap-2">
            <h2 className="text-xl font-bold m-0">{blog.title}</h2>
            <button
              onClick={() => {
                const url = `${window.location.origin}/blog#${blog.slug}`
                navigator.clipboard.writeText(url)
                window.history.pushState({}, '', url)
                showToast('Link copied to clipboard!')
              }}
              className="text-gray-500 hover:text-gray-700 flex items-center"
              aria-label="Copy link to blog"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </header>
          <div className="text-sm text-gray-500">
            {blog.author && <span>By {blog.author} • </span>}
            <time
              dateTime={new Date(
                blog.publishedAt || blog.publishDate || 0
              ).toISOString()}
            >
              {new Date(
                blog.publishedAt || blog.publishDate || 0
              ).toLocaleDateString()}
            </time>
          </div>
          <div
            className="prose-lg"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        </article>
      ))}
    </div>
  )
}
