// /convex/notes.ts
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const createNote = mutation({
  args: {
    title: v.string(),
    note: v.string(),
    externalRefUrl: v.string(),
    projectCardUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('notes', {
      title: args.title,
      note: args.note,
      externalRefUrl: args.externalRefUrl,
      projectCardUrl: args.projectCardUrl,
    })
  },
})
