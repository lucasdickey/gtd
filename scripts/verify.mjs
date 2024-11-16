import dotenv from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function verifySetup() {
  try {
    console.log('🔍 Starting setup verification...\n')

    // Load environment variables
    const envPath = join(process.cwd(), '.env.local')
    dotenv.config({ path: envPath })

    // Check environment variables
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
      throw new Error(
        `Missing environment variables: ${missingVars.join(', ')}`
      )
    }

    // Verify Pinecone connection
    console.log('\nVerifying Pinecone connection...')
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? '',
    })

    const response = await pinecone.listIndexes()
    const indexes = response.indexes
    console.log('✓ Successfully connected to Pinecone')
    console.log('Indexes response:', response)

    // Check if indexes is an array and handle accordingly
    if (Array.isArray(indexes)) {
      console.log(
        `✓ Available indexes: ${indexes.map((index) => index.name).join(', ')}`
      )
    } else {
      console.error(
        '❌ Expected indexes to be an array, but got:',
        typeof indexes
      )
    }

    const indexName = process.env.PINECONE_INDEX_NAME ?? ''
    if (
      !Array.isArray(indexes) ||
      !indexes.some((index) => index.name === indexName)
    ) {
      console.log(`\nCreating new index: ${indexName}`)
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        metric: 'cosine',
        pods: {
          type: 'p1',
          count: 1,
        },
      })
      console.log('✓ Successfully created new index')
    } else {
      console.log(`✓ Index '${indexName}' already exists`)
    }

    console.log('\n✅ All setup verifications passed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Setup verification failed:', error)
    process.exit(1)
  }
}

// Execute the verification
verifySetup()