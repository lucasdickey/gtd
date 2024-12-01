'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { showToast } from '@/utils/toast'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

type Blog = {
  _id: Id<'blogs'>
  _creationTime: number
  title: string
  body: string
  author: string
  slug: string
  publishedAt: number
}

function BlogSkeleton() {
  return (
    <article className="bg-white dark:bg-white rounded-lg shadow-lg overflow-hidden scroll-mt-8 animate-pulse border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </article>
  )
}

export default function BlogList() {
  const searchParams = useSearchParams()
  const blogs = useQuery(api.blogs.getPublishedBlogs)

  // Sort blogs by date using useMemo
  const sortedBlogs = useMemo(
    () =>
      [...(blogs || [])].sort((a, b) => {
        const dateA = a.publishedAt || 0
        const dateB = b.publishedAt || 0
        return dateB - dateA
      }),
    [blogs]
  )

  // Handle scroll to anchor on load
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [searchParams])

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/blog#${slug}`
    navigator.clipboard.writeText(url)
    showToast('Link copied to clipboard!', 3000)
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <div className="grid grid-cols-12 gap-6">
        <div className="hidden md:block col-span-2" />
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 gap-12">
            {!blogs ? (
              <>
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </>
            ) : (
              sortedBlogs.map((blog: Blog) => (
                <article
                  key={blog._id}
                  id={blog.slug}
                  className="bg-white dark:bg-white rounded-lg shadow-lg overflow-hidden scroll-mt-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">{blog.title}</h2>
                      <button
                        onClick={() => handleCopyLink(blog.slug)}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Copy link to blog post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                      By {blog.author || 'Anonymous'} •{' '}
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : 'Date unknown'}
                    </p>
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: blog.body }}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
        <div className="col-span-2" />
      </div>
    </div>
  )
}
