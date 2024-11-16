// lib/embeddings.ts
import { Pinecone } from '@pinecone-database/pinecone'
import { Anthropic } from '@anthropic-ai/sdk'
import { Document } from '@langchain/core/documents'
import { PineconeStore } from '@langchain/pinecone'
import { EmbeddingsInterface } from '@langchain/core/embeddings'

export class ProjectEmbeddingsService {
  private pinecone: Pinecone
  private anthropicClient: Anthropic
  private indexName: string

  constructor() {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set')
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }
    if (!process.env.PINECONE_INDEX_NAME) {
      throw new Error('PINECONE_INDEX_NAME is not set')
    }

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })

    this.anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    this.indexName = process.env.PINECONE_INDEX_NAME

    console.log('Clients initialized:', {
      hasPinecone: !!this.pinecone,
      hasAnthropic: !!this.anthropicClient,
      indexName: this.indexName,
    })
  }

  async getEmbeddings(text: string): Promise<number[]> {
    try {
      console.log('Getting embeddings for text:', text.substring(0, 50) + '...')

      if (!this.anthropicClient) {
        throw new Error('Anthropic client not initialized')
      }

      // Create a message to embed
      const response = await this.anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: text }],
      })

      // For debugging
      console.log('Response from Anthropic:', response)

      // Get the embeddings from the response
      const embeddings = response.content[0]?.text || ''
      return embeddings.split(',').map(Number)
    } catch (error) {
      console.error('Error getting embeddings:', error)
      throw error
    }
  }

  async initializeService() {
    try {
      console.log('Initializing service with index:', this.indexName)
      const index = this.pinecone.Index(this.indexName)

      const embeddings: EmbeddingsInterface = {
        embedQuery: async (text: string) => await this.getEmbeddings(text),
        embedDocuments: async (documents: string[]) => {
          console.log(`Embedding ${documents.length} documents`)
          return await Promise.all(
            documents.map((doc) => this.getEmbeddings(doc))
          )
        },
      }

      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: 'default',
        textKey: 'text',
      })

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
      console.log('Adding project:', project.title)
      const index = this.pinecone.Index(this.indexName)

      const documentText = `
        Project Title: ${project.title}
        Description: ${project.description}
        Tags: ${project.tags.join(', ')}
      `.trim()

      console.log(
        'Created document text:',
        documentText.substring(0, 100) + '...'
      )

      const embeddings: EmbeddingsInterface = {
        embedQuery: async (text: string) => await this.getEmbeddings(text),
        embedDocuments: async (documents: string[]) => {
          console.log(`Embedding ${documents.length} documents`)
          return await Promise.all(
            documents.map((doc) => this.getEmbeddings(doc))
          )
        },
      }

      console.log('Creating vector store...')
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: 'default',
        textKey: 'text',
      })

      const document = new Document({
        pageContent: documentText,
        metadata: {
          projectId: project.id,
          title: project.title,
          tags: project.tags,
        },
      })

      console.log('Adding document to vector store...')
      await vectorStore.addDocuments([document])
      console.log('Successfully added document to vector store')

      return project.id
    } catch (error) {
      console.error('Failed to add project:', error)
      throw error
    }
  }

  async searchSimilarProjects(query: string, limit: number = 3) {
    try {
      console.log('Searching for projects with query:', query)
      const index = this.pinecone.Index(this.indexName)

      const embeddings: EmbeddingsInterface = {
        embedQuery: async (text: string) => await this.getEmbeddings(text),
        embedDocuments: async (documents: string[]) => {
          console.log(`Embedding ${documents.length} documents`)
          return await Promise.all(
            documents.map((doc) => this.getEmbeddings(doc))
          )
        },
      }

      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: 'default',
        textKey: 'text',
      })

      const results = await vectorStore.similaritySearch(query, limit)
      console.log(`Found ${results.length} similar projects`)

      return results
    } catch (error) {
      console.error('Failed to search projects:', error)
      throw error
    }
  }
}
