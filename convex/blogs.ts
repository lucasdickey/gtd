import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'
import { ClaudeService } from '../src/lib/services/claude.js'

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
    publishDate: v.optional(v.number()),
    updateDate: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      console.log('Blog Creation Started:', {
        title: args.title,
        slug: args.slug,
        contentLength: args.body.length,
        author: args.author,
        isPublished: args.isPublished,
      })

      const claudeService = ClaudeService.getInstance()

      // Extract topics and entities
      const { topics, entities } = await claudeService.extractTopicsAndEntities(
        {
          title: args.title,
          content: args.body,
        }
      )

      console.log('Extracted Data for Blog:', {
        topicsCount: topics.length,
        entitiesCount: entities.length,
        topics,
        entities,
      })

      // Create blog with optional extracted topics and entities
      const blogId = await ctx.db.insert('blogs', {
        ...args,
        topics,
        entities,
      })

      console.log('Blog Created Successfully:', {
        blogId,
        title: args.title,
        slug: args.slug,
      })

      return blogId
    } catch (error) {
      console.error('Error creating blog:', {
        title: args.title,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
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
