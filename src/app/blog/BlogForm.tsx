'use client'

import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { handleConvexError } from '@/utils/error-handling'

export const BlogForm = () => {
  const createBlog = useMutation(api.blogs.createBlog)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)

      await createBlog({
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        published: formData.get('published') === 'true',
        authorId: 'anonymous',
      })

      alert('Blog created successfully!')

      // Clear form
      e.currentTarget.reset()
    } catch (error) {
      const errorMessage = handleConvexError(error)
      alert(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <div>
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          required
          maxLength={100}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <textarea
          name="content"
          placeholder="Blog Content"
          required
          className="w-full p-2 border rounded min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <select
          name="published"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="false">Draft</option>
          <option value="true">Publish</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Blog
      </button>
    </form>
  )
}
