import { test, expect } from '@playwright/test'

test('Blog Tag Generation: should generate tags when publishing a blog post', async ({
  page,
}) => {
  // Login first
  await page.goto('/admin/login')
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || '')
  await page.click('button[type="submit"]')

  // Navigate to blog creation
  await page.goto('/admin/blogs')
  await page.click('button:has-text("Create Blog")')

  // Fill in blog details
  const title = 'Test Blog for Tag Generation'
  const body = `
    This is a test blog post about implementing AI-powered tag generation using Claude.
    We'll discuss technical aspects of the implementation, including:
    - Integration with Anthropic's Claude API
    - Error handling and retries
    - Tag storage and associations
    - TypeScript type safety
  `

  await page.fill('input[name="title"]', title)
  await page.fill('textarea[name="body"]', body)
  await page.check('input[name="isPublished"]')

  // Submit the form
  await page.click('button:has-text("Create Blog")')

  // Wait for success message
  await expect(page.getByText('Blog created successfully')).toBeVisible()

  // Navigate to the blog page
  await page.goto('/blog')

  // Find the blog post
  const blogPost = page.getByText(title)
  await expect(blogPost).toBeVisible()

  // Check for generated tags
  const tags = page.locator('.inline-flex.items-center.rounded-full')
  const tagCount = await tags.count()
  expect(tagCount).toBeGreaterThan(0)

  // Verify tag content
  await expect(tags).toContainText(['technical', 'AI', 'implementation'])
})
