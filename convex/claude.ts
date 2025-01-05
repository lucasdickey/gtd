import { v } from 'convex/values'
import { internalAction } from './_generated/server'
import Anthropic from '@anthropic-ai/sdk'

// Helper function to get the appropriate API key for a use case
function getApiKeyForUseCase(useCase: 'blog-analysis'): string {
  switch (useCase) {
    case 'blog-analysis':
      const key = process.env.CLAUDE_BLOG_ANALYSIS_API_KEY
      if (!key) {
        throw new Error(
          'CLAUDE_BLOG_ANALYSIS_API_KEY is not set in environment variables'
        )
      }
      return key
    default:
      throw new Error(`Unknown use case: ${useCase}`)
  }
}

export const testClaudeConnection = internalAction({
  args: {
    useCase: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const apiKey = getApiKeyForUseCase(args.useCase as 'blog-analysis')

      const anthropic = new Anthropic({
        apiKey,
      })

      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Hello Claude, this is a test connection for use case: ${args.useCase}. Please respond with 'Connection successful'.`,
          },
        ],
      })

      console.log(
        `Claude API connection test successful for ${args.useCase}:`,
        message.id
      )
      return { success: true, messageId: message.id, useCase: args.useCase }
    } catch (error) {
      console.error(
        `Claude API connection test failed for ${args.useCase}:`,
        error
      )
      throw error
    }
  },
})
