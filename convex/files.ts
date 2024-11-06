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
    projectId: v.union(v.id('projects'), v.literal('general')),
    fileName: v.string(),
    fileKey: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('Storing file reference in Convex:', {
      projectId: args.projectId,
      fileName: args.fileName,
      fileKey: args.fileKey,
      fileUrl: args.fileUrl,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
    })

    try {
      const id = await ctx.db.insert('files', {
        projectId: args.projectId,
        fileName: args.fileName,
        fileKey: args.fileKey,
        fileUrl: args.fileUrl,
        fileSize: args.fileSize,
        mimeType: args.mimeType,
      })
      console.log('Successfully stored file reference with ID:', id)
      return id
    } catch (error) {
      console.error('Error storing file reference:', error)
      throw error
    }
  },
})

// Get all files for a project
export const getFilesByProject = query({
  args: { projectId: v.union(v.id('projects'), v.literal('general')) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('files')
      .withIndex('by_projectId', (q) => q.eq('projectId', args.projectId))
      .collect()
  },
})

// Delete a file reference
export const deleteFile = mutation({
  args: { fileId: v.id('files') },
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
export const updateFile = mutation({
  args: {
    fileId: v.id('files'),
    updates: v.object({
      fileName: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId)
    if (!file) {
      throw new Error(`File ${args.fileId} not found`)
    }

    return await ctx.db.patch(args.fileId, args.updates)
  },
})
