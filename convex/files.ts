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
    console.log('Starting storeFileReference mutation with args:', args)

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
    if (args.fileSize > MAX_FILE_SIZE) {
      console.error('File size validation failed:', args.fileSize)
      throw new Error(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE} bytes`
      )
    }

    const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
    if (!ALLOWED_MIME_TYPES.includes(args.mimeType)) {
      console.error('MIME type validation failed:', args.mimeType)
      throw new Error(`File type ${args.mimeType} is not supported`)
    }

    try {
      console.log('Attempting to insert file record into database...')
      const id = await ctx.db.insert('files', {
        projectId: args.projectId,
        fileName: args.fileName,
        fileKey: args.fileKey,
        fileUrl: args.fileUrl,
        fileSize: args.fileSize,
        mimeType: args.mimeType,
      })
      console.log('Successfully inserted file record with ID:', id)
      return id
    } catch (error) {
      console.error('Database insertion failed:', error)
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
