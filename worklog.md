# SnapZila Academy — Worklog

> This file tracks all development sessions. Every session MUST append a new section here before pushing to GitHub.

---
Task ID: 0
Agent: Planning Agent (Z.ai Code)
Task: Create the master development plan document for SnapZila Academy platform.

Work Log:
- Read and analyzed the full ChatGPT discussion (17,825 lines) about SnapZila Academy
- Iterated through multiple architecture proposals based on user feedback
- Finalized: 7 segments (School, Coaching, College, ITI, Skills, GK, Atlas) + Console + My dashboard
- Finalized: Two combined course modes — depth-merge (school) + syllabus-merge (coaching)
- Finalized: W3Schools-style free content access platform-wide (no login to browse)
- Finalized: Skills stays in same platform (not separate) with W3Schools tutorials model
- Finalized: Unified chat system (one component, four contexts: chapter doubt, live class, AI tutor, QNA)
- Finalized: Supabase direct (no Prisma) — leverage RLS, Auth, Realtime, Storage, Edge Functions
- Finalized: Naming — simple names (School, Coaching, College, ITI, Skills, GK) + Atlas for books solutions
- Created comprehensive master plan document at docs/SNAPZILA-ACADEMY-PLAN.md

Stage Summary:
- Master plan document created: docs/SNAPZILA-ACADEMY-PLAN.md (~1100 lines)
- Document covers: vision, tech stack, architecture, 7 segments, DB schema (SQL), combined course engine (code), unified chat system, console, design system, 25 next-gen features, SEO strategy, 5-phase roadmap, 14+ session breakdown, worklog workflow, folder structure
- Tech stack: Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Supabase + Vercel + Socket.io + z-ai-web-dev-sdk
- Deployment: Vercel free subdomain (separate from snapzila.com)
- Next step: User provides GitHub + Supabase credentials → create new repo → push plan → begin Session 1
- All content FREE (no payment). Enrollment adds structure + tracking, NOT access (W3Schools model).
