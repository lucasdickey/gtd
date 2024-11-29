import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

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
    publishDate: v.number(),
    slug: v.string(),
    updateDate: v.number(),
  },
  handler: async (ctx, args) => {
    const blogId = await ctx.db.insert('blogs', {
      ...args,
    })
    return blogId
  },
})

export const updateBlog = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    body: v.string(),
    publishDate: v.number(),
    slug: v.string(),
    updateDate: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
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
