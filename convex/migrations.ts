import { mutation } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const migrate = mutation({
  handler: async (ctx) => {
    // Get all blogs
    const blogs = await ctx.db.query('blogs').collect()

    // Track changes
    let updated = 0
    const errors: Array<{ id: Id<'blogs'>; error: string }> = []

    // Update each blog
    for (const blog of blogs) {
      try {
        // Prepare update object
        const updates: Partial<Doc<'blogs'>> = {}

        // Fix author field if missing
        if (!blog.author) {
          updates.author = 'Lucas Dickey'
        }

        // Fix publishedAt field if missing or if publishDate exists
        if (!blog.publishedAt && (blog as any).publishDate) {
          updates.publishedAt = (blog as any).publishDate
        }

        // Only update if we have changes
        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(blog._id, updates)
          updated++
        }
      } catch (error) {
        errors.push({
          id: blog._id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { updated, errors }
  },
})
