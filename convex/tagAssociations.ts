import { v } from 'convex/values'
import { internalMutation, internalQuery } from './_generated/server'
import { Id } from './_generated/dataModel'

export const createAssociation = internalMutation({
  args: {
    tagId: v.id('tags'),
    entityId: v.union(v.id('blogs'), v.id('projects')),
    entityType: v.union(v.literal('blog'), v.literal('project')),
    confidence: v.number(),
    metadata: v.optional(
      v.object({
        source: v.union(v.literal('claude'), v.literal('manual')),
        createdAt: v.number(),
        context: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if association already exists
    const existing = await ctx.db
      .query('tagAssociations')
      .filter((q) =>
        q.and(
          q.eq(q.field('tagId'), args.tagId),
          q.eq(q.field('entityId'), args.entityId),
          q.eq(q.field('entityType'), args.entityType)
        )
      )
      .first()

    if (existing) {
      // Update confidence and metadata if different
      if (existing.confidence !== args.confidence || args.metadata) {
        await ctx.db.patch(existing._id, {
          confidence: args.confidence,
          metadata: args.metadata || existing.metadata,
        })
      }
      return existing._id
    }

    // Create new association
    return await ctx.db.insert('tagAssociations', {
      tagId: args.tagId,
      entityId: args.entityId,
      entityType: args.entityType,
      confidence: args.confidence,
      metadata: args.metadata || {
        source: 'manual',
        createdAt: Date.now(),
      },
    })
  },
})

export const getTagsForEntity = internalQuery({
  args: {
    entityId: v.union(v.id('blogs'), v.id('projects')),
    entityType: v.union(v.literal('blog'), v.literal('project')),
  },
  handler: async (ctx, args) => {
    const associations = await ctx.db
      .query('tagAssociations')
      .filter((q) =>
        q.and(
          q.eq(q.field('entityId'), args.entityId),
          q.eq(q.field('entityType'), args.entityType)
        )
      )
      .collect()

    // Get all unique tag IDs
    const tagIds = [...new Set(associations.map((a) => a.tagId))]

    // Fetch all tags in one query
    const tags = await ctx.db
      .query('tags')
      .filter((q) => q.or(...tagIds.map((id) => q.eq(q.field('_id'), id))))
      .collect()

    // Return tags with their confidence scores
    return tags.map((tag) => {
      const association = associations.find((a) => a.tagId === tag._id)
      return {
        ...tag,
        confidence: association?.confidence || 0,
        context: association?.metadata?.context,
      }
    })
  },
})
