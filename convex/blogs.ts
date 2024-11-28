import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

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
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const slug = createSlug(args.title)

    const blogId = await ctx.db.insert('blogs', {
      title: args.title,
      body: args.body,
      publishDate: now,
      updateDate: now,
      slug,
    })
    return blogId
  },
})

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    const now = Date.now()

    await ctx.db.patch(id, {
      ...data,
      updateDate: now,
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
