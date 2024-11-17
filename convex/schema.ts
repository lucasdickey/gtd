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
  contentSummaries: defineTable({
    sourceId: v.id('projects'), // References the source content (project in this case)
    useCase: v.string(), // e.g., "project card summary"
    summary: v.string(), // The Claude-generated summary
    generatedAt: v.number(), // Timestamp of generation
  })
    .index('by_sourceId', ['sourceId'])
    .index('by_useCase', ['useCase']),
})
