import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .collect();
    return projects[0] || null;
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    slug: v.string(),
    content: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      ...args,
    });
    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    slug: v.string(),
    content: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const deleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
}); 