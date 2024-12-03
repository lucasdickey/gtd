import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const getAllBlogs = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query('blogs').order('desc').collect()
    return blogs
  },
})

export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query('blogs')
      .filter((q) => q.eq(q.field('slug'), args.slug))
      .collect()
    return blogs[0] || null
  },
})

export const createBlog = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    isPublished: v.boolean(),
    author: v.optional(v.string()),
    publishedAt: v.optional(v.float64()),
    updateDate: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    try {
      if (args.title.length < 1 || args.title.length > 100) {
        throw new Error('Title must be between 1 and 100 characters')
      }

      if (args.body.length < 1) {
        throw new Error('Content cannot be empty')
      }

      const blogId = await ctx.db.insert('blogs', {
        title: args.title,
        body: args.body,
        slug: createSlug(args.title),
        publishedAt: args.isPublished ? Date.now() : undefined,
        publishDate: args.isPublished ? Date.now() : undefined,
        updateDate: Date.now(),
        isPublished: args.isPublished,
        author: args.author,
      })

      return blogId
    } catch (error: any) {
      console.error('Blog creation error:', error)
      throw new Error(`Failed to create blog: ${error.message}`)
    }
  },
})

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    body: v.string(),
    publishedAt: v.optional(v.number()),
    publishDate: v.optional(v.number()),
    updateDate: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, {
      ...data,
      slug: createSlug(data.title),
    })
  },
})

export const deleteBlog = mutation({
  args: {
    id: v.id('blogs'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const getPublishedBlogs = query({
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query('blogs')
      .filter((q) => q.eq(q.field('isPublished'), true))
      .order('desc')
      .collect()

    return blogs
  },
})
