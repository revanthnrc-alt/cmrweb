import { ConvexError, v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

export const RANK_THRESHOLDS = {
  Newbie: 0,
  Learner: 500,
  Builder: 1500,
  Expert: 3000,
  Elite: 6000,
  Legend: 10000,
} as const;

export type RankName = keyof typeof RANK_THRESHOLDS;
export type UserRole = "member" | "admin";
export type UserDomain = "Web" | "Full-Stack" | "AI/ML" | "Mobile" | "DevOps" | "Design";

const rankOrder = Object.entries(RANK_THRESHOLDS) as [RankName, number][];

export function computeRank(xp: number): RankName {
  let currentRank: RankName = "Newbie";
  for (const [rank, threshold] of rankOrder) {
    if (xp >= threshold) {
      currentRank = rank;
    }
  }
  return currentRank;
}

async function getUserByWorkosIdentity(
  ctx: QueryCtx | MutationCtx,
  workosId: string,
) {
  return await ctx.db
    .query("users")
    .withIndex("by_workos_id", (q) => q.eq("workosId", workosId))
    .unique();
}

async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }

  const adminUser =
    (await getUserByWorkosIdentity(ctx, identity.subject)) ??
    (identity.tokenIdentifier
      ? await getUserByWorkosIdentity(ctx, identity.tokenIdentifier)
      : null);

  if (!adminUser || adminUser.role !== "admin") {
    throw new ConvexError("Admin access required");
  }

  return adminUser;
}

export const getUserByWorkosId = query({
  args: { workosId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      workosId: v.string(),
      email: v.string(),
      name: v.string(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      bio: v.optional(v.string()),
      role: v.union(v.literal("member"), v.literal("admin")),
      rank: v.union(
        v.literal("Newbie"),
        v.literal("Learner"),
        v.literal("Builder"),
        v.literal("Expert"),
        v.literal("Elite"),
        v.literal("Legend"),
      ),
      xp: v.number(),
      streakCount: v.number(),
      lastActiveDate: v.optional(v.string()),
      domain: v.optional(
        v.union(
          v.literal("Web"),
          v.literal("Full-Stack"),
          v.literal("AI/ML"),
          v.literal("Mobile"),
          v.literal("DevOps"),
          v.literal("Design"),
        ),
      ),
      skills: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await getUserByWorkosIdentity(ctx, args.workosId);
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      workosId: v.string(),
      email: v.string(),
      name: v.string(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      bio: v.optional(v.string()),
      role: v.union(v.literal("member"), v.literal("admin")),
      rank: v.union(
        v.literal("Newbie"),
        v.literal("Learner"),
        v.literal("Builder"),
        v.literal("Expert"),
        v.literal("Elite"),
        v.literal("Legend"),
      ),
      xp: v.number(),
      streakCount: v.number(),
      lastActiveDate: v.optional(v.string()),
      domain: v.optional(
        v.union(
          v.literal("Web"),
          v.literal("Full-Stack"),
          v.literal("AI/ML"),
          v.literal("Mobile"),
          v.literal("DevOps"),
          v.literal("Design"),
        ),
      ),
      skills: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      workosId: v.string(),
      email: v.string(),
      name: v.string(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      bio: v.optional(v.string()),
      role: v.union(v.literal("member"), v.literal("admin")),
      rank: v.union(
        v.literal("Newbie"),
        v.literal("Learner"),
        v.literal("Builder"),
        v.literal("Expert"),
        v.literal("Elite"),
        v.literal("Legend"),
      ),
      xp: v.number(),
      streakCount: v.number(),
      lastActiveDate: v.optional(v.string()),
      domain: v.optional(
        v.union(
          v.literal("Web"),
          v.literal("Full-Stack"),
          v.literal("AI/ML"),
          v.literal("Mobile"),
          v.literal("DevOps"),
          v.literal("Design"),
        ),
      ),
      skills: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
  },
});

export const getAllUsers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      workosId: v.string(),
      email: v.string(),
      name: v.string(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      bio: v.optional(v.string()),
      role: v.union(v.literal("member"), v.literal("admin")),
      rank: v.union(
        v.literal("Newbie"),
        v.literal("Learner"),
        v.literal("Builder"),
        v.literal("Expert"),
        v.literal("Elite"),
        v.literal("Legend"),
      ),
      xp: v.number(),
      streakCount: v.number(),
      lastActiveDate: v.optional(v.string()),
      domain: v.optional(
        v.union(
          v.literal("Web"),
          v.literal("Full-Stack"),
          v.literal("AI/ML"),
          v.literal("Mobile"),
          v.literal("DevOps"),
          v.literal("Design"),
        ),
      ),
      skills: v.array(v.string()),
      githubUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.sort((a, b) => b.xp - a.xp);
  },
});

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      username: v.string(),
      avatarUrl: v.optional(v.string()),
      rank: v.union(
        v.literal("Newbie"),
        v.literal("Learner"),
        v.literal("Builder"),
        v.literal("Expert"),
        v.literal("Elite"),
        v.literal("Legend"),
      ),
      xp: v.number(),
      streakCount: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users
      .sort((a, b) => b.xp - a.xp)
      .slice(0, args.limit ?? 10)
      .map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        rank: user.rank,
        xp: user.xp,
        streakCount: user.streakCount,
      }));
  },
});

export const createUser = mutation({
  args: {
    workosId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const existingByWorkosId = await getUserByWorkosIdentity(ctx, args.workosId);
    if (existingByWorkosId) {
      throw new ConvexError("User already exists for this WorkOS account");
    }

    const existingByUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
    if (existingByUsername) {
      throw new ConvexError("Username is already taken");
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      workosId: args.workosId,
      email: args.email,
      name: args.name,
      username: args.username,
      role: "member",
      rank: "Newbie",
      xp: 0,
      streakCount: 0,
      skills: [],
      createdAt: now,
    });

    await ctx.db.insert("audit_log", {
      adminId: userId,
      adminName: args.name,
      action: "USER_CREATED",
      targetId: String(userId),
      targetName: args.name,
      details: `Created user ${args.username}`,
      createdAt: now,
    });

    return userId;
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    bio: v.optional(v.string()),
    domain: v.optional(
      v.union(
        v.literal("Web"),
        v.literal("Full-Stack"),
        v.literal("AI/ML"),
        v.literal("Mobile"),
        v.literal("DevOps"),
        v.literal("Design"),
      ),
    ),
    skills: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.get(args.userId);
    if (!existingUser) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(args.userId, {
      bio: args.bio,
      domain: args.domain,
      skills: args.skills,
      githubUrl: args.githubUrl,
      linkedinUrl: args.linkedinUrl,
      avatarUrl: args.avatarUrl,
    });

    return null;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("member"), v.literal("admin")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx);
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new ConvexError("Target user not found");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    await ctx.db.insert("audit_log", {
      adminId: adminUser._id,
      adminName: adminUser.name,
      action: "ROLE_CHANGED",
      targetId: String(targetUser._id),
      targetName: targetUser.name,
      details: `Changed role from ${targetUser.role} to ${args.role}`,
      createdAt: Date.now(),
    });

    return null;
  },
});
