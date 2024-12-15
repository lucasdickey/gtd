import Anthropic from '@anthropic-ai/sdk'
import { CLAUDE_MODELS, CLAUDE_PROMPTS } from '../constants/prompts'

export class ClaudeService {
  private static instance: ClaudeService
  private client: Anthropic

  private constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  public static getInstance(): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService()
    }
    return ClaudeService.instance
  }

  public async extractTopicsAndEntities(params: {
    title: string
    content: string
  }): Promise<{
    topics: string[]
    entities: { name: string; type: string }[]
  }> {
    try {
      const extractionPrompt =
        CLAUDE_PROMPTS.BLOG_TOPIC_ENTITY_EXTRACTION.replace(
          '{title}',
          params.title
        ).replace('{content}', params.content)

      const response = await this.client.messages.create({
        model: CLAUDE_MODELS.HAIKU,
        max_tokens: 1024,
        messages: [
          { role: 'user', content: extractionPrompt },
          {
            role: 'assistant',
            content: 'I will respond with a strict JSON format.',
          },
        ],
        temperature: 0.1,
      })

      const responseText =
        response.content.find((block) => block.type === 'text')?.text || ''

      console.log('Claude Response Text:', responseText)

      try {
        // First, try direct JSON parsing
        const extractedData = JSON.parse(responseText)

        const topics = Array.isArray(extractedData.topics)
          ? extractedData.topics
          : []
        const entities = Array.isArray(extractedData.entities)
          ? extractedData.entities
          : []

        console.log('Extracted Topics:', topics)
        console.log('Extracted Entities:', entities)

        return { topics, entities }
      } catch (parseError) {
        // Fallback: Try to extract JSON-like content
        console.error('Direct JSON Parsing Error:', parseError)

        try {
          // Attempt to extract JSON from between first { and last }
          const jsonMatch = responseText.match(/\{[\s\S]*\}/m)
          if (jsonMatch) {
            const extractedData = JSON.parse(jsonMatch[0])

            const topics = Array.isArray(extractedData.topics)
              ? extractedData.topics
              : []
            const entities = Array.isArray(extractedData.entities)
              ? extractedData.entities
              : []

            console.log('Fallback Extracted Topics:', topics)
            console.log('Fallback Extracted Entities:', entities)

            return { topics, entities }
          }
        } catch (fallbackError) {
          console.error('Fallback JSON Extraction Failed:', fallbackError)
        }

        // Last resort: Manual parsing
        console.warn('Attempting manual extraction from response')
        const topicsMatch = responseText.match(/["']topics["']:\s*\[(.*?)\]/i)
        const entitiesMatch = responseText.match(
          /["']entities["']:\s*\[(.*?)\]/i
        )

        const topics = topicsMatch
          ? topicsMatch[1]
              .split(',')
              .map((t) => t.trim().replace(/^["']|["']$/g, ''))
          : []

        const entities = entitiesMatch
          ? entitiesMatch[1]
              .split(/},\s*{/)
              .map((entity) => {
                const nameMatch = entity.match(/["']name["']:\s*["'](.+?)["']/i)
                const typeMatch = entity.match(/["']type["']:\s*["'](.+?)["']/i)
                return nameMatch && typeMatch
                  ? {
                      name: nameMatch[1].trim(),
                      type: typeMatch[1].trim().toUpperCase(),
                    }
                  : null
              })
              .filter(Boolean)
          : []

        console.log('Manual Extracted Topics:', topics)
        console.log('Manual Extracted Entities:', entities)

        return { topics, entities }
      }
    } catch (error) {
      console.error('Claude API Extraction Error:', error)
      return { topics: [], entities: [] }
    }
  }

  // Add more Claude-powered methods here in the future
}
