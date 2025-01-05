import { v } from 'convex/values'
import { internalMutation, internalQuery, query } from './_generated/server'
import { Id } from './_generated/dataModel'

export const createAssociation = internalMutation({
  args: {
    tagId: v.id('tags'),
    entityId: v.union(v.id('blogs'), v.id('projects')),
    entityType: v.union(v.literal('blog'), v.literal('project')),
    confidence: v.number(),
    metadata: v.object({
      source: v.union(v.literal('claude'), v.literal('manual')),
      createdAt: v.number(),
      context: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Check if association already exists
    const existingAssocs =
      (await ctx.db
        .query('tagAssociations')
        .filter((q) =>
          q.and(
            q.eq(q.field('tagId'), args.tagId),
            q.eq(q.field('entityId'), args.entityId),
            q.eq(q.field('entityType'), args.entityType)
          )
        )
        .collect()) || []

    if (existingAssocs.length > 0) {
      const existingAssoc = existingAssocs[0]
      // Update confidence and metadata if association exists
      await ctx.db.patch(existingAssoc._id, {
        confidence: args.confidence,
        metadata: args.metadata,
      })
      return existingAssoc._id
    }

    // Create new association if it doesn't exist
    return await ctx.db.insert('tagAssociations', {
      tagId: args.tagId,
      entityId: args.entityId,
      entityType: args.entityType,
      confidence: args.confidence,
      metadata: args.metadata,
    })
  },
})

export const getTagsForEntity = internalQuery({
  args: {
    entityId: v.union(v.id('blogs'), v.id('projects')),
    entityType: v.union(v.literal('blog'), v.literal('project')),
  },
  handler: async (ctx, args) => {
    // Get all tag associations for this entity
    const associations = await ctx.db
      .query('tagAssociations')
      .filter((q) =>
        q.and(
          q.eq(q.field('entityId'), args.entityId),
          q.eq(q.field('entityType'), args.entityType)
        )
      )
      .collect()

    if (associations.length === 0) {
      return []
    }

    // Get all tag IDs
    const tagIds = associations.map((assoc) => assoc.tagId)

    // Get all tags
    const tags = await ctx.db
      .query('tags')
      .filter((q) => q.or(...tagIds.map((id) => q.eq(q.field('_id'), id))))
      .collect()

    // Combine tag data with confidence scores
    return tags.map((tag) => {
      const association = associations.find((a) => a.tagId === tag._id)
      return {
        ...tag,
        confidence: association?.confidence || 0,
        context: association?.metadata?.context || '',
      }
    })
  },
})

export const getTagsForBlog = query({
  args: { blogId: v.id('blogs') },
  handler: async (ctx, args) => {
    // Get tag associations for this blog
    const associations = await ctx.db
      .query('tagAssociations')
      .filter((q) =>
        q.and(
          q.eq(q.field('entityType'), 'blog'),
          q.eq(q.field('entityId'), args.blogId)
        )
      )
      .collect()

    // If no associations, return empty array
    if (associations.length === 0) {
      return []
    }

    // Get all tag IDs
    const tagIds = associations.map((assoc) => assoc.tagId)

    // Get all tags
    const tags = await Promise.all(tagIds.map((tagId) => ctx.db.get(tagId)))

    // Combine tags with their confidence scores
    return associations
      .map((assoc) => {
        const tag = tags.find((t) => t?._id === assoc.tagId)
        return tag
          ? {
              ...tag,
              confidence: assoc.confidence,
            }
          : null
      })
      .filter(Boolean) // Remove any null tags
  },
})
