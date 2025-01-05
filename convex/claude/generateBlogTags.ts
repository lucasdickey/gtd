import { internalAction } from '../_generated/server'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { v } from 'convex/values'
import Anthropic from '@anthropic-ai/sdk'
import {
  BLOG_TAG_ANALYSIS_PROMPT,
  validateTagAnalysisResponse,
  type BlogTagAnalysisResponse,
} from '../../src/lib/prompts/claude/blog-analysis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export default internalAction({
  args: {
    blogId: v.id('blogs'),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    return await generateTagsWithRetry(ctx, args)
  },
})

async function generateTagsWithRetry(
  ctx: any,
  args: { blogId: Id<'blogs'>; title: string; body: string },
  retryCount = 0
): Promise<string> {
  const maxRetries = 3
  const startTime = Date.now()

  try {
    const prompt = BLOG_TAG_ANALYSIS_PROMPT.replace(
      '{BLOG_CONTENT}',
      `Title: ${args.title}\n\nContent: ${args.body}`
    )

    // Log the attempt
    await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
      blogId: args.blogId,
      status: 'started',
      prompt,
      rawResponse: '',
      retryCount,
      duration: 0,
      timestamp: startTime,
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawResponse =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const duration = Date.now() - startTime

    try {
      const parsedResponse = JSON.parse(rawResponse) as BlogTagAnalysisResponse
      const validationResult = validateTagAnalysisResponse(parsedResponse)

      if (validationResult) {
        // Log success
        await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
          blogId: args.blogId,
          status: 'success',
          prompt,
          rawResponse,
          retryCount,
          duration,
          timestamp: startTime,
        })

        // Create tags and associations
        const tagIdMap = new Map<string, Id<'tags'>>()

        // First create all tags
        for (const tag of parsedResponse.tags) {
          const tagId = await ctx.runMutation(
            internal.tags.createTagIfNotExists,
            {
              name: tag.name,
              description: tag.description,
              category: tag.category,
              metadata: tag.metadata,
            }
          )
          tagIdMap.set(tag.name, tagId)
        }

        // Then create associations using the confidence from associations array
        for (const assoc of parsedResponse.associations) {
          const tagId = tagIdMap.get(assoc.tagName)
          if (!tagId) {
            console.error(`Tag ID not found for name: ${assoc.tagName}`)
            continue
          }

          await ctx.runMutation(internal.tagAssociations.createAssociation, {
            tagId,
            entityType: 'blog',
            entityId: args.blogId,
            confidence: assoc.confidence,
            metadata: assoc.metadata,
          })
        }

        return 'Tags generated and associated successfully'
      } else {
        throw new Error('Response failed validation')
      }
    } catch (error) {
      // Log validation/parsing error
      await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
        blogId: args.blogId,
        status: 'error',
        prompt,
        rawResponse,
        error: error instanceof Error ? error.message : String(error),
        retryCount,
        duration,
        timestamp: startTime,
      })

      throw error
    }
  } catch (error) {
    const duration = Date.now() - startTime

    // Log the error
    await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
      blogId: args.blogId,
      status: 'error',
      prompt: BLOG_TAG_ANALYSIS_PROMPT.replace(
        '{BLOG_CONTENT}',
        `Title: ${args.title}\n\nContent: ${args.body}`
      ),
      rawResponse: '',
      error: error instanceof Error ? error.message : String(error),
      retryCount,
      duration,
      timestamp: startTime,
    })

    if (retryCount < maxRetries) {
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, retryCount) * 1000)
      )
      return generateTagsWithRetry(ctx, args, retryCount + 1)
    }

    throw error
  }
}
