import { ProjectEmbeddingsService } from './embeddings'
import { PINECONE_CONFIG } from './config'

let embeddingsService: ProjectEmbeddingsService | null = null

export async function initializeServices() {
  if (!PINECONE_CONFIG.apiKey) {
    throw new Error('Pinecone API key is not configured')
  }

  if (!embeddingsService) {
    embeddingsService = new ProjectEmbeddingsService()
    await embeddingsService.initializeIndex()
  }

  return {
    embeddings: embeddingsService,
  }
}
