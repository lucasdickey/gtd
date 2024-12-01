'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Link2Icon } from '@radix-ui/react-icons'
import { useEffect, useMemo } from 'react'
import { showToast } from '@/utils/toast'
import { Id } from '@/convex/_generated/dataModel'

interface Blog {
  _id: Id<'blogs'>
  title: string
  slug: string
  body: string
  publishDate: number
}

export default function BlogList() {
  const blogsQuery = useQuery(api.blogs.getAllBlogs)
  const blogs = useMemo(() => blogsQuery || [], [blogsQuery])

  useEffect(() => {
    const handleScroll = () => {
      if (!window.location.hash) return

      const hash = window.location.hash.substring(1)
      const element = document.getElementById(hash)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }

      // If element not found immediately, wait for it
      const checkElement = setInterval(() => {
        const element = document.getElementById(hash)
        if (element) {
          clearInterval(checkElement)
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkElement), 5000)
    }

    handleScroll()
    window.addEventListener('hashchange', handleScroll)
    return () => window.removeEventListener('hashchange', handleScroll)
  }, [])

  if (!blogsQuery) {
    return <BlogSkeleton />
  }

  return (
    <div className="container mx-auto px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Random Thoughts</h1>
      {blogs.length === 0 ? <EmptyState /> : <BlogPosts blogs={blogs} />}
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="container mx-auto px-8 py-8 max-w-4xl">
      <div className="animate-pulse space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-48 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return <p className="text-gray-500">No blog posts yet.</p>
}

function BlogPosts({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="space-y-8">
      {blogs.map((blog) => (
        <BlogPost key={blog._id} blog={blog} />
      ))}
    </div>
  )
}

function BlogPost({ blog }: { blog: Blog }) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${blog.slug}`
    navigator.clipboard.writeText(url)
    window.history.pushState({}, '', url)
    showToast('Link copied to clipboard!')
  }

  return (
    <article
      id={blog.slug}
      className="bg-white rounded-lg shadow-md overflow-hidden scroll-mt-8"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold">{blog.title}</h2>
          <button
            onClick={handleCopyLink}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Copy link to blog post"
          >
            <Link2Icon className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <time dateTime={new Date(blog.publishDate).toISOString()}>
            Published: {new Date(blog.publishDate).toLocaleDateString()}
          </time>
        </div>
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </div>
    </article>
  )
}
