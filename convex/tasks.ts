import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * LIST QUERY
 * This query retrieves all tasks from the database.
 * Queries are read-only operations that can be subscribed to from the client.
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('tasks').order('desc').collect()
  },
})

/**
 * CREATE MUTATION
 * This mutation adds a new task to the database.
 * Mutations are write operations that modify the database.
 */
export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tasks', {
      title: args.title,
      completed: false,
      createdAt: Date.now(),
    })
  },
})

/**
 * UPDATE MUTATION
 * This mutation modifies an existing task.
 * Currently used to toggle the completion status.
 */
export const update = mutation({
  args: {
    id: v.id('tasks'),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { completed: args.completed })
  },
})

/**
 * DELETE MUTATION
 * This mutation removes a task from the database.
 */
export const remove = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

/**
 * Usage examples from the client:
 *
 * // To fetch tasks:
 * const tasks = useQuery(api.tasks.list)
 *
 * // To create a task:
 * const mutation = useMutation(api.tasks.create)
 * await mutation({ title: "New task" })
 *
 * // To update a task:
 * const mutation = useMutation(api.tasks.update)
 * await mutation({ id: taskId, completed: true })
 *
 * // To delete a task:
 * const mutation = useMutation(api.tasks.remove)
 * await mutation({ id: taskId })
 */
