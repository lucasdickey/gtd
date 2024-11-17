// summaries.ts
import { mutation, action, query } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'
import { Id } from './_generated/dataModel'

// Helper function to generate Claude prompt
function generatePrompt(
  title: string,
  description: string,
  content: string
): string {
  return `Summarize the following project in a single engaging tweet-length sentence that highlights its key value proposition. Do not use hashtags or @mentions.

Project Title: ${title}
Description: ${description}
Content: ${content}`
}

// Action to generate summary via Claude API
export const generateProjectSummary = action({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get project details
    const project = await ctx.runQuery(api.projects.getProjectById, {
      id: args.projectId,
    })

    if (!project) {
      console.log('Project not found:', args.projectId)
      return null
    }

    try {
      // Call Claude API
      const ANTHROPIC_API_KEY = await ctx.env.ANTHROPIC_API_KEY
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 150,
          messages: [
            {
              role: 'user',
              content: generatePrompt(
                project.title,
                project.description,
                project.content
              ),
            },
          ],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.log('Claude API error:', result)
        return null
      }

      // Get the summary from Claude's response
      const summary = result.content[0].text

      // Store summary in database
      await ctx.runMutation(api.summaries.storeSummary, {
        projectId: args.projectId,
        summary,
      })

      return summary
    } catch (error) {
      console.log('Error generating summary:', error)
      return null
    }
  },
})

// Mutation to store the generated summary
export const storeSummary = mutation({
  args: {
    projectId: v.id('projects'),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('contentSummaries', {
      sourceId: args.projectId,
      useCase: 'project card summary',
      summary: args.summary,
      generatedAt: Date.now(),
    })
  },
})

// Query to get summary for a project
export const getProjectSummary = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const summaries = await ctx.db
      .query('contentSummaries')
      .withIndex('by_sourceId', (q) => q.eq('sourceId', args.projectId))
      .filter((q) => q.eq(q.field('useCase'), 'project card summary'))
      .order('desc')
      .first()

    return summaries
  },
})