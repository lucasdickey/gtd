// scripts/test-embeddings.ts
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { ProjectEmbeddingsService } from '../lib/embeddings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testEmbeddings() {
  try {
    console.log('🔍 Testing embeddings service...\n')

    // Load environment variables
    const envPath = join(process.cwd(), '.env.local')
    dotenv.config({ path: envPath })

    console.log('Checking environment variables:')
    console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? '✓' : '✗')
    console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✓' : '✗')
    console.log(
      'PINECONE_INDEX_NAME:',
      process.env.PINECONE_INDEX_NAME ? '✓' : '✗'
    )

    // Initialize service
    console.log('\nInitializing embeddings service...')
    const embeddingsService = new ProjectEmbeddingsService()
    await embeddingsService.initializeService()
    console.log('✓ Service initialized')

    // Test project
    const testProject = {
      id: 'test-project-1',
      title: 'Test Project',
      description: 'This is a test project for embeddings verification',
      tags: ['test', 'embeddings', 'verification'],
    }

    // Add test project
    console.log('\nAdding test project...')
    const projectId = await embeddingsService.addProject(testProject)
    console.log('✓ Successfully added test project with ID:', projectId)

    // Search for similar projects
    console.log('\nSearching for similar projects...')
    const results = await embeddingsService.searchSimilarProjects(
      'test project embeddings'
    )
    console.log('✓ Successfully searched for projects')
    console.log('Search results:', results)

    console.log('\n✅ All embeddings tests passed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Embeddings test failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run the test
testEmbeddings()
