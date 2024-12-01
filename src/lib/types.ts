import { Id } from '../../convex/_generated/dataModel'

export type Blog = {
  _id: Id<'blogs'>
  _creationTime: number
  title: string
  body: string
  slug: string
  // Support both old and new fields during transition
  publishedAt?: number
  publishDate?: number
  updateDate?: number
  author?: string
  isPublished?: boolean
}
