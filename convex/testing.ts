import { mutation } from './_generated/server'

// Only allow these mutations in test environments
const isTestEnv = process.env.NODE_ENV === 'test'

export const clearAdminUsers = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isTestEnv) {
      throw new Error('Testing mutations are only allowed in test environments')
    }

    const users = await ctx.db.query('adminUsers').collect()
    for (const user of users) {
      await ctx.db.delete(user._id)
    }
  },
})

export const clearBlogs = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isTestEnv) {
      throw new Error('Testing mutations are only allowed in test environments')
    }

    const blogs = await ctx.db.query('blogs').collect()
    for (const blog of blogs) {
      await ctx.db.delete(blog._id)
    }
  },
})

export const clearTags = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isTestEnv) {
      throw new Error('Testing mutations are only allowed in test environments')
    }

    const tags = await ctx.db.query('tags').collect()
    for (const tag of tags) {
      await ctx.db.delete(tag._id)
    }
  },
})

export const clearTagAssociations = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isTestEnv) {
      throw new Error('Testing mutations are only allowed in test environments')
    }

    const associations = await ctx.db.query('tagAssociations').collect()
    for (const association of associations) {
      await ctx.db.delete(association._id)
    }
  },
})
