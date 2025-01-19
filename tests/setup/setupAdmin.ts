import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

export async function setupAdmin(email: string, password: string) {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  try {
    await client.mutation(api.auth.setupInitialAdmin, { email, password })
    console.log('Admin user created successfully')
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Initial admin already exists')
    ) {
      console.log('Admin user already exists')
      return
    }
    console.error('Error creating admin user:', error)
    throw error
  }
}
