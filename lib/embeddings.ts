// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { AnthropicEmbeddings } from 'langchain/embeddings/anthropic'
import { Document } from 'langchain/document'
import { PineconeStore } from 'langchain/vectorstores/pinecone'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private embeddings: AnthropicEmbeddings
  private indexName: string

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })

    this.embeddings = new AnthropicEmbeddings({
      modelName: 'claude-3.5-haiku-20240307',
    })

    this.indexName = process.env.PINECONE_INDEX_NAME!
  }

  async initializeService() {
    try {
      // Get the Pinecone index instance
      const index = this.pinecone.Index(this.indexName)

      // Create vector store instance
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      return vectorStore
    } catch (error) {
      console.error('Failed to initialize embeddings service:', error)
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

      // Create document text that captures project information
      const documentText = `
        Project Title: ${project.title}
        Description: ${project.description}
        Tags: ${project.tags.join(', ')}
      `.trim()

      const document = new Document({
        pageContent: documentText,
        metadata: {
          projectId: project.id,
          title: project.title,
          tags: project.tags,
        },
      })

      // Store in Pinecone using LangChain's vectorstore
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      await vectorStore.addDocuments([document])
      return project.id
    } catch (error) {
      console.error('Failed to add project:', error)
      throw error
    }
  }

  async searchSimilarProjects(query: string, limit: number = 3) {
    try {
      const index = this.pinecone.Index(this.indexName)

      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        { pineconeIndex: index }
      )

      const results = await vectorStore.similaritySearch(query, limit)
      return results
    } catch (error) {
      console.error('Failed to search projects:', error)
      throw error
    }
  }
}
