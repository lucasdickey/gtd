// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { APIError, Anthropic } from '@anthropic-ai/sdk'
import { Document } from '@langchain/core/documents'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private anthropicClient: Anthropic
  private indexName: string

  constructor() {
    // Validate environment variables
    const requiredEnvVars = {
      PINECONE_API_KEY: process.env.PINECONE_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
    }

    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value) throw new Error(`${key} is not set`)
    })

    // Initialize clients
    this.pinecone = new Pinecone({
      apiKey: requiredEnvVars.PINECONE_API_KEY,
    })

    this.anthropicClient = new Anthropic({
      apiKey: requiredEnvVars.ANTHROPIC_API_KEY,
    })

    this.indexName = requiredEnvVars.PINECONE_INDEX_NAME
  }

  private parseEmbeddingArray(text: string): number[] {
    try {
      // Extract everything between square brackets
      const match = text.match(/\[(.*?)\]/)
      if (!match) throw new Error('No array found in response')

      // Parse the numbers
      const numbers = match[1].split(',').map((n) => parseFloat(n.trim()))
      console.log(`Parsed ${numbers.length} numbers from response`)

      // Pad or truncate to 1536 dimensions if needed
      const targetDimensions = 1536
      if (numbers.length < targetDimensions) {
        console.log(
          `Padding array from ${numbers.length} to ${targetDimensions} dimensions`
        )
        return [
          ...numbers,
          ...new Array(targetDimensions - numbers.length).fill(0),
        ]
      } else if (numbers.length > targetDimensions) {
        console.log(
          `Truncating array from ${numbers.length} to ${targetDimensions} dimensions`
        )
        return numbers.slice(0, targetDimensions)
      }
      return numbers
    } catch (error) {
      console.error('Error parsing embedding array:', error)
      throw error
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      console.log(
        'Generating embedding for text:',
        text.substring(0, 50) + '...'
      )

      const response = await this.anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        system:
          'Generate a 1536-dimensional embedding vector for this text that captures its semantic meaning. Return only the numerical vector as a JSON array of numbers, nothing else.',
      })

      const embeddings = this.parseEmbeddingArray(response.content[0].text)
      console.log(`Generated embedding with ${embeddings.length} dimensions`)

      return embeddings
    } catch (error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        type: error instanceof APIError ? error.type : 'unknown',
        status: error instanceof APIError ? error.status : 'unknown',
      })
      throw error
    }
  }

  async addProject(project: {
    id: string
    title: string
    description: string
    tags: string[]
  }) {
    try {
      console.log('\nAdding project:', project.title)
      const index = this.pinecone.Index(this.indexName)

      // Create document text with more context
      const documentText = `
        Project Title: ${project.title}
        Description: ${project.description}
        Tags: ${project.tags.join(', ')}
        Type: Project Document
        Purpose: Semantic Search and Retrieval
      `.trim()

      console.log('Generated document text. Getting embedding...')

      // Get embedding
      const embedding = await this.generateEmbedding(documentText)
      console.log('Got embedding of length:', embedding.length)

      // Store in Pinecone
      await index.upsert([
        {
          id: project.id,
          values: embedding,
          metadata: {
            title: project.title,
            description: project.description,
            tags: project.tags,
          },
        },
      ])

      console.log('Successfully stored in Pinecone')
      return project.id
    } catch (error) {
      console.error('Failed to add project:', error)
      throw error
    }
  }

  async searchSimilarProjects(query: string, limit: number = 3) {
    try {
      console.log('\nSearching for:', query)
      const index = this.pinecone.Index(this.indexName)

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query)
      console.log(
        'Generated query embedding with length:',
        queryEmbedding.length
      )

      // Search in Pinecone
      const results = await index.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
      })

      console.log(`Found ${results.matches.length} matches`)
      return results.matches.map((match) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      }))
    } catch (error) {
      console.error('Failed to search projects:', error)
      throw error
    }
  }
}
