import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response('Missing email or password', { status: 400 })
    }

    await client.mutation(api.auth.setupInitialAdmin, { email, password })
    return new Response('Admin user created', { status: 200 })
  } catch (error) {
    // If admin already exists, that's fine
    if (
      error instanceof Error &&
      error.message.includes('Initial admin already exists')
    ) {
      return new Response('Admin user already exists', { status: 200 })
    }

    console.error('Error setting up admin:', error)
    return new Response('Error setting up admin', { status: 500 })
  }
}
