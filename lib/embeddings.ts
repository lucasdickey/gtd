// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { Document } from 'langchain/document'
import { AnthropicEmbeddings } from 'langchain/embeddings/anthropic'
import { PineconeStore } from 'langchain/vectorstores/pinecone'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private embeddings: AnthropicEmbeddings
  private indexName: string

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    })

    // Using Anthropic embeddings for consistency with Claude
    this.embeddings = new AnthropicEmbeddings({
      modelName: 'claude-3-sonnet-20240229',
    })

    this.indexName = process.env.PINECONE_INDEX_NAME!
  }

  // Add method to check/handle embedding errors
  private async getEmbeddingWithRetry(
    text: string,
    maxRetries = 3
  ): Promise<number[]> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const [embedding] = await this.embeddings.embedDocuments([text])
        return embedding
      } catch (error) {
        if (i === maxRetries - 1) throw error
        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        )
      }
    }
    throw new Error('Failed to generate embedding after retries')
  }

  async initializeIndex() {
    const existingIndexes = await this.pinecone.listIndexes()

    if (!existingIndexes.includes(this.indexName)) {
      await this.pinecone.createIndex({
        name: this.indexName,
        dimension: 1536, // Dimension for Anthropic embeddings
        metric: 'cosine',
      })
    }
  }

  async addProject(project: {
    id: string
    title: string
    description: string
    imageUrl: string
    slug: string
    content: string
    images: string[]
    tools: string[]
    publishedAt: number
    projectUrl?: string
    projectUrlText?: string
  }) {
    const index = this.pinecone.Index(this.indexName)

    // Create document text with structured format for better embedding
    const documentText = `
      Project Title: ${project.title}
      Project Description: ${project.description}
      Project Image URL: ${project.imageUrl}
      Project Slug: ${project.slug}
      Project Content: ${project.content}
      Project Images: ${project.images.join(', ')}
      Project Tools: ${project.tools.join(', ')}
      Project Published At: ${project.publishedAt}
      Project URL: ${project.projectUrl || ''}
      Project URL Text: ${project.projectUrlText || ''}
      Project ID: ${project.id}
    `.trim()

    const document = new Document({
      pageContent: documentText,
      metadata: {
        projectId: project.id,
        title: project.title,
        tags: project.tags,
        imageUrl: project.imageUrl,
        slug: project.slug,
        content: project.content,
        images: project.images,
        tools: project.tools,
        publishedAt: project.publishedAt,
        projectUrl: project.projectUrl,
        projectUrlText: project.projectUrlText,
      },
    })

    try {
      // First, test embedding generation
      await this.getEmbeddingWithRetry(documentText)

      // If successful, store in Pinecone
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      await vectorStore.addDocuments([document])
      return project.id
    } catch (error) {
      console.error('Error adding project to vector store:', error)
      throw new Error('Failed to generate embeddings for project')
    }
  }

  async deleteProject(projectId: string) {
    try {
      const index = this.pinecone.Index(this.indexName)

      // Delete all vectors with matching projectId in metadata
      await index.deleteMany({
        filter: { projectId: projectId },
      })
    } catch (error) {
      console.error('Error deleting project from vector store:', error)
      throw new Error('Failed to delete project embeddings')
    }
  }

  async updateProject(project: {
    id: string
    title: string
    description: string
    imageUrl: string
    slug: string
    content: string
    images: string[]
    tools: string[]
    publishedAt: number
    projectUrl?: string
    projectUrlText?: string
  }) {
    try {
      // First delete the old project embeddings
      await this.deleteProject(project.id)
      // Then add the updated project
      return await this.addProject(project)
    } catch (error) {
      console.error('Error updating project in vector store:', error)
      throw new Error('Failed to update project embeddings')
    }
  }

  async searchSimilarProjects(query: string, limit: number = 3) {
    try {
      const index = this.pinecone.Index(this.indexName)

      // Create vector store interface
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      // Perform similarity search
      const results = await vectorStore.similaritySearch(query, limit)

      return results
    } catch (error) {
      console.error('Error searching similar projects:', error)
      throw new Error('Failed to search similar projects')
    }
  }

  async searchSimilarProjectsWithScores(query: string, limit: number = 3) {
    try {
      const index = this.pinecone.Index(this.indexName)

      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      // Search with scores
      const results = await vectorStore.similaritySearchWithScore(query, limit)

      // Transform results to include similarity scores
      return results.map(([doc, score]) => ({
        document: doc,
        score: score,
      }))
    } catch (error) {
      console.error('Error searching similar projects with scores:', error)
      throw new Error('Failed to search similar projects with scores')
    }
  }

  async batchAddProjects(
    projects: Array<{
      id: string
      title: string
      description: string
      tags: string[]
    }>
  ) {
    try {
      const index = this.pinecone.Index(this.indexName)

      // Convert projects to documents
      const documents = projects.map((project) => {
        const documentText = `
          Project Title: ${project.title}
          Project Description: ${project.description}
          Project Tags: ${project.tags.join(', ')}
          Project ID: ${project.id}
        `.trim()

        return new Document({
          pageContent: documentText,
          metadata: {
            projectId: project.id,
            title: project.title,
            tags: project.tags,
          },
        })
      })

      // Create vector store interface
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      // Batch add documents
      await vectorStore.addDocuments(documents)

      return projects.map((p) => p.id)
    } catch (error) {
      console.error('Error batch adding projects:', error)
      throw new Error('Failed to batch add projects')
    }
  }

  async getProjectsByTag(tag: string, limit: number = 10) {
    try {
      const index = this.pinecone.Index(this.indexName)

      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      // Search with metadata filter for tag
      const results = await vectorStore.similaritySearch(
        '', // empty query string since we're filtering by metadata
        limit,
        { tags: tag } // metadata filter
      )

      return results
    } catch (error) {
      console.error('Error getting projects by tag:', error)
      throw new Error('Failed to get projects by tag')
    }
  }

  async deleteAllProjects() {
    try {
      const index = this.pinecone.Index(this.indexName)

      // Delete all vectors in the index
      await index.deleteAll()
    } catch (error) {
      console.error('Error deleting all projects:', error)
      throw new Error('Failed to delete all projects')
    }
  }
}
