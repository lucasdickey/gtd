'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useState } from 'react'
import MarkdownEditor from '@/components/MarkdownEditor'
import Link from 'next/link'
import { LinkIcon } from 'lucide-react'
import { showToast } from '@/utils/toast'
import Cookies from 'js-cookie'

type BlogFormData = {
  title: string
  body: string
  isPublished?: boolean
  author?: string
}

type Blog = {
  _id: Id<'blogs'>
  _creationTime: number
  publishedAt?: number
  publishDate?: number
  updateDate?: number
  author?: string
  isPublished?: boolean
  body: string
  title: string
  slug: string
}

const defaultFormData: BlogFormData = {
  title: '',
  body: '',
  isPublished: false,
  author: '',
}

export default function AdminBlogsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData)
  const [editingId, setEditingId] = useState<Id<'blogs'> | null>(null)

  const sessionToken = Cookies.get('adminSessionToken')
  const isValidSession = useQuery(
    api.auth.validateSession,
    sessionToken ? { sessionToken } : 'skip'
  )

  const createBlog = useMutation(api.blogs.createBlog)
  const updateBlog = useMutation(api.blogs.updateBlog)
  const deleteBlog = useMutation(api.blogs.deleteBlog)
  const blogs = useQuery(api.blogs.getAllBlogs)

  useEffect(() => {
    if (isValidSession === false) {
      router.push('/admin/login')
    }
  }, [isValidSession, router])

  if (isValidSession === undefined) {
    return <div>Loading...</div>
  }

  if (isValidSession === false) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const timestamp = Date.now()
      const slugified = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const blogData = {
        title: formData.title,
        body: formData.body,
        slug: slugified,
        author: formData.author,
        isPublished: Boolean(formData.isPublished),
        publishedAt: timestamp,
        updateDate: timestamp,
        publishDate: formData.isPublished ? timestamp : undefined,
      }

      if (editingId) {
        await updateBlog({
          id: editingId,
          ...blogData,
        })
        setEditingId(null)
      } else {
        await createBlog(blogData)
      }

      setFormData(defaultFormData)
      showToast('Blog saved successfully')
    } catch (error) {
      console.error('Error saving blog:', error)
      showToast('Error saving blog post')
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
          <MarkdownEditor
            content={formData.body}
            onChange={(html) => {
              setFormData((prev) => ({
                ...prev,
                body: html || '',
              }))
            }}
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
        {blogs?.map((blog: Blog) => {
          console.log('Rendering blog:', blog)
          return (
            <div
              key={blog._id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {blog.title}
                  </Link>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/blog#${blog.slug}`
                      navigator.clipboard.writeText(url)
                      showToast('Link copied to clipboard!')
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Copy link to blog"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-600">
                  {blog.body.substring(0, 100)}...
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  {blog.isPublished ? 'Published' : 'Draft'} •{' '}
                  {blog.author && `By ${blog.author} •`}{' '}
                  {new Date(
                    blog.publishedAt || blog.publishDate || 0
                  ).toLocaleDateString()}
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
          )
        })}
      </div>
    </div>
  )
}
