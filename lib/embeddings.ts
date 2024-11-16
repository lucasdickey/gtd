// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import Anthropic from '@anthropic-ai/sdk'
import { Document } from '@langchain/core/documents'
import { PineconeStore } from '@langchain/pinecone'
import { EmbeddingsInterface } from '@langchain/core/embeddings'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private anthropic: Anthropic
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

    this.anthropic = new Anthropic({
      apiKey: requiredEnvVars.ANTHROPIC_API_KEY,
    })

    this.indexName = requiredEnvVars.PINECONE_INDEX_NAME

    // Log initialization
    console.log('Service initialized with:', {
      hasPinecone: !!this.pinecone,
      hasAnthropic: !!this.anthropic,
      indexName: this.indexName,
    })
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embedding = await this.anthropic.embeddings.create({
        model: 'claude-3-haiku-20240307',
        input: text,
      })

      return embedding.embeddings[0]
    } catch (error) {
      console.error('Error generating embedding:', error)
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
      const index = this.pinecone.Index(this.indexName)

      // Create document text
      const documentText = `
        Project Title: ${project.title}
        Description: ${project.description}
        Tags: ${project.tags.join(', ')}
      `.trim()

      // Generate embedding
      const embedding = await this.generateEmbedding(documentText)

      // Create document with metadata
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

      return project.id
    } catch (error) {
      console.error('Failed to add project:', error)
      throw error
    }
  }

  async searchSimilarProjects(query: string, limit: number = 3) {
    try {
      const index = this.pinecone.Index(this.indexName)

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query)

      // Search in Pinecone
      const results = await index.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
      })

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
