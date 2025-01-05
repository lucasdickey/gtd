import { describe, it, expect, vi } from 'vitest'
import { generateTagsWithRetry } from '../../../convex/claude'
import { MutationCtx } from '../../../convex/_generated/server'
import { Id } from '../../../convex/_generated/dataModel'

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = {
      create: vi.fn(),
    }
  },
}))

describe('Tag Generation', () => {
  const mockCtx = {
    runMutation: vi.fn(),
    runAction: vi.fn(),
  } as unknown as MutationCtx

  const mockBlogId = 'abc123' as Id<'blogs'>
  const mockTitle = 'Test Blog'
  const mockBody = 'Test blog content'

  it('should generate tags successfully with valid response', async () => {
    const mockResponse = {
      content: [
        {
          text: JSON.stringify({
            tags: [
              {
                name: 'test',
                category: 'technical',
                confidence: 0.9,
                description: 'A test tag',
              },
            ],
          }),
        },
      ],
    }

    vi.mocked(mockCtx.runAction).mockResolvedValueOnce(mockResponse)

    const result = await generateTagsWithRetry(
      mockCtx,
      mockBlogId,
      mockTitle,
      mockBody
    )
    expect(result).toBeDefined()
    expect(result.tags).toHaveLength(1)
    expect(result.tags[0].name).toBe('test')
  })

  it('should retry on malformed JSON response', async () => {
    const invalidResponse = {
      content: [{ text: 'Invalid JSON' }],
    }
    const validResponse = {
      content: [
        {
          text: JSON.stringify({
            tags: [
              {
                name: 'test',
                category: 'technical',
                confidence: 0.9,
                description: 'A test tag',
              },
            ],
          }),
        },
      ],
    }

    vi.mocked(mockCtx.runAction)
      .mockResolvedValueOnce(invalidResponse)
      .mockResolvedValueOnce(validResponse)

    const result = await generateTagsWithRetry(
      mockCtx,
      mockBlogId,
      mockTitle,
      mockBody
    )
    expect(result).toBeDefined()
    expect(mockCtx.runAction).toHaveBeenCalledTimes(2)
  })

  it('should fail after max retries', async () => {
    const invalidResponse = {
      content: [{ text: 'Invalid JSON' }],
    }

    vi.mocked(mockCtx.runAction).mockResolvedValue(invalidResponse)

    await expect(
      generateTagsWithRetry(mockCtx, mockBlogId, mockTitle, mockBody)
    ).rejects.toThrow()
    expect(mockCtx.runAction).toHaveBeenCalledTimes(5) // Max retries
  })
})
