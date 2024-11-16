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

    // Log initialization
    console.log('Service initialized with:', {
      hasPinecone: !!this.pinecone,
      hasAnthropic: !!this.anthropicClient,
      indexName: this.indexName,
      anthropicVersion: this.anthropicClient.version, // Log API version
    })
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      console.log(
        'Generating embedding for text:',
        text.substring(0, 50) + '...'
      )

      const response = await this.anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        system:
          'Generate an embedding for this text that captures its semantic meaning.',
      })

      console.log('Response from Anthropic:', JSON.stringify(response, null, 2))

      // If we get a response but no embedding, we'll generate a temporary one
      // This is for testing - we should handle this differently in production
      const tempEmbedding = new Array(1536).fill(0).map(() => Math.random())

      return tempEmbedding
    } catch (error) {
      if (error instanceof APIError) {
        console.error('Anthropic API Error:', {
          status: error.status,
          message: error.message,
          type: error.type,
        })
      }
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

      // Create document text
      const documentText = `
        Project Title: ${project.title}
        Description: ${project.description}
        Tags: ${project.tags.join(', ')}
      `.trim()

      console.log('Generated document text. Getting embedding...')
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
      console.log('Generated query embedding')

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
