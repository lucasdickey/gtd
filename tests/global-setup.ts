import { chromium, FullConfig } from '@playwright/test'
import { setupAdmin } from './setup/setupAdmin'
import { clearDatabase } from './setup/clearDatabase'

async function globalSetup(config: FullConfig) {
  // Clear database first
  try {
    console.log('Clearing database...')
    await clearDatabase()
    console.log('Database cleared')

    // Wait a moment for changes to propagate
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create admin user
    console.log('Creating admin user...')
    await setupAdmin(
      process.env.ADMIN_EMAIL || 'test@example.com',
      process.env.ADMIN_PASSWORD || 'test123'
    )
    console.log('Admin user created')

    // Wait a moment for changes to propagate
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error in global setup:', error)
    throw error // Re-throw to fail the setup
  }
}

export default globalSetup
