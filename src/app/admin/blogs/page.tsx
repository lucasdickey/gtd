'use client'

import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useState } from 'react'

type BlogFormData = {
  title: string
  body: string
  isPublished?: boolean
  author?: string
}

type Blog = {
  _id: Id<'blogs'>
  _creationTime: number
  title: string
  body: string
  publishDate: number
  updateDate: number
  slug: string
  isPublished?: boolean
  author?: string
}

const defaultFormData: BlogFormData = {
  title: '',
  body: '',
  isPublished: false,
  author: '',
}

export default function AdminBlogsPage() {
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData)
  const [editingId, setEditingId] = useState<Id<'blogs'> | null>(null)

  const createBlog = useMutation(api.blogs.createBlog)
  const updateBlog = useMutation(api.blogs.updateBlog)
  const deleteBlog = useMutation(api.blogs.deleteBlog)
  const blogs = useQuery(api.blogs.getAllBlogs)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateBlog({
          id: editingId,
          ...formData,
          publishDate: Date.now(),
          updateDate: Date.now(),
        })
        setEditingId(null)
      } else {
        await createBlog({
          ...formData,
          publishDate: Date.now(),
          updateDate: Date.now(),
        })
      }

      setFormData(defaultFormData)
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      body: blog.body,
      isPublished: blog.isPublished,
      author: blog.author,
    })
    setEditingId(blog._id)
  }

  const handleDelete = async (id: Id<'blogs'>) => {
    try {
      await deleteBlog({ id })
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Title</label>
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

        <div>
          <label className="block mb-2">Content</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Author</label>
          <input
            type="text"
            value={formData.author || ''}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished || false}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="rounded"
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>

      <div className="space-y-4">
        {blogs?.map((blog: Blog) => (
          <div
            key={blog._id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600">{blog.body.substring(0, 100)}...</p>
              <div className="text-sm text-gray-500 mt-2">
                {blog.isPublished ? 'Published' : 'Draft'} •{' '}
                {blog.author && `By ${blog.author} •`}{' '}
                {new Date(blog.publishDate).toLocaleDateString()}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(blog)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="text-red-500 hover:text-red-600"
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
