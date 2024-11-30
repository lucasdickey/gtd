'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Link2Icon } from '@radix-ui/react-icons'
import { useEffect, useMemo } from 'react'
import { showToast } from '@/utils/toast'

export default function BlogPage() {
  const blogsQuery = useQuery(api.blogs.getAllBlogs)

  // Memoize the blogs array
  const blogs = useMemo(() => blogsQuery || [], [blogsQuery])

  // Move useEffect before any conditional returns
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
  }, []) // Remove blogs dependency as it's not needed

  // Handle loading state
  if (blogsQuery === undefined) {
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

  return (
    <div className="container mx-auto px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blog posts yet.</p>
      ) : (
        <div className="space-y-8">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              id={blog.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden scroll-mt-8"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{blog.title}</h2>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}#${blog.slug}`
                      navigator.clipboard.writeText(url)
                      window.history.pushState({}, '', url)
                      showToast('Link copied to clipboard!')
                    }}
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
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.body }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
