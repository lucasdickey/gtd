'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import ReactMarkdown from 'react-markdown'

interface BlogFormData {
  title: string
  body: string
}

export default function AdminBlogs() {
  const blogs = useQuery(api.blogs.getAllBlogs) || []
  const createBlog = useMutation(api.blogs.createBlog)
  const updateBlog = useMutation(api.blogs.updateBlog)
  const deleteBlog = useMutation(api.blogs.deleteBlog)

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    body: '',
  })

  const [editingId, setEditingId] = useState<Id<'blogs'> | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updateBlog({
          id: editingId,
          ...formData,
        })
        setEditingId(null)
      } else {
        await createBlog(formData)
      }

      setFormData({
        title: '',
        body: '',
      })
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  const handleEdit = (blog: any) => {
    setEditingId(blog._id)
    setFormData({
      title: blog.title,
      body: blog.body,
    })
  }

  const handleDelete = async (id: Id<'blogs'>) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlog({ id })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Blog Posts</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Content (Markdown)
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className="w-full p-2 border rounded h-96 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className="prose dark:prose-invert max-w-none p-4 border rounded h-96 overflow-y-auto bg-gray-50">
              <ReactMarkdown>{formData.body}</ReactMarkdown>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Blog Post' : 'Add Blog Post'}
        </button>
      </form>

      <div className="space-y-4">
        {blogs.map((blog: any) => (
          <div
            key={blog._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{blog.title}</h3>
              <p className="text-sm text-gray-600">
                Published: {new Date(blog.publishDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
