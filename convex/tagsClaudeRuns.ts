import { v } from 'convex/values'
import { internalMutation, internalQuery } from './_generated/server'
import { Id } from './_generated/dataModel'

// Create an internal mutation to insert the run
export const insertClaudeRun = internalMutation({
  args: {
    blogId: v.id('blogs'),
    status: v.string(),
    prompt: v.string(),
    rawResponse: v.string(),
    error: v.optional(v.string()),
    retryCount: v.number(),
    duration: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args): Promise<Id<'tagsClaudeRuns'>> => {
    const {
      blogId,
      status,
      prompt,
      rawResponse,
      error,
      retryCount,
      duration,
      timestamp,
    } = args

    return await ctx.db.insert('tagsClaudeRuns', {
      blogId,
      status,
      prompt,
      rawResponse,
      error,
      metadata: {
        retryCount,
        duration,
        timestamp,
      },
    })
  },
})

// Add a query to get the latest run for a blog
export const getLatestRunForBlog = internalQuery({
  args: {
    blogId: v.id('blogs'),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query('tagsClaudeRuns')
      .withIndex('by_blog')
      .filter((q) => q.eq(q.field('blogId'), args.blogId))
      .order('desc')
      .take(1)

    return runs[0]
  },
})
