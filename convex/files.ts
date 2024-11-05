// convex/files.ts
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

// Type for our file data
interface FileData {
  projectId: Id<'projects'>
  fileName: string
  fileKey: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

// Store a new file reference
export const storeFileReference = mutation({
  args: {
    projectId: v.id('projects'),
    fileName: v.string(),
    fileKey: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    // Optional: Verify that the project exists
    const project = await ctx.db.get(args.projectId)
    if (!project) {
      throw new Error(`Project ${args.projectId} not found`)
    }

    // Insert the file reference
    return await ctx.db.insert('projectFiles', {
      ...args,
      uploadedAt: Date.now(),
    })
  },
})

// Get all files for a project
export const getProjectFiles = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projectFiles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect()
  },
})

// Delete a file reference
export const deleteFileReference = mutation({
  args: { fileId: v.id('projectFiles') },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId)
    if (!file) {
      throw new Error(`File ${args.fileId} not found`)
    }

    await ctx.db.delete(args.fileId)
    return file.fileKey // Return the S3 key for cleanup if needed
  },
})

// Update file metadata
export const updateFileMetadata = mutation({
  args: {
    fileId: v.id('projectFiles'),
    fileName: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fileId, ...updates } = args

    const file = await ctx.db.get(fileId)
    if (!file) {
      throw new Error(`File ${fileId} not found`)
    }

    return await ctx.db.patch(fileId, updates)
  },
})
