import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, internalQuery, query, type ActionCtx } from "./_generated/server";
import { RANK_THRESHOLDS, type RankName } from "./users";

const ONE_HOUR_MS = 60 * 60 * 1000;

type Recommendation = {
  challengeId: string;
  title: string;
  reason: string;
  xpReward: number;
  priority: "high" | "medium" | "low";
};

type NextBestAction = {
  action: string;
  xpGain: number;
  rankUnlock: string | null;
  reasoning: string;
};

type SubmissionWithChallenge = {
  submission: {
    score?: number;
    autoScore?: number;
  };
  challenge: {
    category: string;
  } | null;
};

type ChallengeSummary = {
  _id: unknown;
  title: string;
  category: string;
  difficulty: string;
  xpReward: number;
};

function getXpGapToNextRank(xp: number) {
  const thresholds = Object.entries(RANK_THRESHOLDS) as [RankName, number][];
  for (let index = 0; index < thresholds.length; index += 1) {
    const [rank, threshold] = thresholds[index];
    if (xp < threshold) {
      return { nextRank: rank, xpGap: threshold - xp };
    }
  }
  return { nextRank: null, xpGap: 0 };
}

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildFallbackRecommendations(
  challenges: ChallengeSummary[],
  triedCategories: Record<string, number>,
): Recommendation[] {
  const normalizedChallenges = challenges.map((challenge) => ({
    challengeId: String(challenge._id),
    title: challenge.title,
    category: challenge.category,
    difficulty: challenge.difficulty,
    xpReward: challenge.xpReward,
  }));

  return normalizedChallenges
    .sort((a, b) => {
      const aSeen = triedCategories[a.category] ?? 0;
      const bSeen = triedCategories[b.category] ?? 0;
      if (aSeen !== bSeen) return aSeen - bSeen;
      return b.xpReward - a.xpReward;
    })
    .slice(0, 3)
    .map((challenge, index) => ({
      challengeId: challenge.challengeId,
      title: challenge.title,
      reason:
        index === 0
          ? "This expands your range while keeping the XP upside strong."
          : index === 1
            ? "This challenge balances growth in a less-explored category."
            : "This is a solid follow-up that keeps your momentum going.",
      xpReward: challenge.xpReward,
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
    }));
}

function buildFallbackNextBestAction(
  recommendations: Recommendation[],
  xpGap: number,
  nextRank: string | null,
): NextBestAction {
  const top = recommendations[0];
  return {
    action: top ? `Attempt ${top.title}` : "Browse a challenge in a new domain",
    xpGain: top?.xpReward ?? 250,
    rankUnlock: top && nextRank && top.xpReward >= xpGap ? nextRank : null,
    reasoning: top
      ? "This gives you the strongest mix of XP progress and skill expansion right now."
      : "This keeps you moving while your personalized plan refreshes.",
  };
}

export const saveRecommendations = internalMutation({
  args: {
    userId: v.id("users"),
    recommendations: v.string(),
    generatedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("groq_recommendations", args);
    return null;
  },
});

export const saveNBA = internalMutation({
  args: {
    userId: v.id("users"),
    nba: v.string(),
    generatedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("groq_nba", args);
    return null;
  },
});

const cachedRecommendationsReturn = v.union(
  v.null(),
  v.array(
    v.object({
      challengeId: v.string(),
      title: v.string(),
      reason: v.string(),
      xpReward: v.number(),
      priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    }),
  ),
);

const cachedNbaReturn = v.union(
  v.null(),
  v.object({
    action: v.string(),
    xpGain: v.number(),
    rankUnlock: v.union(v.null(), v.string()),
    reasoning: v.string(),
  }),
);

export const getCachedRecommendations = query({
  args: { userId: v.id("users") },
  returns: cachedRecommendationsReturn,
  handler: async (ctx, args) => {
    const cutoff = Date.now() - ONE_HOUR_MS;
    const entries = await ctx.db
      .query("groq_recommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const latest = entries
      .filter((entry) => entry.generatedAt > cutoff)
      .sort((a, b) => b.generatedAt - a.generatedAt)[0];

    if (!latest) return null;
    return safeJsonParse<Recommendation[]>(latest.recommendations);
  },
});

export const getCachedNBA = query({
  args: { userId: v.id("users") },
  returns: cachedNbaReturn,
  handler: async (ctx, args) => {
    const cutoff = Date.now() - ONE_HOUR_MS;
    const entries = await ctx.db
      .query("groq_nba")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const latest = entries
      .filter((entry) => entry.generatedAt > cutoff)
      .sort((a, b) => b.generatedAt - a.generatedAt)[0];

    if (!latest) return null;
    return safeJsonParse<NextBestAction>(latest.nba);
  },
});

export const getCachedNBAInternal = internalQuery({
  args: { userId: v.id("users") },
  returns: cachedNbaReturn,
  handler: async (ctx, args) => {
    const cutoff = Date.now() - ONE_HOUR_MS;
    const entries = await ctx.db
      .query("groq_nba")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const latest = entries
      .filter((entry) => entry.generatedAt > cutoff)
      .sort((a, b) => b.generatedAt - a.generatedAt)[0];

    if (!latest) return null;
    return safeJsonParse<NextBestAction>(latest.nba);
  },
});

export const generateSkillRecommendations = action({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      challengeId: v.string(),
      title: v.string(),
      reason: v.string(),
      xpReward: v.number(),
      priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    }),
  ),
  handler: async (ctx, args) => {
    const [user, submissions, challenges] = await Promise.all([
      ctx.runQuery(api.users.getUserById, { userId: args.userId }),
      ctx.runQuery(api.submissions.getSubmissionsByUser, { userId: args.userId }),
      ctx.runQuery(api.challenges.getAllChallenges, {}),
    ]);

    if (!user) {
      throw new ConvexError("User not found");
    }

    const { xpGap } = getXpGapToNextRank(user.xp);
    const typedSubmissions = submissions as SubmissionWithChallenge[];
    const typedChallenges = challenges as ChallengeSummary[];

    const categoryCounts = typedSubmissions.reduce<Record<string, number>>((acc: Record<string, number>, entry: SubmissionWithChallenge) => {
      const category = entry.challenge?.category ?? "Unknown";
      acc[category] = (acc[category] ?? 0) + 1;
      return acc;
    }, {});
    const avgScore = typedSubmissions.length
      ? Math.round(
          typedSubmissions.reduce((sum: number, entry: SubmissionWithChallenge) => sum + (entry.submission.score ?? entry.submission.autoScore ?? 0), 0) /
            typedSubmissions.length,
        )
      : 0;

    const challengePayload = typedChallenges.map((challenge) => ({
      id: String(challenge._id),
      title: challenge.title,
      category: challenge.category,
      difficulty: challenge.difficulty,
      xpReward: challenge.xpReward,
    }));

    const prompt = `You are an AI mentor for a college tech club. Analyze this member's profile and recommend exactly 3 challenges for them.

MEMBER PROFILE:
- Name: ${user.name}
- Current Rank: ${user.rank} (${user.xp} XP)
- XP to next rank: ${xpGap} XP needed
- Domains: ${user.skills.join(", ")}
- Past challenge categories: ${JSON.stringify(categoryCounts)}
- Past scores: ${avgScore}

AVAILABLE CHALLENGES:
${JSON.stringify(challengePayload)}

Return ONLY valid JSON — no markdown, no explanation:
{
  "recommendations": [
    {
      "challengeId": "...",
      "title": "...",
      "reason": "One specific sentence explaining why this challenge fits this member's journey",
      "xpReward": 250,
      "priority": "high|medium|low"
    }
      ]
}`;

    const fallback = buildFallbackRecommendations(typedChallenges, categoryCounts);
    let recommendations = fallback;

    try {
      const content = await ctx.runAction(internal.groqNode.completePrompt, { prompt });
      const parsed = extractJsonObject(content);
      const parsedRecommendations = parsed?.recommendations;
      if (Array.isArray(parsedRecommendations) && parsedRecommendations.length > 0) {
        recommendations = parsedRecommendations.slice(0, 3).map((entry: any, index: number) => ({
          challengeId: String(entry.challengeId ?? fallback[index]?.challengeId ?? ""),
          title: entry.title ?? fallback[index]?.title ?? "Recommended Challenge",
          reason: entry.reason ?? fallback[index]?.reason ?? "This fits your current growth path.",
          xpReward: Number(entry.xpReward ?? fallback[index]?.xpReward ?? 250),
          priority: entry.priority === "high" || entry.priority === "medium" || entry.priority === "low"
            ? entry.priority
            : fallback[index]?.priority ?? "medium",
        }));
      }
    } catch {
      recommendations = fallback;
    }

    await ctx.runMutation(internal.groq.saveRecommendations, {
      userId: args.userId,
      recommendations: JSON.stringify(recommendations),
      generatedAt: Date.now(),
    });

    return recommendations;
  },
});

export const generateNextBestAction = action({
  args: {
    userId: v.id("users"),
    force: v.optional(v.boolean()),
  },
  returns: v.object({
    action: v.string(),
    xpGain: v.number(),
    rankUnlock: v.union(v.null(), v.string()),
    reasoning: v.string(),
  }),
  handler: async (ctx, args): Promise<NextBestAction> => {
    if (!args.force) {
      const cached = await ctx.runQuery(internal.groq.getCachedNBAInternal, { userId: args.userId });
      if (cached) return cached;
    }

    const [user, xpHistory, submissions, challenges] = await Promise.all([
      ctx.runQuery(api.users.getUserById, { userId: args.userId }),
      ctx.runQuery(api.xp.getUserXPHistory, { userId: args.userId }),
      ctx.runQuery(api.submissions.getSubmissionsByUser, { userId: args.userId }),
      ctx.runQuery(api.challenges.getAllChallenges, {}),
    ]);

    if (!user) {
      throw new ConvexError("User not found");
    }

    const { xpGap, nextRank } = getXpGapToNextRank(user.xp);
    const recentActivity = xpHistory
      .slice(0, 5)
      .map((entry: { reason: string; amount: number }) => `${entry.reason} (${entry.amount} XP)`)
      .join("; ");

    const typedSubmissions = submissions as SubmissionWithChallenge[];
    const typedChallenges = challenges as ChallengeSummary[];

    const categoryCounts = typedSubmissions.reduce<Record<string, number>>((acc: Record<string, number>, entry: SubmissionWithChallenge) => {
      const category = entry.challenge?.category ?? "Unknown";
      acc[category] = (acc[category] ?? 0) + 1;
      return acc;
    }, {});

    const fallbackRecommendations = buildFallbackRecommendations(typedChallenges, categoryCounts);
    const fallback = buildFallbackNextBestAction(fallbackRecommendations, xpGap, nextRank);

    const prompt = `Given this member's profile, generate their single most impactful next action.

Profile: ${user.rank}, ${user.xp} XP, ${xpGap} XP to next rank, ${recentActivity || "No recent activity"}

Return ONLY valid JSON:
{
  "action": "Short imperative sentence describing the action",
  "xpGain": 250,
  "rankUnlock": "Expert" or null if won't change rank,
  "reasoning": "One sentence why this is the best next action"
}`;

    let nextBestAction = fallback;

    try {
      const content = await ctx.runAction(internal.groqNode.completePrompt, { prompt });
      const parsed = extractJsonObject(content);
      if (parsed?.action) {
        nextBestAction = {
          action: parsed.action,
          xpGain: Number(parsed.xpGain ?? fallback.xpGain),
          rankUnlock: parsed.rankUnlock ?? fallback.rankUnlock,
          reasoning: parsed.reasoning ?? fallback.reasoning,
        };
      }
    } catch {
      nextBestAction = fallback;
    }

    await ctx.runMutation(internal.groq.saveNBA, {
      userId: args.userId,
      nba: JSON.stringify(nextBestAction),
      generatedAt: Date.now(),
    });

    return nextBestAction;
  },
});
