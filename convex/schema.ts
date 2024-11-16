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
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }),
  chatHistory: defineTable({
    userId: v.string(),
    question: v.string(),
    answer: v.string(),
    relevantProjects: v.array(
      v.object({
        projectId: v.string(),
        title: v.string(),
        tags: v.array(v.string()),
      })
    ),
    timestamp: v.number(),
  }),
})
