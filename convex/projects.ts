import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { ProjectRAG } from '../lib/rag'

export const getAllProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect()
    return projects
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
    slug: v.string(),
    content: v.string(),
    images: v.array(v.string()),
    tools: v.array(v.string()),
    publishedAt: v.number(),
    projectUrl: v.optional(v.string()),
    projectUrlText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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

export const addProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.insert('projects', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const rag = new ProjectRAG()
    await rag.addProject({
      id: project._id.toString(),
      ...args,
    })

    return project
  },
})

export const askQuestion = mutation({
  args: {
    question: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const rag = new ProjectRAG()

    const { answer, relevantProjects } = await rag.query(args.question)

    await ctx.db.insert('chatHistory', {
      userId: args.userId,
      question: args.question,
      answer,
      relevantProjects,
      timestamp: Date.now(),
    })

    return { answer, relevantProjects }
  },
})

export const getChatHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('chatHistory')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .take(50)
  },
})
