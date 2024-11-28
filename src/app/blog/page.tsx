'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import ReactMarkdown from 'react-markdown'

export default function Blog() {
  const blogs = useQuery(api.blogs.getAllBlogs) || []

  return (
    <div className="container mx-auto px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {blogs.map((blog) => (
          <article
            key={blog._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <time dateTime={new Date(blog.publishDate).toISOString()}>
                  Published: {new Date(blog.publishDate).toLocaleDateString()}
                </time>
                {blog.updateDate > blog.publishDate && (
                  <span className="ml-4">
                    Updated: {new Date(blog.updateDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{blog.body}</ReactMarkdown>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
