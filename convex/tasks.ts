import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all tasks
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Create a new task
export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      title: args.title,
      createdAt: Date.now(),
    });
  },
});
