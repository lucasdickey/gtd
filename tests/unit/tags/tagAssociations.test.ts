import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createAssociation,
  getTagsForBlog,
} from '../../../convex/tagAssociations'
import {
  DatabaseReader,
  DatabaseWriter,
  MutationCtx,
  QueryCtx,
} from '../../../convex/_generated/server'
import { Id } from '../../../convex/_generated/dataModel'

describe('Tag Associations', () => {
  const mockDb = {
    query: vi.fn().mockReturnValue({
      filter: vi.fn().mockReturnValue({
        collect: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve('assoc123' as Id<'tagAssociations'>)
      ),
    patch: vi.fn().mockImplementation(() => Promise.resolve()),
    get: vi.fn().mockImplementation(() => Promise.resolve(null)),
  } as unknown as DatabaseWriter

  const mockCtx = {
    db: mockDb,
    auth: {},
    storage: {},
    scheduler: {
      runAfter: vi.fn(),
    },
    runQuery: vi.fn(),
    runMutation: vi.fn(),
  } as unknown as MutationCtx

  const mockQueryCtx = {
    db: mockDb as DatabaseReader,
    auth: {},
    storage: {},
    runQuery: vi.fn(),
  } as unknown as QueryCtx

  const mockTagId = 'tag123' as Id<'tags'>
  const mockBlogId = 'blog123' as Id<'blogs'>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAssociation', () => {
    it('should create a new association if none exists', async () => {
      const mockCollect = vi.fn().mockResolvedValueOnce([])
      mockDb.query = vi.fn().mockReturnValue({
        filter: vi.fn().mockReturnValue({
          collect: mockCollect,
        }),
      })
      mockDb.insert.mockImplementationOnce(() =>
        Promise.resolve('assoc123' as Id<'tagAssociations'>)
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

      const mockCollect = vi.fn().mockResolvedValueOnce([existingAssoc])
      mockDb.query = vi.fn().mockReturnValue({
        filter: vi.fn().mockReturnValue({
          collect: mockCollect,
        }),
      })

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
      const mockCollect = vi.fn().mockResolvedValueOnce([])
      mockDb.query = vi.fn().mockReturnValue({
        filter: vi.fn().mockReturnValue({
          collect: mockCollect,
        }),
      })

      const result = await getTagsForBlog(mockQueryCtx, { blogId: mockBlogId })
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

      const mockCollect = vi.fn().mockResolvedValueOnce(mockAssociations)
      mockDb.query = vi.fn().mockReturnValue({
        filter: vi.fn().mockReturnValue({
          collect: mockCollect,
        }),
      })
      mockDb.get.mockImplementationOnce(() => Promise.resolve(mockTag))

      const result = await getTagsForBlog(mockQueryCtx, { blogId: mockBlogId })
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        ...mockTag,
        confidence: 0.9,
      })
    })
  })
})
