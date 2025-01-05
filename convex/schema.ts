import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tags: defineTable({
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
  })
    .index('by_name', ['name'])
    .index('by_category', ['category']),

  tagAssociations: defineTable({
    tagId: v.id('tags'),
    entityId: v.union(v.id('blogs'), v.id('projects')), // extensible to other tables
    entityType: v.union(v.literal('blog'), v.literal('project')),
    confidence: v.number(), // Claude's confidence score (0-1)
    metadata: v.optional(
      v.object({
        source: v.union(v.literal('claude'), v.literal('manual')),
        createdAt: v.number(),
        context: v.optional(v.string()), // Any additional context about why this tag was applied
      })
    ),
  })
    .index('by_entity', ['entityType', 'entityId'])
    .index('by_tag', ['tagId'])
    .index('by_confidence', ['confidence']),

  files: defineTable({
    projectId: v.union(v.id('projects'), v.literal('general')),
    fileName: v.string(),
    fileKey: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
  }).index('by_projectId', ['projectId']),
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    slug: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    tools: v.array(v.string()),
    publishedAt: v.number(),
    projectUrl: v.optional(v.string()),
    projectUrlText: v.optional(v.string()),
  }),
  notes: defineTable({
    title: v.string(),
    note: v.string(),
    externalRefUrl: v.optional(v.string()),
    projectCardUrl: v.optional(v.string()),
  }),
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }),
  blogs: defineTable({
    title: v.string(),
    body: v.string(),
    slug: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    publishDate: v.optional(v.number()),
    updateDate: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  })
    .index('by_publish_date', ['publishDate'])
    .index('by_published_at', ['publishedAt']),
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    lastLoginAt: v.optional(v.number()),
    sessionToken: v.optional(v.string()),
    sessionExpiresAt: v.optional(v.number()),
  }).index('by_email', ['email']),
  tagsClaudeRuns: defineTable({
    blogId: v.id('blogs'),
    status: v.string(), // 'success' | 'error'
    prompt: v.string(),
    rawResponse: v.string(),
    error: v.optional(v.string()),
    metadata: v.object({
      retryCount: v.number(),
      duration: v.number(), // in milliseconds
      timestamp: v.number(),
    }),
  }).index('by_blog', ['blogId']),
})
