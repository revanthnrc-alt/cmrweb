import { ConvexError, v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

async function getUserByWorkosId(ctx: QueryCtx | MutationCtx, workosId: string) {
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
    (await getUserByWorkosId(ctx, identity.subject)) ??
    (identity.tokenIdentifier
      ? await getUserByWorkosId(ctx, identity.tokenIdentifier)
      : null);

  if (!adminUser || adminUser.role !== "admin") {
    throw new ConvexError("Admin access required");
  }

  return adminUser;
}

export const getAllChallenges = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("challenges"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      category: v.union(
        v.literal("UI/UX"),
        v.literal("Full-Stack"),
        v.literal("Backend"),
        v.literal("Algorithms"),
        v.literal("AI/ML"),
      ),
      difficulty: v.union(
        v.literal("Easy"),
        v.literal("Medium"),
        v.literal("Hard"),
      ),
      xpReward: v.number(),
      timeLimitDays: v.number(),
      requirements: v.array(v.string()),
      resources: v.array(v.string()),
      isActive: v.boolean(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const challenges = await ctx.db
      .query("challenges")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .collect();

    return challenges.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getChallengeById = query({
  args: { challengeId: v.id("challenges") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("challenges"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      category: v.union(
        v.literal("UI/UX"),
        v.literal("Full-Stack"),
        v.literal("Backend"),
        v.literal("Algorithms"),
        v.literal("AI/ML"),
      ),
      difficulty: v.union(
        v.literal("Easy"),
        v.literal("Medium"),
        v.literal("Hard"),
      ),
      xpReward: v.number(),
      timeLimitDays: v.number(),
      requirements: v.array(v.string()),
      resources: v.array(v.string()),
      isActive: v.boolean(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.challengeId);
  },
});

export const getChallengeLeaderboard = query({
  args: { challengeId: v.id("challenges") },
  returns: v.array(
    v.object({
      submissionId: v.id("submissions"),
      score: v.number(),
      autoScore: v.optional(v.number()),
      submittedAt: v.number(),
      user: v.object({
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
      }),
    }),
  ),
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .collect();

    const approvedSubmissions = submissions.filter(
      (submission) => submission.status === "approved" && submission.score !== undefined,
    );

    const leaderboardRows = await Promise.all(
      approvedSubmissions.map(async (submission) => {
        const user = await ctx.db.get(submission.userId);
        if (!user || submission.score === undefined) {
          return null;
        }

        return {
          submissionId: submission._id,
          score: submission.score,
          autoScore: submission.autoScore,
          submittedAt: submission.submittedAt,
          user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            rank: user.rank,
            xp: user.xp,
          },
        };
      }),
    );

    return leaderboardRows
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.score - a.score);
  },
});

export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("UI/UX"),
      v.literal("Full-Stack"),
      v.literal("Backend"),
      v.literal("Algorithms"),
      v.literal("AI/ML"),
    ),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard"),
    ),
    xpReward: v.number(),
    timeLimitDays: v.number(),
    requirements: v.array(v.string()),
    resources: v.array(v.string()),
  },
  returns: v.id("challenges"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("challenges", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});
