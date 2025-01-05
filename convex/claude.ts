import { v } from 'convex/values'
import { internalAction, ActionCtx } from './_generated/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  BLOG_TAG_ANALYSIS_PROMPT,
  validateTagAnalysisResponse,
  BlogTagAnalysisResponse,
} from '../src/lib/prompts/claude'
import { Id } from './_generated/dataModel'
import { internal } from './_generated/api'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 1000

interface BlogContent {
  title: string
  body: string
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractJSONFromText(text: string): unknown {
  // Look for JSON object pattern
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON object found in text')
  }

  try {
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    // Look for JSON array pattern as fallback
    const arrayMatch = text.match(/\[[\s\S]*\]/)
    if (!arrayMatch) {
      throw new Error('Failed to parse JSON and no array pattern found')
    }
    return JSON.parse(arrayMatch[0])
  }
}

async function generateTagsWithRetry(
  anthropic: Anthropic,
  blogContent: BlogContent,
  ctx: ActionCtx,
  blogId: Id<'blogs'>,
  attempt = 1
): Promise<BlogTagAnalysisResponse> {
  const startTime = Date.now()
  const prompt = BLOG_TAG_ANALYSIS_PROMPT.replace(
    '{{title}}',
    blogContent.title
  ).replace('{{content}}', blogContent.body)

  try {
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    let parsedResponse: unknown
    const rawResponse =
      message.content[0].type === 'text' ? message.content[0].text : ''

    try {
      // Extract JSON from Claude's response
      parsedResponse = extractJSONFromText(rawResponse)

      console.log(
        `[Claude Tag Generation] Raw response on attempt ${attempt}:`,
        JSON.stringify(parsedResponse, null, 2)
      )
    } catch (parseError) {
      if (parseError instanceof Error) {
        console.error(
          `[Claude Tag Generation] JSON parse error on attempt ${attempt}:`,
          parseError.message,
          '\nRaw content:',
          rawResponse
        )
      }

      // Log the failed run
      await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
        blogId,
        status: 'error',
        prompt,
        rawResponse,
        error:
          parseError instanceof Error ? parseError.message : 'JSON parse error',
        retryCount: attempt,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      })

      throw new Error('Failed to parse JSON from Claude response')
    }

    // Validate the response matches our schema
    if (!validateTagAnalysisResponse(parsedResponse)) {
      console.error(
        `[Claude Tag Generation] Schema validation failed on attempt ${attempt}. Response:`,
        JSON.stringify(parsedResponse, null, 2)
      )

      // Log the failed run
      await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
        blogId,
        status: 'error',
        prompt,
        rawResponse,
        error: 'Schema validation failed',
        retryCount: attempt,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      })

      throw new Error('Response failed schema validation')
    }

    // Log the successful run
    await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
      blogId,
      status: 'success',
      prompt,
      rawResponse,
      retryCount: attempt,
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    })

    return parsedResponse
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      `[Claude Tag Generation] Error on attempt ${attempt}:`,
      errorMessage
    )

    // Log the failed run
    await ctx.runMutation(internal.tagsClaudeRuns.insertClaudeRun, {
      blogId,
      status: 'error',
      prompt,
      rawResponse: '',
      error: errorMessage,
      retryCount: attempt,
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    })

    if (attempt >= MAX_RETRIES) {
      throw new Error(`Failed after ${MAX_RETRIES} attempts: ${errorMessage}`)
    }

    await delay(RETRY_DELAY_MS * attempt) // Exponential backoff
    return generateTagsWithRetry(
      anthropic,
      blogContent,
      ctx,
      blogId,
      attempt + 1
    )
  }
}

export const generateBlogTags = internalAction({
  args: {
    blogId: v.id('blogs'),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log('[Claude Tag Generation] Starting tag generation process')

      const apiKey = process.env.CLAUDE_BLOG_ANALYSIS_API_KEY
      if (!apiKey) {
        console.error('[Claude Tag Generation] API key is not set')
        throw new Error('CLAUDE_BLOG_ANALYSIS_API_KEY is not set')
      }
      console.log('[Claude Tag Generation] API key is properly set')

      const anthropic = new Anthropic({
        apiKey,
      })

      console.log(
        `[Claude Tag Generation] Starting tag generation for blog: ${args.title}`,
        {
          blogId: args.blogId,
          contentLength: args.body.length,
        }
      )

      const tagAnalysis = await generateTagsWithRetry(
        anthropic,
        {
          title: args.title,
          body: args.body,
        },
        ctx,
        args.blogId
      )

      console.log(
        `[Claude Tag Generation] Successfully generated tags for blog: ${args.title}`,
        {
          blogId: args.blogId,
          tagCount: tagAnalysis.tags.length,
          associationCount: tagAnalysis.associations.length,
          tags: tagAnalysis.tags.map(
            (tag: { name: string; category: string }) => ({
              name: tag.name,
              category: tag.category,
            })
          ),
        }
      )

      // Store tags and associations using internal mutations
      const createdTags = []
      for (const tag of tagAnalysis.tags) {
        const tagId = await ctx.runMutation(
          internal.tags.createTagIfNotExists,
          {
            name: tag.name,
            description: tag.description,
            category: tag.category,
            metadata: tag.metadata,
          }
        )
        createdTags.push({ id: tagId, name: tag.name })
      }

      console.log('[Claude Tag Generation] Created/updated tags:', createdTags)

      // Get all tag IDs in one query
      const tagIds = await ctx.runQuery(internal.tags.getTagIdsByNames, {
        names: tagAnalysis.tags.map((tag: { name: string }) => tag.name),
      })

      console.log('[Claude Tag Generation] Retrieved tag IDs:', tagIds)

      // Create associations
      const createdAssociations = []
      for (const assoc of tagAnalysis.associations) {
        const tagId = tagIds[assoc.tagName]
        if (!tagId) {
          console.error(
            `[Claude Tag Generation] Tag ID not found for name: ${assoc.tagName}`
          )
          continue
        }

        const assocId = await ctx.runMutation(
          internal.tagAssociations.createAssociation,
          {
            tagId,
            entityId: args.blogId,
            entityType: 'blog',
            confidence: assoc.confidence,
            metadata: assoc.metadata,
          }
        )
        createdAssociations.push({ id: assocId, tagName: assoc.tagName })
      }

      console.log(
        '[Claude Tag Generation] Created associations:',
        createdAssociations
      )

      return {
        success: true,
        tagCount: tagAnalysis.tags.length,
        associationCount: tagAnalysis.associations.length,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      console.error('[Claude Tag Generation] Fatal error:', errorMessage)
      throw error
    }
  },
})
