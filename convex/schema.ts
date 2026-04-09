import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const userRole = v.union(v.literal("member"), v.literal("admin"));
const userRank = v.union(
  v.literal("Newbie"),
  v.literal("Learner"),
  v.literal("Builder"),
  v.literal("Expert"),
  v.literal("Elite"),
  v.literal("Legend"),
);
const userDomain = v.union(
  v.literal("Web"),
  v.literal("Full-Stack"),
  v.literal("AI/ML"),
  v.literal("Mobile"),
  v.literal("DevOps"),
  v.literal("Design"),
);
const challengeCategory = v.union(
  v.literal("UI/UX"),
  v.literal("Full-Stack"),
  v.literal("Backend"),
  v.literal("Algorithms"),
  v.literal("AI/ML"),
);
const challengeDifficulty = v.union(
  v.literal("Easy"),
  v.literal("Medium"),
  v.literal("Hard"),
);
const submissionStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
);
const eventType = v.union(
  v.literal("Hackathon"),
  v.literal("Workshop"),
  v.literal("Sprint"),
  v.literal("Talk"),
);
const xpSourceType = v.union(
  v.literal("challenge_approved"),
  v.literal("event_attended"),
  v.literal("streak_bonus"),
  v.literal("admin_grant"),
);
const projectCategory = v.union(
  v.literal("Web"),
  v.literal("AI/ML"),
  v.literal("Mobile"),
  v.literal("Other"),
);
const galleryAlbum = v.union(
  v.literal("Events"),
  v.literal("Projects"),
  v.literal("Team"),
);
const auditAction = v.union(
  v.literal("SUBMISSION_APPROVED"),
  v.literal("SUBMISSION_REJECTED"),
  v.literal("XP_AWARDED"),
  v.literal("ROLE_CHANGED"),
  v.literal("USER_CREATED"),
);

export default defineSchema({
  users: defineTable({
    workosId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: userRole,
    rank: userRank,
    xp: v.number(),
    streakCount: v.number(),
    lastActiveDate: v.optional(v.string()),
    domain: v.optional(userDomain),
    skills: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workos_id", ["workosId"])
    .index("by_username", ["username"])
    .index("by_xp", ["xp"]),

  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    category: challengeCategory,
    difficulty: challengeDifficulty,
    xpReward: v.number(),
    timeLimitDays: v.number(),
    requirements: v.array(v.string()),
    resources: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_is_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),

  submissions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    githubUrl: v.string(),
    liveUrl: v.string(),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    status: submissionStatus,
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    autoScore: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_status", ["status"])
    .index("by_user_and_challenge", ["userId", "challengeId"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    type: eventType,
    date: v.number(),
    location: v.string(),
    maxCapacity: v.number(),
    registeredCount: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_is_active", ["isActive"]),

  event_registrations: defineTable({
    userId: v.id("users"),
    eventId: v.id("events"),
    registeredAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventId"])
    .index("by_user_and_event", ["userId", "eventId"]),

  xp_transactions: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
    sourceType: xpSourceType,
    sourceId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    techStack: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    likes: v.number(),
    stars: v.number(),
    category: projectCategory,
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_created_at", ["createdAt"]),

  project_likes: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_user_and_project", ["userId", "projectId"]),

  gallery_photos: defineTable({
    title: v.string(),
    caption: v.string(),
    album: galleryAlbum,
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
    takenAt: v.number(),
    uploadedAt: v.number(),
  }).index("by_album", ["album"]),

  audit_log: defineTable({
    adminId: v.id("users"),
    adminName: v.string(),
    action: auditAction,
    targetId: v.string(),
    targetName: v.string(),
    details: v.string(),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),

  groq_recommendations: defineTable({
    userId: v.id("users"),
    recommendations: v.string(),
    generatedAt: v.number(),
  }).index("by_user", ["userId"]),

  groq_nba: defineTable({
    userId: v.id("users"),
    nba: v.string(),
    generatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
