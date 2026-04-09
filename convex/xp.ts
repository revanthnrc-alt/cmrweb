import { v } from "convex/values";

import { query } from "./_generated/server";

export const getUserXPHistory = query({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      _id: v.id("xp_transactions"),
      _creationTime: v.number(),
      userId: v.id("users"),
      amount: v.number(),
      reason: v.string(),
      sourceType: v.union(
        v.literal("challenge_approved"),
        v.literal("event_attended"),
        v.literal("streak_bonus"),
        v.literal("admin_grant"),
      ),
      sourceId: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("xp_transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return history.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getWeeklyXPTotal = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const transactions = await ctx.db.query("xp_transactions").collect();

    return transactions
      .filter((transaction) => transaction.createdAt > cutoff)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  },
});
