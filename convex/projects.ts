import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Add a more specific validation helper
const isValidS3ImageUrl = (url: string) => {
  if (!url) return false
  return url.startsWith(
    'https://aok-projects-images.s3.us-east-2.amazonaws.com/'
  )
}

export const getAllProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()

    // Add validation and logging with more specific error messages
    const validatedProjects = projects.map((project) => {
      if (!project.imageUrl) {
        console.error(`Project ${project._id} has no imageUrl`)
      } else if (!isValidS3ImageUrl(project.imageUrl)) {
        console.error(
          `Project ${project._id} has invalid S3 imageUrl: ${project.imageUrl}. Expected format: https://aok-projects-images.s3.us-east-2.amazonaws.com/...`
        )
      }
      return {
        ...project,
        imageUrl: isValidS3ImageUrl(project.imageUrl) ? project.imageUrl : null,
      }
    })

    return validatedProjects
  },
})

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('slug'), args.slug))
      .collect()
    return projects[0] || null
  },
})

// Add a validation helper
const isValidImageUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    // If it's not a valid URL, check if it's a valid public path
    return url.startsWith('/')
  }
}

export const createProject = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Validate image URL
    if (!isValidImageUrl(args.imageUrl)) {
      throw new Error('Invalid image URL format')
    }

    const projectId = await ctx.db.insert('projects', {
      ...args,
    })
    return projectId
  },
})

export const updateProject = mutation({
  args: {
    id: v.id('projects'),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  },
})

export const deleteProject = mutation({
  args: {
    id: v.id('projects'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const checkImageUrls = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()
    return projects.map((p) => ({
      id: p._id,
      imageUrl: p.imageUrl,
      isValid: isValidImageUrl(p.imageUrl),
    }))
  },
})

export const get = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()
    return projects.map((project) => ({
      ...project,
      // Make sure imageUrl is being returned and is a full S3 URL
      imageUrl: project.imageUrl, // Should be the full S3 URL
    }))
  },
})

export const fixBrokenImageUrls = mutation({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()

    let fixed = 0
    for (const project of projects) {
      if (!isValidS3ImageUrl(project.imageUrl)) {
        // You could either:
        // 1. Set a default image
        await ctx.db.patch(project._id, {
          imageUrl:
            'https://aok-projects-images.s3.us-east-2.amazonaws.com/default-project-image.jpg',
        })
        // 2. Or set to null
        // await ctx.db.patch(project._id, { imageUrl: null });
        fixed++
      }
    }

    return { fixed }
  },
})
