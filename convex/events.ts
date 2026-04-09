import { ConvexError, v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { computeRank } from "./users";

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

export const getAllEvents = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("events"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      type: v.union(
        v.literal("Hackathon"),
        v.literal("Workshop"),
        v.literal("Sprint"),
        v.literal("Talk"),
      ),
      date: v.number(),
      location: v.string(),
      maxCapacity: v.number(),
      registeredCount: v.number(),
      isActive: v.boolean(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events.sort((a, b) => a.date - b.date);
  },
});

export const getUpcomingEvents = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("events"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      type: v.union(
        v.literal("Hackathon"),
        v.literal("Workshop"),
        v.literal("Sprint"),
        v.literal("Talk"),
      ),
      date: v.number(),
      location: v.string(),
      maxCapacity: v.number(),
      registeredCount: v.number(),
      isActive: v.boolean(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db.query("events").collect();
    return events
      .filter((event) => event.date > now)
      .sort((a, b) => a.date - b.date);
  },
});

export const getPastEvents = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("events"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      type: v.union(
        v.literal("Hackathon"),
        v.literal("Workshop"),
        v.literal("Sprint"),
        v.literal("Talk"),
      ),
      date: v.number(),
      location: v.string(),
      maxCapacity: v.number(),
      registeredCount: v.number(),
      isActive: v.boolean(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db.query("events").collect();
    return events
      .filter((event) => event.date <= now)
      .sort((a, b) => b.date - a.date);
  },
});

export const isUserRegistered = query({
  args: {
    userId: v.id("users"),
    eventId: v.id("events"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("event_registrations")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId),
      )
      .unique();

    return registration !== null;
  },
});

export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  returns: v.object({
    count: v.number(),
    users: v.array(
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
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("event_registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const users = await Promise.all(
      registrations.map(async (registration) => await ctx.db.get(registration.userId)),
    );

    const populatedUsers = users
      .filter((user): user is NonNullable<typeof user> => user !== null)
      .map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        rank: user.rank,
      }));

    return {
      count: populatedUsers.length,
      users: populatedUsers,
    };
  },
});

export const registerForEvent = mutation({
  args: {
    userId: v.id("users"),
    eventId: v.id("events"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const [user, event, existingRegistration] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.eventId),
      ctx.db
        .query("event_registrations")
        .withIndex("by_user_and_event", (q) =>
          q.eq("userId", args.userId).eq("eventId", args.eventId),
        )
        .unique(),
    ]);

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (!event) {
      throw new ConvexError("Event not found");
    }
    if (existingRegistration) {
      throw new ConvexError("User already registered for this event");
    }
    if (event.registeredCount >= event.maxCapacity) {
      throw new ConvexError("Event is full");
    }

    const now = Date.now();
    await ctx.db.insert("event_registrations", {
      userId: args.userId,
      eventId: args.eventId,
      registeredAt: now,
    });

    const newXP = user.xp + 50;
    await ctx.db.patch(args.eventId, {
      registeredCount: event.registeredCount + 1,
    });
    await ctx.db.patch(args.userId, {
      xp: newXP,
      rank: computeRank(newXP),
    });
    await ctx.db.insert("xp_transactions", {
      userId: args.userId,
      amount: 50,
      reason: `Registered for event: ${event.title}`,
      sourceType: "event_attended",
      sourceId: String(args.eventId),
      createdAt: now,
    });

    return null;
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("Hackathon"),
      v.literal("Workshop"),
      v.literal("Sprint"),
      v.literal("Talk"),
    ),
    date: v.number(),
    location: v.string(),
    maxCapacity: v.number(),
  },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("events", {
      ...args,
      registeredCount: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});
