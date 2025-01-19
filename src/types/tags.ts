export type TagCategory = 'technical' | 'topic' | 'language' | 'general'

export interface Tag {
  name: string
  description?: string
  category: TagCategory
  metadata?: {
    source: 'claude' | 'manual'
    createdAt: number
    lastUsedAt?: number
    usageCount?: number
  }
}

export interface TagAssociation {
  tagId: string // Convex ID
  entityId: string // Convex ID
  entityType: 'blog' | 'project'
  confidence: number
  metadata?: {
    source: 'claude' | 'manual'
    createdAt: number
    context?: string
  }
}

// Response type for tag generation
export interface TagGenerationResponse {
  tags: Tag[]
  associations: Array<
    Omit<TagAssociation, 'tagId' | 'entityId'> & { tagName: string }
  >
}
