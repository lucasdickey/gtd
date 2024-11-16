// scripts/verify.mts
import * as dotenv from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function verifySetup() {
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
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }

  // Verify Pinecone connection
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
    console.error('\n❌ Pinecone verification failed:', error)
    throw error
  }

  console.log('\n✅ All setup verifications passed successfully!')
}

// Run verification
verifySetup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Setup verification failed:', error)
    process.exit(1)
  })
