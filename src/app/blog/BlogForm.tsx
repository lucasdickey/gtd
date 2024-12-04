'use client'

import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRouter } from 'next/navigation'

export default function BlogForm() {
  const createBlog = useMutation(api.blogs.createBlog)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const timestamp = Date.now()

      await createBlog({
        title,
        body: formData.get('content') as string,
        slug,
        isPublished: formData.get('published') === 'true',
        publishedAt: timestamp,
        updateDate: timestamp,
        publishDate:
          formData.get('published') === 'true' ? timestamp : undefined,
      })

      router.push('/blog')
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="published"
            value="true"
            className="rounded border-gray-300"
          />
          <span className="ml-2">Publish immediately</span>
        </label>
      </div>

      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Create Blog
      </button>
    </form>
  )
}
