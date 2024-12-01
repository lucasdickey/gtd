import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Doc, Id } from './_generated/dataModel'

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const getPublishedBlogs = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query('blogs').collect()
    return blogs
  },
})

export const getAllBlogs = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query('blogs').collect()
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
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const blogId = await ctx.db.insert('blogs', {
      ...args,
      slug: createSlug(args.title),
      publishedAt: Date.now(),
    })
    return blogId
  },
})

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    body: v.string(),
    author: v.string(),
    publishedAt: v.optional(v.number()),
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
  args: { id: v.id('blogs') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const migrateBlogFields = mutation({
  handler: async (ctx) => {
    // Get all blogs
    const blogs = await ctx.db.query('blogs').collect()

    // Track changes
    let updated = 0
    const errors: Array<{ id: Id<'blogs'>; error: string }> = []

    // Update each blog
    for (const blog of blogs) {
      try {
        // Prepare update object
        const updates: Partial<Doc<'blogs'>> = {}

        // Fix author field if missing
        if (!blog.author) {
          updates.author = 'Lucas Dickey'
        }

        // Fix publishedAt field if missing or if publishDate exists
        if (!blog.publishedAt && (blog as any).publishDate) {
          updates.publishedAt = (blog as any).publishDate
        }

        // Only update if we have changes
        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(blog._id, updates)
          updated++
        }
      } catch (error) {
        errors.push({
          id: blog._id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { updated, errors }
  },
})
