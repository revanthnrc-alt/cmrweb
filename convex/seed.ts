import { ConvexError, v } from "convex/values";

import { mutation } from "./_generated/server";

type DemoUser = {
  workosId: string;
  email: string;
  name: string;
  username: string;
  role: "member" | "admin";
  rank: "Newbie" | "Learner" | "Builder" | "Expert" | "Elite" | "Legend";
  xp: number;
  streakCount: number;
  domain: "Web" | "Full-Stack" | "AI/ML" | "Mobile" | "Design";
  skills: string[];
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  createdAt: number;
};

type SeedEvent = {
  title: string;
  description: string;
  type: "Hackathon" | "Workshop" | "Sprint" | "Talk";
  date: number;
  location: string;
  maxCapacity: number;
  registeredCount: number;
  createdAt: number;
};

export const seedDatabase = mutation({
  args: {},
  returns: v.object({
    users: v.number(),
    challenges: v.number(),
    events: v.number(),
    projects: v.number(),
    submissions: v.number(),
    auditLogs: v.number(),
    xpTransactions: v.number(),
  }),
  handler: async (ctx) => {
    const existingUsers = await ctx.db.query("users").take(1);
    if (existingUsers.length > 0) {
      throw new ConvexError("Database already contains data");
    }

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const demoUsers: DemoUser[] = [
      {
        workosId: "workos_arjun_001",
        email: "arjun.sharma@nexusclub.dev",
        name: "Arjun Sharma",
        username: "arjun_sharma",
        role: "admin",
        rank: "Legend",
        xp: 10480,
        streakCount: 23,
        domain: "Full-Stack",
        skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        bio: "NexusClub admin, hackathon closer, and the builder everyone calls when demo day needs one more impossible feature.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunSharma",
        githubUrl: "https://github.com/arjunsharma",
        linkedinUrl: "https://linkedin.com/in/arjunsharma",
        createdAt: now - 220 * day,
      },
      {
        workosId: "workos_priya_002",
        email: "priya.mehta@nexusclub.dev",
        name: "Priya Mehta",
        username: "priya_mehta",
        role: "member",
        rank: "Elite",
        xp: 6210,
        streakCount: 15,
        domain: "AI/ML",
        skills: ["Python", "PyTorch", "FastAPI", "Hugging Face", "LangChain"],
        bio: "Ships AI prototypes that feel magical in demos and surprisingly production-ready the week after.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaMehta",
        githubUrl: "https://github.com/priyamehta",
        linkedinUrl: "https://linkedin.com/in/priyamehta",
        createdAt: now - 200 * day,
      },
      {
        workosId: "workos_kiran_003",
        email: "kiran.rao@nexusclub.dev",
        name: "Kiran Rao",
        username: "kiran_rao",
        role: "member",
        rank: "Expert",
        xp: 3990,
        streakCount: 8,
        domain: "Web",
        skills: ["Next.js", "TypeScript", "Tailwind", "Figma", "GraphQL"],
        bio: "Frontend systems specialist obsessed with motion, polish, and turning rough ideas into premium interfaces fast.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=KiranRao",
        githubUrl: "https://github.com/kiranrao",
        linkedinUrl: "https://linkedin.com/in/kiranrao",
        createdAt: now - 175 * day,
      },
      {
        workosId: "workos_rahul_004",
        email: "rahul.thakur@nexusclub.dev",
        name: "Rahul Thakur",
        username: "rahul_thakur",
        role: "member",
        rank: "Builder",
        xp: 1820,
        streakCount: 3,
        domain: "Mobile",
        skills: ["React Native", "Flutter", "Firebase", "Swift"],
        bio: "Cross-platform mobile builder who turns campus pain points into apps people actually use.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulThakur",
        githubUrl: "https://github.com/rahulthakur",
        linkedinUrl: "https://linkedin.com/in/rahulthakur",
        createdAt: now - 140 * day,
      },
      {
        workosId: "workos_sneha_005",
        email: "sneha.pillai@nexusclub.dev",
        name: "Sneha Pillai",
        username: "sneha_pillai",
        role: "member",
        rank: "Learner",
        xp: 680,
        streakCount: 1,
        domain: "Design",
        skills: ["Figma", "Adobe XD", "CSS", "Framer"],
        bio: "Design-first builder with a sharp eye for flow, hierarchy, and the details that make products feel memorable.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaPillai",
        githubUrl: "https://github.com/snehapillai",
        linkedinUrl: "https://linkedin.com/in/snehapillai",
        createdAt: now - 95 * day,
      },
    ];

    const userIds = await Promise.all(
      demoUsers.map(async (user) =>
        await ctx.db.insert("users", {
          workosId: user.workosId,
          email: user.email,
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          role: user.role,
          rank: user.rank,
          xp: user.xp,
          streakCount: user.streakCount,
          lastActiveDate: new Date(now).toISOString().slice(0, 10),
          domain: user.domain,
          skills: user.skills,
          githubUrl: user.githubUrl,
          linkedinUrl: user.linkedinUrl,
          createdAt: user.createdAt,
        }),
      ),
    );

    const challenges = [
      {
        title: "Dark Mode Dashboard UI",
        description: "Design and ship a cinematic dark-mode analytics dashboard with strong information hierarchy, responsive layouts, and interaction polish.",
        category: "UI/UX" as const,
        difficulty: "Easy" as const,
        xpReward: 150,
        timeLimitDays: 3,
        requirements: [
          "Design a responsive dashboard layout",
          "Use clear typography and spacing rhythm",
          "Include one data-heavy and one summary view",
        ],
        resources: [
          "Study modern SaaS dashboard patterns",
          "Show hover, empty, and loading states",
        ],
      },
      {
        title: "Real-Time Chat with WebSockets",
        description: "Build a production-style team chat with presence, typing indicators, channel switching, and reliable message sync.",
        category: "Full-Stack" as const,
        difficulty: "Medium" as const,
        xpReward: 300,
        timeLimitDays: 5,
        requirements: [
          "Support multiple channels or rooms",
          "Display online presence or typing feedback",
          "Handle reconnects gracefully",
        ],
        resources: [
          "Think about optimistic UI and message ordering",
          "Document the realtime architecture clearly",
        ],
      },
      {
        title: "Build a RAG Chatbot",
        description: "Create a retrieval-augmented assistant that answers questions over a curated campus knowledge base with grounded responses.",
        category: "AI/ML" as const,
        difficulty: "Hard" as const,
        xpReward: 500,
        timeLimitDays: 7,
        requirements: [
          "Chunk and embed a custom document set",
          "Retrieve relevant context before generation",
          "Show answer quality or source grounding",
        ],
        resources: [
          "Track retrieval quality in your write-up",
          "Demonstrate at least one failure case and fix",
        ],
      },
      {
        title: "REST API with Auth",
        description: "Ship a secure API with token-based authentication, role-aware authorization, and clean documentation for frontend integration.",
        category: "Backend" as const,
        difficulty: "Medium" as const,
        xpReward: 250,
        timeLimitDays: 4,
        requirements: [
          "Protect private routes",
          "Validate input and return consistent errors",
          "Write clear API docs for consumers",
        ],
        resources: [
          "Document your auth flow",
          "Show one admin-only endpoint",
        ],
      },
      {
        title: "Algorithm Visualizer",
        description: "Build an interactive visual tool that teaches an algorithm through motion, state changes, and step-by-step explanations.",
        category: "Algorithms" as const,
        difficulty: "Medium" as const,
        xpReward: 250,
        timeLimitDays: 4,
        requirements: [
          "Animate state transitions clearly",
          "Allow step-through or replay",
          "Explain time and space complexity",
        ],
        resources: [
          "Pick an algorithm where visuals add learning value",
          "Optimize for clarity over feature count",
        ],
      },
    ];

    const challengeIds = await Promise.all(
      challenges.map(async (challenge, index) =>
        await ctx.db.insert("challenges", {
          ...challenge,
          isActive: true,
          createdAt: now - (index + 3) * day,
        }),
      ),
    );

    const events: SeedEvent[] = [
      {
        title: "48-Hour Hackathon",
        description: "A nonstop campus build sprint where teams ship ambitious prototypes, pitch live, and fight for the leaderboard.",
        type: "Hackathon",
        date: now + 3 * day,
        location: "Innovation Arena",
        maxCapacity: 50,
        registeredCount: 23,
        createdAt: now - 14 * day,
      },
      {
        title: "UI/UX Design Workshop",
        description: "A hands-on product design session focused on dark-mode systems, portfolio-ready case studies, and critique loops.",
        type: "Workshop",
        date: now + 7 * day,
        location: "Design Lab",
        maxCapacity: 30,
        registeredCount: 12,
        createdAt: now - 10 * day,
      },
      {
        title: "Full-Stack Sprint",
        description: "A guided build sprint for students ready to wire backend logic, frontend polish, and deployment into one flow.",
        type: "Sprint",
        date: now + 14 * day,
        location: "Build Room 2",
        maxCapacity: 40,
        registeredCount: 8,
        createdAt: now - 8 * day,
      },
      {
        title: "AI/ML Talk with Industry Expert",
        description: "An industry guest breaks down real-world ML shipping tradeoffs, eval loops, and what actually impresses recruiters.",
        type: "Talk",
        date: now + 21 * day,
        location: "Main Auditorium",
        maxCapacity: 100,
        registeredCount: 45,
        createdAt: now - 6 * day,
      },
      {
        title: "Figma to Code Workshop",
        description: "A packed workshop on translating polished design files into responsive, component-driven frontends.",
        type: "Workshop",
        date: now - 10 * day,
        location: "UX Studio",
        maxCapacity: 30,
        registeredCount: 28,
        createdAt: now - 20 * day,
      },
      {
        title: "Monthly Hackathon",
        description: "The club's flagship monthly sprint night where Arjun's team took the win with a polished full-stack campus tool.",
        type: "Hackathon",
        date: now - 30 * day,
        location: "Nexus Hall",
        maxCapacity: 60,
        registeredCount: 34,
        createdAt: now - 45 * day,
      },
    ];

    const eventIds = await Promise.all(
      events.map(async (event) =>
        await ctx.db.insert("events", {
          ...event,
          isActive: true,
        }),
      ),
    );

    const registrationSpecs = [
      { eventIndex: 0, count: 23 },
      { eventIndex: 1, count: 12 },
      { eventIndex: 2, count: 8 },
      { eventIndex: 3, count: 45 },
      { eventIndex: 4, count: 28 },
      { eventIndex: 5, count: 34 },
    ];

    for (const spec of registrationSpecs) {
      const eventId = eventIds[spec.eventIndex];
      for (let index = 0; index < spec.count; index += 1) {
        await ctx.db.insert("event_registrations", {
          userId: userIds[index % userIds.length],
          eventId,
          registeredAt: events[spec.eventIndex].date - (spec.count - index) * 45 * 60 * 1000,
        });
      }
    }

    const projectDefinitions = [
      {
        owner: 1,
        title: "AI Resume Builder",
        description: "An AI assistant that rewrites resumes for internship roles, scores impact bullets, and suggests missing skills.",
        techStack: ["Next.js", "FastAPI", "Groq", "PostgreSQL"],
        githubUrl: "https://github.com/nexusclub/ai-resume-builder",
        liveUrl: "https://ai-resume-builder.vercel.app",
        likes: 64,
        stars: 28,
        category: "AI/ML" as const,
      },
      {
        owner: 0,
        title: "Campus Expense Tracker",
        description: "A shared expense and dues tracker for student teams with charts, reminders, and role-based access.",
        techStack: ["React", "Convex", "TypeScript", "Recharts"],
        githubUrl: "https://github.com/nexusclub/campus-expense-tracker",
        liveUrl: "https://campus-expense-tracker.vercel.app",
        likes: 48,
        stars: 19,
        category: "Web" as const,
      },
      {
        owner: 2,
        title: "Algorithm Visualizer Pro",
        description: "A polished learning tool that animates sorting, graph traversal, and DP transitions for interview prep.",
        techStack: ["Next.js", "Tailwind", "Framer Motion", "TypeScript"],
        githubUrl: "https://github.com/nexusclub/algo-visualizer-pro",
        liveUrl: "https://algo-visualizer-pro.vercel.app",
        likes: 52,
        stars: 21,
        category: "Web" as const,
      },
      {
        owner: 3,
        title: "Hostel Food Review App",
        description: "A mobile app for menu previews, food feedback, and crowd-sourced ratings from students in hostels.",
        techStack: ["Flutter", "Firebase", "Dart"],
        githubUrl: "https://github.com/nexusclub/hostel-food-review",
        liveUrl: undefined,
        likes: 27,
        stars: 13,
        category: "Mobile" as const,
      },
      {
        owner: 0,
        title: "Interview Sprint Board",
        description: "A kanban-style system for tracking coding prep, mock interviews, and accountability squads.",
        techStack: ["React", "Convex", "Tailwind"],
        githubUrl: "https://github.com/nexusclub/interview-sprint-board",
        liveUrl: "https://interview-sprint-board.vercel.app",
        likes: 39,
        stars: 16,
        category: "Web" as const,
      },
      {
        owner: 1,
        title: "Research Paper Summarizer",
        description: "A campus-friendly AI tool that distills long research PDFs into key takeaways, citations, and discussion points.",
        techStack: ["Python", "LangChain", "FastAPI", "React"],
        githubUrl: "https://github.com/nexusclub/research-paper-summarizer",
        liveUrl: "https://research-paper-summarizer.vercel.app",
        likes: 58,
        stars: 25,
        category: "AI/ML" as const,
      },
      {
        owner: 4,
        title: "Design Crit Wall",
        description: "A visual feedback board where designers post work, receive comments, and track iteration rounds.",
        techStack: ["Framer", "Figma", "CSS"],
        githubUrl: "https://github.com/nexusclub/design-crit-wall",
        liveUrl: "https://design-crit-wall.framer.website",
        likes: 22,
        stars: 11,
        category: "Other" as const,
      },
      {
        owner: 3,
        title: "Hackathon Team Matcher",
        description: "A mobile-first matchmaking tool that pairs builders by interests, domain strengths, and time commitment.",
        techStack: ["React Native", "Supabase", "TypeScript"],
        githubUrl: "https://github.com/nexusclub/hackathon-team-matcher",
        liveUrl: undefined,
        likes: 44,
        stars: 18,
        category: "Mobile" as const,
      },
    ];

    const projectIds = await Promise.all(
      projectDefinitions.map(async (project, index) =>
        await ctx.db.insert("projects", {
          userId: userIds[project.owner],
          title: project.title,
          description: project.description,
          techStack: project.techStack,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          likes: project.likes,
          stars: project.stars,
          category: project.category,
          createdAt: now - (index + 1) * 5 * day,
        }),
      ),
    );

    const submissionSpecs = [
      { user: 0, challenge: 1, status: "approved", score: 94, autoScore: 60, feedback: "Excellent realtime polish, crisp architecture notes, and a demo flow that judges can understand immediately.", daysAgo: 24 },
      { user: 1, challenge: 2, status: "approved", score: 91, autoScore: 60, feedback: "Strong retrieval pipeline and clean reasoning around eval quality. Great technical storytelling.", daysAgo: 22 },
      { user: 2, challenge: 0, status: "approved", score: 88, autoScore: 60, feedback: "Beautiful interface, strong hierarchy, and thoughtful responsive details.", daysAgo: 20 },
      { user: 3, challenge: 4, status: "approved", score: 76, autoScore: 40, feedback: "Good animation work and a clear teaching flow. A few edge cases still need cleanup.", daysAgo: 18 },
      { user: 4, challenge: 0, status: "approved", score: 69, autoScore: 60, feedback: "A promising UI direction with strong taste. Keep sharpening alignment and spacing consistency.", daysAgo: 16 },
      { user: 0, challenge: 3, status: "approved", score: 95, autoScore: 60, feedback: "Production-grade API structure, auth flow, and a very polished submission package.", daysAgo: 14 },
      { user: 1, challenge: 1, status: "approved", score: 84, autoScore: 60, feedback: "Solid end-to-end implementation with nice presence indicators and good write-up quality.", daysAgo: 12 },
      { user: 2, challenge: 4, status: "pending", score: undefined, autoScore: 60, feedback: undefined, daysAgo: 4 },
      { user: 3, challenge: 3, status: "pending", score: undefined, autoScore: 40, feedback: undefined, daysAgo: 3 },
      { user: 4, challenge: 1, status: "pending", score: undefined, autoScore: 60, feedback: undefined, daysAgo: 2 },
      { user: 3, challenge: 0, status: "rejected", score: 58, autoScore: 40, feedback: "Promising direction, but the interaction details and final polish were not yet complete.", daysAgo: 10 },
      { user: 4, challenge: 4, status: "rejected", score: 60, autoScore: 20, feedback: "Nice concept, but the explanation and implementation depth need another pass.", daysAgo: 8 },
    ] as const;

    const submissionIds = [];
    for (const spec of submissionSpecs) {
      const submittedAt = now - spec.daysAgo * day;
      const reviewedAt = spec.status === "pending" ? undefined : submittedAt + 10 * 60 * 60 * 1000;
      const submissionId = await ctx.db.insert("submissions", {
        userId: userIds[spec.user],
        challengeId: challengeIds[spec.challenge],
        githubUrl: `https://github.com/nexusclub/${demoUsers[spec.user].username}-${challenges[spec.challenge].title.toLowerCase().replaceAll(" ", "-")}`,
        liveUrl: `https://${demoUsers[spec.user].username}-${challenges[spec.challenge].title.toLowerCase().replaceAll(" ", "-")}.vercel.app`,
        score: spec.score,
        feedback: spec.feedback,
        status: spec.status,
        submittedAt,
        reviewedAt,
        reviewedBy: spec.status === "pending" ? undefined : userIds[0],
        autoScore: spec.autoScore,
      });
      submissionIds.push(submissionId);
    }

    const xpTransactions = [
      { user: 0, amount: 500, reason: "Challenge approved: Real-Time Chat with WebSockets", sourceType: "challenge_approved", sourceId: String(challengeIds[1]), createdAt: now - 24 * day },
      { user: 1, amount: 500, reason: "Challenge approved: Build a RAG Chatbot", sourceType: "challenge_approved", sourceId: String(challengeIds[2]), createdAt: now - 22 * day },
      { user: 2, amount: 150, reason: "Challenge approved: Dark Mode Dashboard UI", sourceType: "challenge_approved", sourceId: String(challengeIds[0]), createdAt: now - 20 * day },
      { user: 3, amount: 250, reason: "Challenge approved: Algorithm Visualizer", sourceType: "challenge_approved", sourceId: String(challengeIds[4]), createdAt: now - 18 * day },
      { user: 4, amount: 150, reason: "Challenge approved: Dark Mode Dashboard UI", sourceType: "challenge_approved", sourceId: String(challengeIds[0]), createdAt: now - 16 * day },
      { user: 0, amount: 250, reason: "Challenge approved: REST API with Auth", sourceType: "challenge_approved", sourceId: String(challengeIds[3]), createdAt: now - 14 * day },
      { user: 1, amount: 300, reason: "Challenge approved: Real-Time Chat with WebSockets", sourceType: "challenge_approved", sourceId: String(challengeIds[1]), createdAt: now - 12 * day },
      { user: 0, amount: 50, reason: "Registered for 48-Hour Hackathon", sourceType: "event_attended", sourceId: String(eventIds[0]), createdAt: now - 2 * day },
      { user: 1, amount: 50, reason: "Registered for AI/ML Talk with Industry Expert", sourceType: "event_attended", sourceId: String(eventIds[3]), createdAt: now - day },
      { user: 2, amount: 25, reason: "7-day streak bonus", sourceType: "streak_bonus", sourceId: "streak-kiran", createdAt: now - 2 * day },
      { user: 0, amount: 100, reason: "Admin grant for hackathon mentoring", sourceType: "admin_grant", sourceId: String(userIds[0]), createdAt: now - 6 * day },
      { user: 3, amount: 50, reason: "Registered for Full-Stack Sprint", sourceType: "event_attended", sourceId: String(eventIds[2]), createdAt: now - 3 * day },
    ] as const;

    for (const tx of xpTransactions) {
      await ctx.db.insert("xp_transactions", {
        userId: userIds[tx.user],
        amount: tx.amount,
        reason: tx.reason,
        sourceType: tx.sourceType,
        sourceId: tx.sourceId,
        createdAt: tx.createdAt,
      });
    }

    const auditEntries = [
      { action: "USER_CREATED", targetName: demoUsers[0].name, targetId: String(userIds[0]), details: "Seeded admin account for NexusClub lead." },
      { action: "USER_CREATED", targetName: demoUsers[1].name, targetId: String(userIds[1]), details: "Seeded AI/ML member profile for demo." },
      { action: "USER_CREATED", targetName: demoUsers[2].name, targetId: String(userIds[2]), details: "Seeded web expert profile for leaderboard demo." },
      { action: "USER_CREATED", targetName: demoUsers[3].name, targetId: String(userIds[3]), details: "Seeded mobile builder profile for review queue demo." },
      { action: "USER_CREATED", targetName: demoUsers[4].name, targetId: String(userIds[4]), details: "Seeded design learner profile for growth journey demo." },
      { action: "SUBMISSION_APPROVED", targetName: challenges[1].title, targetId: String(submissionIds[0]), details: "Arjun's realtime chat submission was approved." },
      { action: "SUBMISSION_APPROVED", targetName: challenges[2].title, targetId: String(submissionIds[1]), details: "Priya's RAG assistant submission was approved." },
      { action: "SUBMISSION_APPROVED", targetName: challenges[0].title, targetId: String(submissionIds[2]), details: "Kiran's dashboard UI earned strong design marks." },
      { action: "SUBMISSION_REJECTED", targetName: challenges[0].title, targetId: String(submissionIds[10]), details: "Rahul's early mobile-first UI attempt needs another pass." },
      { action: "SUBMISSION_REJECTED", targetName: challenges[4].title, targetId: String(submissionIds[11]), details: "Sneha's algorithm visualizer concept needs more depth." },
      { action: "XP_AWARDED", targetName: demoUsers[0].name, targetId: String(userIds[0]), details: "Admin mentoring bonus awarded after Monthly Hackathon." },
      { action: "XP_AWARDED", targetName: demoUsers[2].name, targetId: String(userIds[2]), details: "Streak bonus awarded for sustained challenge activity." },
    ] as const;

    for (let index = 0; index < auditEntries.length; index += 1) {
      const entry = auditEntries[index];
      await ctx.db.insert("audit_log", {
        adminId: userIds[0],
        adminName: demoUsers[0].name,
        action: entry.action,
        targetId: entry.targetId,
        targetName: entry.targetName,
        details: entry.details,
        createdAt: now - (auditEntries.length - index) * 5 * 60 * 60 * 1000,
      });
    }

    return {
      users: userIds.length,
      challenges: challengeIds.length,
      events: eventIds.length,
      projects: projectIds.length,
      submissions: submissionIds.length,
      auditLogs: auditEntries.length,
      xpTransactions: xpTransactions.length,
    };
  },
});
