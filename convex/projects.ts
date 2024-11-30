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

  // Allow relative paths from public directory
  if (url.startsWith('/')) {
    // List of known valid public images
    const validPublicImages = [
      '/projectOne.jpg',
      '/projectTwoJJPod.jpg',
      '/a-ok-face.png',
      '/a-ok-face.svg',
      '/a-okay-monkey-1.png',
    ]
    return validPublicImages.includes(url)
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
const DEFAULT_PROJECT_IMAGE = '/projectOne.jpg' // Image from public folder

export const getAllProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').order('desc').collect()

    return projects.map((project) => ({
      ...project,
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
    try {
      // Log incoming arguments
      console.log('Received project creation request with args:', {
        ...args,
        content: args.content.substring(0, 100) + '...', // Truncate content for logging
      })

      // Validate image URL
      if (!isValidImageUrl(args.imageUrl)) {
        console.log('Image URL validation failed for:', args.imageUrl)
        throw new Error(
          `Invalid image URL format: ${args.imageUrl}. URL must be either:
          - An S3 URL starting with https://aok-projects-images.s3.us-east-2.amazonaws.com/
          - A relative path starting with /
          - A valid HTTPS URL`
        )
      }

      // Generate slug once
      const slug = createSlug(args.title)
      console.log('Generated slug:', slug)

      // Prepare insert data using the generated slug
      const insertData = {
        ...args,
        slug, // Use the already generated slug
      }
      console.log('Preparing to insert data:', {
        ...insertData,
        content: insertData.content.substring(0, 100) + '...', // Truncate content for logging
      })

      // Attempt database insertion
      const projectId = await ctx.db.insert('projects', insertData)
      console.log('Successfully created project with ID:', projectId)

      return projectId
    } catch (error) {
      console.error('Failed to create project:', {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : error,
        args: {
          ...args,
          content: args.content.substring(0, 100) + '...', // Truncate content for logging
        },
      })
      throw error
    }
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
