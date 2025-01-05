import { describe, it, expect, vi } from 'vitest'
import { Id } from '../../../convex/_generated/dataModel'
import { MutationCtx } from '../../../convex/_generated/server'

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = {
      create: vi.fn(),
    }
  },
}))

// Import the entire module to access the internal function
import * as claudeModule from '../../../convex/claude/generateBlogTags'

describe('Tag Generation', () => {
  const mockCtx = {
    runMutation: vi.fn(),
    runAction: vi.fn(),
    scheduler: {
      runAfter: vi.fn(),
    },
  } as unknown as MutationCtx

  const mockBlogId = 'abc123' as Id<'blogs'>
  const mockTitle = 'Test Blog'
  const mockBody = 'Test blog content'

  it('should generate tags successfully with valid response', async () => {
    const mockResponse = {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            tags: [
              {
                name: 'test',
                description: 'A test tag',
                category: 'technical',
                metadata: {
                  source: 'claude',
                  createdAt: Date.now(),
                },
              },
            ],
            associations: [
              {
                tagName: 'test',
                confidence: 0.9,
                metadata: {
                  source: 'claude',
                  createdAt: Date.now(),
                  context: 'Test context',
                },
              },
            ],
          }),
        },
      ],
    }

    // Mock the Anthropic API call
    const mockAnthropicClient = await import('@anthropic-ai/sdk')
    mockAnthropicClient.default.prototype.messages.create.mockResolvedValueOnce(
      mockResponse
    )

    // Use the internal function directly
    const result = await claudeModule.default.handler(mockCtx, {
      blogId: mockBlogId,
      title: mockTitle,
      body: mockBody,
    })

    expect(result).toBe('Tags generated and associated successfully')
  })

  it('should retry on malformed JSON response', async () => {
    const invalidResponse = {
      content: [{ type: 'text', text: 'Invalid JSON' }],
    }
    const validResponse = {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            tags: [
              {
                name: 'test',
                description: 'A test tag',
                category: 'technical',
                metadata: {
                  source: 'claude',
                  createdAt: Date.now(),
                },
              },
            ],
            associations: [
              {
                tagName: 'test',
                confidence: 0.9,
                metadata: {
                  source: 'claude',
                  createdAt: Date.now(),
                  context: 'Test context',
                },
              },
            ],
          }),
        },
      ],
    }

    // Mock the Anthropic API calls
    const mockAnthropicClient = await import('@anthropic-ai/sdk')
    mockAnthropicClient.default.prototype.messages.create
      .mockResolvedValueOnce(invalidResponse)
      .mockResolvedValueOnce(validResponse)

    // Use the internal function directly
    const result = await claudeModule.default.handler(mockCtx, {
      blogId: mockBlogId,
      title: mockTitle,
      body: mockBody,
    })

    expect(result).toBe('Tags generated and associated successfully')
  })

  it('should fail after max retries', async () => {
    const invalidResponse = {
      content: [{ type: 'text', text: 'Invalid JSON' }],
    }

    // Mock the Anthropic API calls to always return invalid JSON
    const mockAnthropicClient = await import('@anthropic-ai/sdk')
    mockAnthropicClient.default.prototype.messages.create.mockResolvedValue(
      invalidResponse
    )

    // Use the internal function directly
    await expect(
      claudeModule.default.handler(mockCtx, {
        blogId: mockBlogId,
        title: mockTitle,
        body: mockBody,
      })
    ).rejects.toThrow()
  })
})
