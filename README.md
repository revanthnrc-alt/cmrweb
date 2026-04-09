# NexusClub

![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge)

NexusClub is a cinematic college tech club platform where builders compete in challenges, climb a live leaderboard, register for events, showcase projects, and receive Groq-powered AI guidance on what to build next.

## Features

- ✅ Live Convex backend with realtime queries, mutations, actions, and cached AI results
- ✅ WorkOS AuthKit sign-in flow with protected profile and admin experiences
- ✅ Challenge system with submissions, review queue, scoring, and XP rewards
- ✅ Event registration with live capacity tracking and XP incentives
- ✅ Project showcase with optimistic likes and community discovery
- ✅ Team, gallery, and profile pages backed by seeded demo data
- ✅ Groq-powered challenge recommendations and next-best-action guidance
- ✅ Admin dashboard for submission review, role changes, audit history, and leaderboard monitoring
- ✅ Rank progression, streak tracking, and celebratory rank-up moments
- ✅ Mobile-responsive layouts tuned for demo day and judge walkthroughs

## Screenshots

Add final product screenshots here before judging:

- Homepage hero and live leaderboard
- AI recommendation strip on challenges page
- Profile page with streak heatmap and next-best-action widget
- Admin submission review with rank-up celebration
- Mobile views for navbar, gallery, and admin bottom navigation

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind, Framer Motion |
| Backend | Convex (database, realtime subscriptions, server functions, actions) |
| Auth | WorkOS AuthKit |
| AI | Groq API with `llama-3.1-70b-versatile` |
| Deploy | Vercel + Convex Cloud |

## Setup

1. Clone the repo:

```bash
git clone <your-repo-url>
cd cmrweb
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file and fill in the required values:

```bash
cp .env.example .env.local
```

4. Start Convex in development mode:

```bash
npx convex dev
```

5. Start the frontend:

```bash
npm run dev
```

## Environment Variables

The project expects the following values:

- `VITE_CONVEX_URL`
- `VITE_WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_CLIENT_ID`
- `WORKOS_ISSUER_URL`
- `CONVEX_DEPLOYMENT`
- `GROQ_API_KEY`

## Architecture

NexusClub uses Convex to replace three traditional backend concerns at once:

- Express is not needed because Convex server functions handle queries, mutations, and actions directly.
- MongoDB is not needed because Convex provides the database layer, indexes, and end-to-end typed data access.
- Socket.io is not needed because Convex queries are reactive by default and the UI automatically updates when data changes.

This keeps the stack smaller, removes sync glue between backend layers, and makes the “live leaderboard / live admin review / live challenge updates” story much stronger for a hackathon demo.

## How the AI Layer Works

The AI layer is powered by Groq and runs entirely server-side through Convex actions.

1. The frontend asks Convex for cached recommendations or a cached next-best action.
2. If no fresh cache exists, Convex gathers the member profile, submissions, XP history, and available challenges.
3. Convex sends a structured prompt to Groq using `llama-3.1-70b-versatile`.
4. The JSON response is parsed, validated, and cached back into Convex tables.
5. The UI renders the result instantly on future page loads until the cache expires.

This means the API key never reaches the browser, and the experience still feels fast because repeated visits use the Convex cache.

## Demo Credentials

Use your WorkOS test tenant or seeded demo identities for judge walkthroughs.

- Admin demo: `arjun.sharma@nexusclub.dev`
- Member demo: `priya.mehta@nexusclub.dev`

If you are running only the seeded backend for demo storytelling, use the seeded names above to narrate the leaderboard, review queue, and project gallery.

## Team

Built by the NexusClub team.

- Product, frontend, and motion polish
- Convex backend and realtime architecture
- WorkOS auth integration
- Groq AI mentorship layer

## Why This Stands Out

Most club platforms stop at CRUD. NexusClub feels alive.

- Realtime data makes leaderboards and admin workflows feel immediate.
- The AI layer gives each member a personalized growth path instead of a static dashboard.
- The seeded story makes every screen demo-ready even before real student data exists.
