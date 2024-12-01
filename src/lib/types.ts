import { Id } from '../../convex/_generated/dataModel'

export interface Blog {
  _id: Id<'blogs'>
  _creationTime: number
  title: string
  body: string
  author?: string
  slug: string
  publishedAt?: number
  // Temporary fields during migration
  publishDate?: number
  updateDate?: number
  isPublished?: boolean
}
