// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { APIError, Anthropic } from '@anthropic-ai/sdk'
import { Document } from '@langchain/core/documents'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private anthropicClient: Anthropic
  private indexName: string
  private readonly DIMENSIONS = 1536

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

  private generateDeterministicEmbedding(text: string): number[] {
    // This is a temporary solution that generates deterministic embeddings
    // based on the text content. This ensures consistent vectors for testing.
    const encoder = new TextEncoder()
    const bytes = encoder.encode(text)
    const embedding = new Array(this.DIMENSIONS).fill(0)

    for (let i = 0; i < bytes.length && i < this.DIMENSIONS; i++) {
      embedding[i] = (bytes[i] / 255) * 2 - 1 // Scale to [-1, 1]
    }

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    )
    return embedding.map((val) => val / magnitude)
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

      console.log('Generated document text. Creating embedding...')

      // Use deterministic embedding for now
      const embedding = this.generateDeterministicEmbedding(documentText)
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

      // Use deterministic embedding for query
      const queryEmbedding = this.generateDeterministicEmbedding(query)
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
