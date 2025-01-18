import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

export async function clearDatabase() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  try {
    // Clear admin users
    await client.mutation(api.testing.clearAdminUsers)
    console.log('Cleared admin users')

    // Clear blogs
    await client.mutation(api.testing.clearBlogs)
    console.log('Cleared blogs')

    // Clear tags
    await client.mutation(api.testing.clearTags)
    console.log('Cleared tags')

    // Clear tag associations
    await client.mutation(api.testing.clearTagAssociations)
    console.log('Cleared tag associations')
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}
