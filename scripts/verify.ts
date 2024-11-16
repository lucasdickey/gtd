// scripts/verify-setup.ts
import * as dotenv from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone'
import { ProjectEmbeddingsService } from '../lib/embeddings'
import { checkFileExists, readFileContents } from '../lib/fileUtils'
import path from 'path'

async function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')

  if (await checkFileExists(envPath)) {
    dotenv.config({ path: envPath })
  } else {
    console.warn('Warning: .env.local file not found')
  }
}

async function verifySetup() {
  console.log('🔍 Starting setup verification...\n')

  // 1. Load environment variables
  await loadEnvFile()

  // 2. Check environment variables
  console.log('Checking environment variables:')
  const requiredEnvVars = [
    'PINECONE_API_KEY',
    'PINECONE_ENVIRONMENT',
    'PINECONE_INDEX_NAME',
    'ANTHROPIC_API_KEY',
  ]

  const missingVars = []
  for (const envVar of requiredEnvVars) {
    const exists = process.env[envVar] ? '✓' : '✗'
    console.log(`${envVar}: ${exists}`)
    if (!process.env[envVar]) missingVars.push(envVar)
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }

  // 3. Verify Pinecone connection
  console.log('\nVerifying Pinecone connection...')
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  })

  try {
    const indexes = await pinecone.listIndexes()
    console.log('✓ Successfully connected to Pinecone')
    console.log(`✓ Available indexes: ${indexes.join(', ')}`)
  } catch (error) {
    throw new Error(`Failed to connect to Pinecone: ${error}`)
  }

  // 4. Test embeddings service
  console.log('\nTesting embeddings service...')
  const embeddingsService = new ProjectEmbeddingsService()

  try {
    await embeddingsService.initializeIndex()
    console.log('✓ Successfully initialized index')

    // Test project
    const testProject = {
      id: 'test-setup',
      title: 'Setup Test Project',
      description: 'This is a test project for setup verification',
      tags: ['test', 'setup'],
    }

    // Add test project
    await embeddingsService.addProject(testProject)
    console.log('✓ Successfully added test project')

    // Search for test project
    const results = await embeddingsService.searchSimilarProjects('setup test')
    console.log('✓ Successfully searched for projects')

    // Clean up
    await embeddingsService.deleteProject(testProject.id)
    console.log('✓ Successfully cleaned up test project')
  } catch (error) {
    throw new Error(`Failed to test embeddings service: ${error}`)
  }

  console.log('\n✅ All setup verifications passed successfully!')
}

// Run verification if this script is executed directly
if (require.main === module) {
  verifySetup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ Setup verification failed:', error)
      process.exit(1)
    })
}
