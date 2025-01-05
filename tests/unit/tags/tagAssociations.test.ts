import { describe, it, expect, vi } from 'vitest'
import {
  createAssociation,
  getTagsForBlog,
} from '../../../convex/tagAssociations'
import {
  DatabaseReader,
  DatabaseWriter,
} from '../../../convex/_generated/server'
import { Id } from '../../../convex/_generated/dataModel'

describe('Tag Associations', () => {
  const mockDb = {
    query: vi.fn(() => ({
      filter: vi.fn(() => ({
        collect: vi.fn(),
      })),
    })),
    insert: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  } as unknown as DatabaseWriter

  const mockCtx = {
    db: mockDb,
  }

  const mockTagId = 'tag123' as Id<'tags'>
  const mockBlogId = 'blog123' as Id<'blogs'>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAssociation', () => {
    it('should create a new association if none exists', async () => {
      vi.mocked(mockDb.query().filter().collect).mockResolvedValueOnce([])
      vi.mocked(mockDb.insert).mockResolvedValueOnce(
        'assoc123' as Id<'tagAssociations'>
      )

      const result = await createAssociation(mockCtx, {
        tagId: mockTagId,
        entityId: mockBlogId,
        entityType: 'blog',
        confidence: 0.9,
        metadata: {
          source: 'claude',
          createdAt: Date.now(),
          context: 'test',
        },
      })

      expect(result).toBe('assoc123')
      expect(mockDb.insert).toHaveBeenCalledTimes(1)
      expect(mockDb.patch).not.toHaveBeenCalled()
    })

    it('should update existing association if one exists', async () => {
      const existingAssoc = {
        _id: 'assoc123' as Id<'tagAssociations'>,
        tagId: mockTagId,
        entityId: mockBlogId,
        entityType: 'blog',
        confidence: 0.8,
        metadata: {
          source: 'claude',
          createdAt: Date.now() - 1000,
          context: 'old test',
        },
      }

      vi.mocked(mockDb.query().filter().collect).mockResolvedValueOnce([
        existingAssoc,
      ])

      const newMetadata = {
        source: 'claude' as const,
        createdAt: Date.now(),
        context: 'updated test',
      }

      const result = await createAssociation(mockCtx, {
        tagId: mockTagId,
        entityId: mockBlogId,
        entityType: 'blog',
        confidence: 0.9,
        metadata: newMetadata,
      })

      expect(result).toBe('assoc123')
      expect(mockDb.insert).not.toHaveBeenCalled()
      expect(mockDb.patch).toHaveBeenCalledWith('assoc123', {
        confidence: 0.9,
        metadata: newMetadata,
      })
    })
  })

  describe('getTagsForBlog', () => {
    it('should return empty array when no tags exist', async () => {
      vi.mocked(mockDb.query().filter().collect).mockResolvedValueOnce([])

      const result = await getTagsForBlog(
        { db: mockDb as DatabaseReader },
        { blogId: mockBlogId }
      )
      expect(result).toEqual([])
    })

    it('should return tags with confidence scores', async () => {
      const mockAssociations = [
        {
          _id: 'assoc1' as Id<'tagAssociations'>,
          tagId: 'tag1' as Id<'tags'>,
          confidence: 0.9,
        },
      ]

      const mockTag = {
        _id: 'tag1' as Id<'tags'>,
        name: 'Test Tag',
        category: 'technical',
      }

      vi.mocked(mockDb.query().filter().collect).mockResolvedValueOnce(
        mockAssociations
      )
      vi.mocked(mockDb.get).mockResolvedValueOnce(mockTag)

      const result = await getTagsForBlog(
        { db: mockDb as DatabaseReader },
        { blogId: mockBlogId }
      )
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        ...mockTag,
        confidence: 0.9,
      })
    })
  })
})
