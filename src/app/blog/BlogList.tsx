'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
// import { Blog } from '@/lib/types'

export default function BlogList() {
  const blogs = useQuery(api.blogs.getPublishedBlogs) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-12">
        {blogs.map((blog) => (
          <article
            key={blog._id}
            className="prose dark:prose-invert max-w-none"
          >
            <header className="mb-4">
              <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
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
            </header>
            <div
              className="prose-lg"
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          </article>
        ))}
      </div>
    </div>
  )
}
