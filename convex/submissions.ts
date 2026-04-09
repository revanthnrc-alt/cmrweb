import { ConvexError, v } from "convex/values";

import { api, internal } from "./_generated/api";
import {
  action,
  internalMutation,
  mutation,
  query,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { computeRank } from "./users";

function formatDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function getDayDiff(previousDateKey: string, currentDateKey: string) {
  const previous = new Date(`${previousDateKey}T00:00:00.000Z`).getTime();
  const current = new Date(`${currentDateKey}T00:00:00.000Z`).getTime();
  return Math.round((current - previous) / 86_400_000);
}

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

export const getSubmissionsByUser = query({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      submission: v.object({
        _id: v.id("submissions"),
        _creationTime: v.number(),
        userId: v.id("users"),
        challengeId: v.id("challenges"),
        githubUrl: v.string(),
        liveUrl: v.string(),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        status: v.union(
          v.literal("pending"),
          v.literal("approved"),
          v.literal("rejected"),
        ),
        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id("users")),
        autoScore: v.optional(v.number()),
      }),
      challenge: v.union(
        v.null(),
        v.object({
          _id: v.id("challenges"),
          title: v.string(),
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
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const joined = await Promise.all(
      submissions.map(async (submission) => {
        const challenge = await ctx.db.get(submission.challengeId);
        return {
          submission,
          challenge: challenge
            ? {
                _id: challenge._id,
                title: challenge.title,
                category: challenge.category,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
              }
            : null,
        };
      }),
    );

    return joined.sort(
      (a, b) => b.submission.submittedAt - a.submission.submittedAt,
    );
  },
});

export const getSubmissionsByChallenge = query({
  args: { challengeId: v.id("challenges") },
  returns: v.array(
    v.object({
      submission: v.object({
        _id: v.id("submissions"),
        _creationTime: v.number(),
        userId: v.id("users"),
        challengeId: v.id("challenges"),
        githubUrl: v.string(),
        liveUrl: v.string(),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        status: v.union(
          v.literal("pending"),
          v.literal("approved"),
          v.literal("rejected"),
        ),
        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id("users")),
        autoScore: v.optional(v.number()),
      }),
      user: v.union(
        v.null(),
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
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_challenge", (q) => q.eq("challengeId", args.challengeId))
      .collect();

    const joined = await Promise.all(
      submissions.map(async (submission) => {
        const user = await ctx.db.get(submission.userId);
        return {
          submission,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                rank: user.rank,
                xp: user.xp,
              }
            : null,
        };
      }),
    );

    return joined.sort(
      (a, b) => b.submission.submittedAt - a.submission.submittedAt,
    );
  },
});

export const getPendingSubmissions = query({
  args: {},
  returns: v.array(
    v.object({
      submission: v.object({
        _id: v.id("submissions"),
        _creationTime: v.number(),
        userId: v.id("users"),
        challengeId: v.id("challenges"),
        githubUrl: v.string(),
        liveUrl: v.string(),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        status: v.union(
          v.literal("pending"),
          v.literal("approved"),
          v.literal("rejected"),
        ),
        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id("users")),
        autoScore: v.optional(v.number()),
      }),
      user: v.union(
        v.null(),
        v.object({
          _id: v.id("users"),
          name: v.string(),
          username: v.string(),
          avatarUrl: v.optional(v.string()),
        }),
      ),
      challenge: v.union(
        v.null(),
        v.object({
          _id: v.id("challenges"),
          title: v.string(),
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
        }),
      ),
    }),
  ),
  handler: async (ctx) => {
    const pendingSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const joined = await Promise.all(
      pendingSubmissions.map(async (submission) => {
        const [user, challenge] = await Promise.all([
          ctx.db.get(submission.userId),
          ctx.db.get(submission.challengeId),
        ]);

        return {
          submission,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
              }
            : null,
          challenge: challenge
            ? {
                _id: challenge._id,
                title: challenge.title,
                category: challenge.category,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
              }
            : null,
        };
      }),
    );

    return joined.sort(
      (a, b) => a.submission.submittedAt - b.submission.submittedAt,
    );
  },
});

export const getUserSubmissionForChallenge = query({
  args: {
    userId: v.id("users"),
    challengeId: v.id("challenges"),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("submissions"),
      _creationTime: v.number(),
      userId: v.id("users"),
      challengeId: v.id("challenges"),
      githubUrl: v.string(),
      liveUrl: v.string(),
      score: v.optional(v.number()),
      feedback: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
      ),
      submittedAt: v.number(),
      reviewedAt: v.optional(v.number()),
      reviewedBy: v.optional(v.id("users")),
      autoScore: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_user_and_challenge", (q) =>
        q.eq("userId", args.userId).eq("challengeId", args.challengeId),
      )
      .unique();
  },
});

export const submitSolution = mutation({
  args: {
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    githubUrl: v.string(),
    liveUrl: v.string(),
  },
  returns: v.id("submissions"),
  handler: async (ctx, args) => {
    const [user, challenge, existingSubmission] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.challengeId),
      ctx.db
        .query("submissions")
        .withIndex("by_user_and_challenge", (q) =>
          q.eq("userId", args.userId).eq("challengeId", args.challengeId),
        )
        .unique(),
    ]);

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (!challenge) {
      throw new ConvexError("Challenge not found");
    }
    if (existingSubmission) {
      throw new ConvexError("Already submitted");
    }

    const submissionId = await ctx.db.insert("submissions", {
      userId: args.userId,
      challengeId: args.challengeId,
      githubUrl: args.githubUrl,
      liveUrl: args.liveUrl,
      status: "pending",
      submittedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.submissions.autoScoreSubmission, {
      submissionId,
      githubUrl: args.githubUrl,
      liveUrl: args.liveUrl,
    });

    return submissionId;
  },
});

export const setSubmissionAutoScore = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    autoScore: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new ConvexError("Submission not found");
    }

    await ctx.db.patch(args.submissionId, { autoScore: args.autoScore });
    return null;
  },
});

async function isReachableUrl(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    return response.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export const autoScoreSubmission = action({
  args: {
    submissionId: v.id("submissions"),
    githubUrl: v.string(),
    liveUrl: v.string(),
  },
  returns: v.number(),
  handler: async (ctx: ActionCtx, args) => {
    const [githubOk, liveOk] = await Promise.all([
      isReachableUrl(args.githubUrl),
      isReachableUrl(args.liveUrl),
    ]);

    const autoScore =
      githubOk && liveOk ? 60 : githubOk ? 40 : liveOk ? 40 : 20;

    await ctx.runMutation(internal.submissions.setSubmissionAutoScore, {
      submissionId: args.submissionId,
      autoScore,
    });

    return autoScore;
  },
});

export const reviewSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
    adminId: v.id("users"),
    score: v.number(),
    feedback: v.string(),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  returns: v.object({
    newXP: v.number(),
    rankChanged: v.boolean(),
    newRank: v.union(
      v.literal("Newbie"),
      v.literal("Learner"),
      v.literal("Builder"),
      v.literal("Expert"),
      v.literal("Elite"),
      v.literal("Legend"),
    ),
  }),
  handler: async (ctx, args) => {
    const authenticatedAdmin = await requireAdmin(ctx);
    if (authenticatedAdmin._id !== args.adminId) {
      throw new ConvexError("Authenticated admin does not match adminId");
    }

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new ConvexError("Submission not found");
    }
    if (submission.status !== "pending") {
      throw new ConvexError("Submission has already been reviewed");
    }

    const [user, challenge] = await Promise.all([
      ctx.db.get(submission.userId),
      ctx.db.get(submission.challengeId),
    ]);
    if (!user) {
      throw new ConvexError("Submitting user not found");
    }
    if (!challenge) {
      throw new ConvexError("Challenge not found");
    }

    const reviewedAt = Date.now();
    await ctx.db.patch(args.submissionId, {
      status: args.status,
      score: args.score,
      feedback: args.feedback,
      reviewedAt,
      reviewedBy: args.adminId,
    });

    let newXP = user.xp;
    let newRank = user.rank;
    let rankChanged = false;
    let newStreakCount = user.streakCount;
    let newLastActiveDate = user.lastActiveDate;

    if (args.status === "approved") {
      newXP = user.xp + challenge.xpReward;
      newRank = computeRank(newXP);
      rankChanged = newRank !== user.rank;

      const today = formatDateKey(reviewedAt);
      const dayDiff = user.lastActiveDate
        ? getDayDiff(user.lastActiveDate, today)
        : null;

      if (!user.lastActiveDate) {
        newStreakCount = 1;
      } else if (dayDiff === 0) {
        newStreakCount = user.streakCount;
      } else if (dayDiff === 1) {
        newStreakCount = user.streakCount + 1;
      } else {
        newStreakCount = 1;
      }

      newLastActiveDate = today;

      await ctx.db.patch(user._id, {
        xp: newXP,
        rank: newRank,
        streakCount: newStreakCount,
        lastActiveDate: newLastActiveDate,
      });

      await ctx.db.insert("xp_transactions", {
        userId: user._id,
        amount: challenge.xpReward,
        reason: `Challenge approved: ${challenge.title}`,
        sourceType: "challenge_approved",
        sourceId: String(submission.challengeId),
        createdAt: reviewedAt,
      });
    }

    await ctx.db.insert("audit_log", {
      adminId: authenticatedAdmin._id,
      adminName: authenticatedAdmin.name,
      action:
        args.status === "approved"
          ? "SUBMISSION_APPROVED"
          : "SUBMISSION_REJECTED",
      targetId: String(submission._id),
      targetName: challenge.title,
      details: `Reviewed ${challenge.title} for ${user.name} with status ${args.status} and score ${args.score}`,
      createdAt: reviewedAt,
    });

    return { newXP, rankChanged, newRank };
  },
});
