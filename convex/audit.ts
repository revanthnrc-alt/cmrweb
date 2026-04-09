import { v } from "convex/values";

import { query } from "./_generated/server";

export const getAuditLog = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("audit_log"),
      _creationTime: v.number(),
      adminId: v.id("users"),
      adminName: v.string(),
      action: v.union(
        v.literal("SUBMISSION_APPROVED"),
        v.literal("SUBMISSION_REJECTED"),
        v.literal("XP_AWARDED"),
        v.literal("ROLE_CHANGED"),
        v.literal("USER_CREATED"),
      ),
      targetId: v.string(),
      targetName: v.string(),
      details: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const entries = await ctx.db.query("audit_log").collect();
    return entries
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, args.limit ?? 50);
  },
});
