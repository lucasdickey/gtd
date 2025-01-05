import { mutation, query, action } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'
import { internal } from './_generated/api'

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
    slug: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    updateDate: v.optional(v.number()),
    publishDate: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const blogId = await ctx.db.insert('blogs', {
      title: args.title,
      body: args.body,
      slug: args.slug,
      author: args.author,
      publishedAt: args.publishedAt,
      updateDate: args.updateDate,
      publishDate: args.publishDate,
      isPublished: args.isPublished ?? false,
    })

    return blogId
  },
})

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    body: v.string(),
    slug: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    updateDate: v.optional(v.number()),
    publishDate: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args

    // If the blog is being published, test Claude connection first
    if (updates.isPublished && !(await ctx.db.get(id))?.isPublished) {
      try {
        await ctx.scheduler.runAfter(0, internal.claude.testClaudeConnection, {
          useCase: 'blog-analysis',
        })
        console.log('Claude connection test passed for blog publication')
      } catch (error) {
        console.error('Claude connection test failed:', error)
        throw new Error(
          'Failed to establish Claude connection for blog publication'
        )
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      isPublished: updates.isPublished ?? false,
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
