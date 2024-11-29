import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Helper functions
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isValidS3ImageUrl(url: string): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return (
      urlObj.hostname === 'aok-projects-images.s3.us-east-2.amazonaws.com' &&
      url.startsWith('https://aok-projects-images.s3.us-east-2.amazonaws.com/')
    )
  } catch {
    return false
  }
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Allow S3 URLs
  if (
    url.startsWith('https://aok-projects-images.s3.us-east-2.amazonaws.com/')
  ) {
    return true
  }

  // Allow relative paths
  if (url.startsWith('/')) {
    return true
  }

  // Allow any HTTPS URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// At the top with other constants
const DEFAULT_PROJECT_IMAGE = '/projectOne.jpg' // Using an existing image from public folder

export const getAllProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').order('desc').collect()

    return projects.map((project) => ({
      ...project,
      // Use the default image if the project image is invalid
      imageUrl: isValidImageUrl(project.imageUrl)
        ? project.imageUrl
        : DEFAULT_PROJECT_IMAGE,
    }))
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

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    tools: v.array(v.string()),
    publishedAt: v.number(),
    projectUrl: v.optional(v.string()),
    projectUrlText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate image URL with better error message
    if (!isValidImageUrl(args.imageUrl)) {
      throw new Error(
        `Invalid image URL format: ${args.imageUrl}. URL must be either:
        - An S3 URL starting with https://aok-projects-images.s3.us-east-2.amazonaws.com/
        - A relative path starting with /
        - A valid HTTPS URL`
      )
    }

    const projectId = await ctx.db.insert('projects', {
      ...args,
      slug: createSlug(args.title),
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
    content: v.string(),
    images: v.array(v.string()),
    tools: v.array(v.string()),
    publishedAt: v.number(),
    projectUrl: v.optional(v.string()),
    projectUrlText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, {
      ...data,
      slug: createSlug(data.title),
    })
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
    return projects.map((project) => ({
      id: project._id,
      imageUrl: project.imageUrl,
      images: project.images,
      isValid: isValidS3ImageUrl(project.imageUrl),
    }))
  },
})

export const fixBrokenImageUrls = mutation({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()

    let fixed = 0
    for (const project of projects) {
      if (!isValidImageUrl(project.imageUrl)) {
        await ctx.db.patch(project._id, {
          imageUrl: DEFAULT_PROJECT_IMAGE,
        })
        fixed++
      }
    }

    return { fixed }
  },
})
