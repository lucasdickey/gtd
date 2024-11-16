// scripts/check-env.ts
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const requiredEnvVars = [
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'PINECONE_INDEX_NAME',
  'ANTHROPIC_API_KEY',
]

console.log('Checking environment variables:')
const missingVars = []

for (const envVar of requiredEnvVars) {
  const exists = process.env[envVar] ? '✓' : '✗'
  console.log(`${envVar}: ${exists}`)

  if (!process.env[envVar]) {
    missingVars.push(envVar)
  }
}

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:')
  missingVars.forEach((v) => console.error(`  - ${v}`))
  console.error('\nPlease add these to your .env.local file')
  process.exit(1)
} else {
  console.log('\n✅ All required environment variables are set')
}
