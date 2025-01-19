import { describe, it, expect, vi } from 'vitest'
import { Id } from '../../../convex/_generated/dataModel'
import { ActionCtx } from '../../../convex/_generated/server'
import generateBlogTags from '../../../convex/claude/generateBlogTags'

// Simple mock of Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: vi.fn().mockResolvedValue({
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
      }),
    }
  },
}))

describe('Tag Generation', () => {
  const mockCtx = {
    runMutation: vi.fn().mockResolvedValue('success'),
    runAction: vi.fn(),
    runQuery: vi.fn(),
    scheduler: {
      runAfter: vi.fn(),
    },
    auth: {},
    storage: {},
  } as unknown as ActionCtx

  it('should generate and store tags for a blog post', async () => {
    const result = await generateBlogTags(mockCtx, {
      blogId: 'test123' as Id<'blogs'>,
      title: 'Test Blog',
      body: 'Test content',
    })

    expect(result).toBe('Tags generated and associated successfully')
    expect(mockCtx.runMutation).toHaveBeenCalled()
  })
})
