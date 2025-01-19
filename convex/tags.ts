import { internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const createTagIfNotExists = internalMutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal('technical'),
      v.literal('topic'),
      v.literal('language'),
      v.literal('general')
    ),
    metadata: v.object({
      source: v.union(v.literal('claude'), v.literal('manual')),
      createdAt: v.number(),
      lastUsedAt: v.optional(v.number()),
      usageCount: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    // Check if tag already exists
    const existingTags = await ctx.db
      .query('tags')
      .filter((q) => q.eq(q.field('name'), args.name))
      .collect()

    if (existingTags.length > 0) {
      const existingTag = existingTags[0]
      // Update metadata if tag exists
      await ctx.db.patch(existingTag._id, {
        metadata: {
          ...args.metadata,
          lastUsedAt: Date.now(),
          usageCount: (existingTag.metadata?.usageCount || 0) + 1,
        },
      })
      return existingTag._id
    }

    // Create new tag if it doesn't exist
    return await ctx.db.insert('tags', {
      name: args.name,
      description: args.description,
      category: args.category,
      metadata: {
        ...args.metadata,
        lastUsedAt: Date.now(),
        usageCount: 1,
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
      .withIndex('by_name')
      .filter((q) =>
        q.or(...args.names.map((name) => q.eq(q.field('name'), name)))
      )
      .collect()

    // Create a map of tag name to ID
    const tagMap: Record<string, Id<'tags'>> = {}
    for (const tag of tags) {
      tagMap[tag.name] = tag._id
    }

    return tagMap
  },
})
