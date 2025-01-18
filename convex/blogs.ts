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

    // If the blog is being published on creation, generate tags
    if (args.isPublished) {
      console.log('[Blog Create] Triggering tag generation for:', {
        blogId,
        title: args.title,
      })

      try {
        const tagResult = await ctx.scheduler.runAfter(
          0,
          internal.claude.generateBlogTags,
          {
            blogId,
            title: args.title,
            body: args.body,
          }
        )

        console.log('[Blog Create] Tag generation completed:', tagResult)
      } catch (error) {
        console.error('[Blog Create] Tag generation failed:', error)
        // Continue with creation even if tag generation fails
      }
    }

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
    const existingBlog = await ctx.db.get(id)

    console.log('[Blog Update] Checking publication status:', {
      isBeingPublished: updates.isPublished,
      wasPublished: existingBlog?.isPublished,
      blogId: id,
      title: updates.title,
    })

    // If the blog is being published, generate tags
    if (updates.isPublished && !existingBlog?.isPublished) {
      console.log('[Blog Update] Triggering tag generation for:', {
        blogId: id,
        title: updates.title,
      })

      try {
        const tagResult = await ctx.scheduler.runAfter(
          0,
          internal.claude.generateBlogTags,
          {
            blogId: id,
            title: updates.title,
            body: updates.body,
          }
        )

        console.log('[Blog Update] Tag generation completed:', tagResult)
      } catch (error) {
        console.error('[Blog Update] Tag generation failed:', error)
        // Continue with publication even if tag generation fails
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

export const getLatestClaudeRun = query({
  args: { blogId: v.id('blogs') },
  handler: async (ctx, args) => {
    const run = await ctx.db
      .query('tagsClaudeRuns')
      .withIndex('by_blog')
      .filter((q) => q.eq(q.field('blogId'), args.blogId))
      .order('desc')
      .take(1)

    return run[0]
  },
})

export const getBlogIdBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query('blogs')
      .filter((q) => q.eq(q.field('slug'), args.slug))
      .first()
    return blog?._id
  },
})

export const getClaudeRunsForBlog = query({
  args: { blogId: v.id('blogs') },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query('tagsClaudeRuns')
      .withIndex('by_blog')
      .filter((q) => q.eq(q.field('blogId'), args.blogId))
      .order('desc')
      .collect()
    return runs
  },
})

export const removeEntitiesField = mutation({
  handler: async (ctx) => {
    const blogs = await ctx.db.query('blogs').collect()
    let count = 0

    for (const blog of blogs) {
      const { entities, ...rest } = blog as any
      if (entities !== undefined) {
        await ctx.db.replace(blog._id, rest)
        count++
      }
    }

    return `Removed entities field from ${count} blog posts`
  },
})
