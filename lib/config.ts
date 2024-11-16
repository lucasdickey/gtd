export const PINECONE_CONFIG = {
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
  indexName: process.env.PINECONE_INDEX_NAME!,
}

export const ANTHROPIC_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY!,
  modelName: 'claude-3.5-haiku-20240307',
}
