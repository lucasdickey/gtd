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
  }),
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }),
})
