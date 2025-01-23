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
import React from 'react'

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>

          <form onSubmit={handleSubmit} className="mb-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                {React.createElement(
                  'div',
                  { className: 'border border-gray-300 rounded-md' },
                  React.createElement(MarkdownEditor, {
                    content: formData.body,
                    onChange: (html) => {
                      setFormData((prev) => ({
                        ...prev,
                        body: html || '',
                      }))
                    },
                  })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Published
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingId ? 'Update Blog' : 'Create Blog'}
            </button>
          </form>

          <div className="space-y-6">
            {blogs?.map((blog: Blog) => (
              <div
                key={blog._id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(
                        Link,
                        {
                          href: `/blog/${blog.slug}`,
                          className:
                            'text-xl font-semibold hover:text-blue-600 transition-colors',
                        },
                        blog.title
                      )}
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/blog/${blog.slug}`
                          navigator.clipboard.writeText(url)
                          showToast('Link copied to clipboard!')
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Copy link to blog"
                      >
                        {React.createElement(LinkIcon, {
                          className: 'h-4 w-4',
                        })}
                      </button>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{blog.body}</p>
                    <div className="text-sm text-gray-500">
                      {blog.isPublished ? 'Published' : 'Draft'} •{' '}
                      {blog.author && `By ${blog.author} •`}
                      {new Date(
                        blog.publishedAt || blog.publishDate || 0
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
