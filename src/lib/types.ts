import { Id } from '../../convex/_generated/dataModel'

export type Blog = {
  _id: Id<'blogs'>
  _creationTime: number
  title: string
  body: string
  slug: string
  author?: string
  publishedAt?: number
  publishDate?: number
  updateDate?: number
  isPublished?: boolean
}
