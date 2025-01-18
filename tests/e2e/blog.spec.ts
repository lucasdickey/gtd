import { test, expect } from '@playwright/test'

test('Blog Tag Generation: should generate tags when publishing a blog post', async ({
  page,
}) => {
  // Enable console logging
  page.on('console', (msg) => console.log(msg.text()))

  // Navigate to login page
  await page.goto('http://localhost:3000/admin/login')
  console.log('Navigated to login page')

  // Wait for login form to be visible
  await expect(page.getByText('Admin Login')).toBeVisible({ timeout: 10000 })
  console.log('Login form is visible')

  // Fill in login details
  const email = process.env.ADMIN_EMAIL || 'test@example.com'
  const password = process.env.ADMIN_PASSWORD || 'test123'
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  console.log('Filled in login details')

  // Submit form
  await page.click('button[type="submit"]')
  console.log('Submitted login form')

  // Wait for either error message or admin page
  try {
    const errorLocator = page.getByText('Invalid email or password')
    const hasError = await errorLocator.isVisible({ timeout: 5000 })
    if (hasError) {
      throw new Error('Login failed: Invalid email or password')
    }
  } catch (error: any) {
    if (error?.message === 'Login failed: Invalid email or password') {
      throw error
    }
    // No error message found, continue to check for admin page
    console.log('No error message found, checking for admin page')
  }

  // Wait for admin page content to be visible
  await expect(page.getByText('Manage Blogs')).toBeVisible({ timeout: 10000 })
  console.log('Admin page content is visible')

  // Fill in blog details
  const title = 'Test Blog for Tag Generation'
  await page.fill('input[type="text"]', title)
  await page.fill('textarea', 'This is a test blog post for tag generation.')
  await page.check('input[type="checkbox"]')
  console.log('Filled in blog details')

  // Submit the form
  await page.click('button[type="submit"]')
  console.log('Submitted blog form')

  // Wait for success message
  await expect(page.getByText('Blog saved successfully')).toBeVisible({
    timeout: 10000,
  })
  console.log('Blog saved successfully')

  // Wait for tags to be generated
  await expect(page.getByText('Tags:')).toBeVisible({ timeout: 90000 })
  console.log('Tags generated successfully')
})
