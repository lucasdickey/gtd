import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

export async function clearDatabase() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  try {
    // Clear admin users
    await client.mutation(api.testing.clearAdminUsers, { isTest: true })
    console.log('Cleared admin users')

    // Clear blogs
    await client.mutation(api.testing.clearBlogs, { isTest: true })
    console.log('Cleared blogs')

    // Clear tags
    await client.mutation(api.testing.clearTags, { isTest: true })
    console.log('Cleared tags')

    // Clear tag associations
    await client.mutation(api.testing.clearTagAssociations, { isTest: true })
    console.log('Cleared tag associations')
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}
