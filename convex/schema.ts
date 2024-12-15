import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
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
    topics: v.optional(v.array(v.string())),
    entities: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.string(),
        })
      )
    ),
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
})
