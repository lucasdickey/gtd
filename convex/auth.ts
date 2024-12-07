import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { ConvexError } from 'convex/values'

// Helper to hash passwords using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Helper to generate session token using Web Crypto API
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const { email, password } = args

    const user = await ctx.db
      .query('adminUsers')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first()

    if (!user || user.passwordHash !== (await hashPassword(password))) {
      throw new ConvexError('Invalid email or password')
    }

    // Generate session
    const sessionToken = generateSessionToken()
    const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    // Update user with session info
    await ctx.db.patch(user._id, {
      sessionToken,
      sessionExpiresAt,
      lastLoginAt: Date.now(),
    })

    return { sessionToken, sessionExpiresAt }
  },
})

export const validateSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('adminUsers')
      .filter((q) => q.eq(q.field('sessionToken'), args.sessionToken))
      .first()

    if (!user || !user.sessionExpiresAt || user.sessionExpiresAt < Date.now()) {
      return false
    }

    return true
  },
})

// One-time setup mutation to create initial admin user
export const setupInitialAdmin = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const existingUsers = await ctx.db.query('adminUsers').collect()

    if (existingUsers.length > 0) {
      throw new ConvexError('Initial admin already exists')
    }

    await ctx.db.insert('adminUsers', {
      email: args.email,
      passwordHash: await hashPassword(args.password),
    })
  },
})
