import { v } from 'convex/values'
import { internalMutation, internalQuery } from './_generated/server'
import { TagCategory } from '../src/types/tags'

export const createTagIfNotExists = internalMutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal('technical'),
      v.literal('topic'),
      v.literal('language'),
      v.literal('general')
    ),
    metadata: v.optional(
      v.object({
        source: v.union(v.literal('claude'), v.literal('manual')),
        createdAt: v.number(),
        lastUsedAt: v.optional(v.number()),
        usageCount: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if tag exists
    const existing = await ctx.db
      .query('tags')
      .filter((q) => q.eq(q.field('name'), args.name))
      .first()

    if (existing) {
      // Update metadata if it exists
      if (args.metadata) {
        await ctx.db.patch(existing._id, {
          metadata: {
            ...existing.metadata,
            source: existing.metadata?.source || 'manual',
            createdAt: existing.metadata?.createdAt || Date.now(),
            lastUsedAt: Date.now(),
            usageCount: (existing.metadata?.usageCount || 0) + 1,
          },
        })
      }
      return existing._id
    }

    // Create new tag
    return await ctx.db.insert('tags', {
      name: args.name,
      description: args.description,
      category: args.category as TagCategory,
      metadata: args.metadata || {
        source: 'manual',
        createdAt: Date.now(),
      },
    })
  },
})

export const getTagIdsByNames = internalQuery({
  args: {
    names: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const tags = await ctx.db
      .query('tags')
      .filter((q) =>
        q.or(...args.names.map((name) => q.eq(q.field('name'), name)))
      )
      .collect()

    // Return a map of name -> id
    return Object.fromEntries(tags.map((tag) => [tag.name, tag._id]))
  },
})
