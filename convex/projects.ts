import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getAllProjects = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("Web"),
        v.literal("AI/ML"),
        v.literal("Mobile"),
        v.literal("Other"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      description: v.string(),
      techStack: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      liveUrl: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      likes: v.number(),
      stars: v.number(),
      category: v.union(
        v.literal("Web"),
        v.literal("AI/ML"),
        v.literal("Mobile"),
        v.literal("Other"),
      ),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const projects = args.category
      ? await ctx.db
          .query("projects")
          .withIndex("by_category", (q) => q.eq("category", args.category!))
          .collect()
      : await ctx.db.query("projects").collect();

    return projects.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getProjectsByUser = query({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      description: v.string(),
      techStack: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      liveUrl: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      likes: v.number(),
      stars: v.number(),
      category: v.union(
        v.literal("Web"),
        v.literal("AI/ML"),
        v.literal("Mobile"),
        v.literal("Other"),
      ),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return projects.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const hasUserLiked = query({
  args: {
    userId: v.id("users"),
    projectId: v.id("projects"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("project_likes")
      .withIndex("by_user_and_project", (q) =>
        q.eq("userId", args.userId).eq("projectId", args.projectId),
      )
      .unique();

    return like !== null;
  },
});

export const createProject = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    techStack: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    category: v.union(
      v.literal("Web"),
      v.literal("AI/ML"),
      v.literal("Mobile"),
      v.literal("Other"),
    ),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("projects", {
      ...args,
      likes: 0,
      stars: 0,
      createdAt: Date.now(),
    });
  },
});

export const toggleLike = mutation({
  args: {
    userId: v.id("users"),
    projectId: v.id("projects"),
  },
  returns: v.object({
    liked: v.boolean(),
    likes: v.number(),
  }),
  handler: async (ctx, args) => {
    const [user, project, existingLike] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.projectId),
      ctx.db
        .query("project_likes")
        .withIndex("by_user_and_project", (q) =>
          q.eq("userId", args.userId).eq("projectId", args.projectId),
        )
        .unique(),
    ]);

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (!project) {
      throw new ConvexError("Project not found");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      const likes = Math.max(0, project.likes - 1);
      await ctx.db.patch(project._id, { likes });
      return { liked: false, likes };
    }

    await ctx.db.insert("project_likes", {
      userId: args.userId,
      projectId: args.projectId,
    });
    const likes = project.likes + 1;
    await ctx.db.patch(project._id, { likes });
    return { liked: true, likes };
  },
});
