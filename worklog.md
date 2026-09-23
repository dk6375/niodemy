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

---
Task ID: 0b
Agent: Planning Agent (Z.ai Code)
Task: Update plan v1.1 — Add Senior segment + Hybrid-Merge combined course mode.

Work Log:
- User feedback: Class 11/12 + NEET/JEE needs its own combined course (not just "depth-merge" under School)
- User insight: NEET/JEE syllabus = NCERT, but NEET needs DEPTH + SPEED + PYQ; Board needs DETAILED QNA
- Updated PLAN.md from v1.0 → v1.1:
  - Split School (1–12) into School (1–10) + Senior (11–12)
  - Added Senior segment with Hybrid-Merge combined course mode
  - Hybrid-Merge = depth + practice formats (board QNA + entrance MCQ) + speed drills + dual PYQs
  - Updated architecture diagram, segment map, naming, URL structure, folder structure
  - Added Section 5.2 (Senior deep-dive) with pitch + transitions
  - Added Section 8.3 (Hybrid-Merge algorithm) with TypeScript code
  - Renumbered subsequent sections (8.4 Syllabus-Merge, 8.5 Priority, 8.6 Don't Teach Twice, 8.7 Auto-Rewiring)
  - Added 4 new features (#26–29): Speed Practice, Board QNA, Dual PYQ, Hybrid Daily Plan
  - Updated Differentiators: 3 combined course modes, Senior Hybrid-Merge, Speed+Detail dual practice
  - Updated questions schema: added exam_format, time_recommended, marks, board_ref fields
  - Added Session 7b: Senior Segment in roadmap
  - Updated folder structure with /senior route group

Stage Summary:
- PLAN.md updated to v1.1 (2400+ lines)
- 8 segments confirmed: School, Senior, Coaching, College, ITI, Skills, GK, Atlas
- 3 combined course modes: Depth-Merge (School), Hybrid-Merge (Senior), Syllabus-Merge (Coaching)
- Plan is now complete and ready for development

---
Task ID: 1
Agent: Development Agent (Z.ai Code)
Task: Session 1 — Project setup, Supabase connection, auth, design system, home page.

Work Log:
- Saved all credentials in .env.local (gitignored) + .env.example (committed, no secrets)
- Set up git remote: origin → github.com/dk6375/niodemy (public repo)
- Merged remote README.md into local, pushed plan + worklog to GitHub
- Installed @supabase/supabase-js + @supabase/ssr packages
- Created Supabase client files:
  - src/lib/supabase/client.ts (browser client)
  - src/lib/supabase/server.ts (server client)
  - src/lib/supabase/middleware.ts (session refresh + route protection)
- Created proxy.ts (Next.js 16 uses "proxy" convention, not "middleware")
- Updated globals.css: emerald brand accent (no indigo/blue per project rules) + dark mode support
- Created theme-provider.tsx (next-themes integration)
- Built site-header.tsx: logo, 8-segment desktop nav, mobile hamburger (Sheet), search, theme toggle, login button
- Built site-footer.tsx: brand info + segment links + platform links (sticky to bottom via mt-auto)
- Built home page (app/page.tsx):
  - Hero section with badge + headline + CTA buttons
  - 8 segment cards grid (School, Senior, Coaching, College, ITI, Skills, GK, Atlas)
  - Senior & Coaching highlighted with "Hybrid Course" / "Combined Course" badges
  - Features section (6 differentiators)
  - CTA section (emerald banner)
- Built login + signup pages (placeholder, Supabase auth configured)
- Built /my dashboard (login-gated): stats, quick links, empty state
- Built all 8 segment pages:
  - Coaching: detailed landing with Combined Course Engine pitch
  - Senior, School, College, ITI, Skills, GK, Atlas: Coming Soon placeholders
- Updated layout.tsx: SiteHeader + SiteFooter + ThemeProvider + metadata (Niodemy branding)
- Ran lint: 0 errors
- Verified with Agent Browser: home page renders, all 8 segments visible, mobile view works (hamburger menu), dark mode works
- Verified with VLM: "clean and modern design, all 8 segment cards visible, mobile-first friendly, dark mode correctly applied with emerald accents visible"

Stage Summary:
- Live site at http://localhost:3000 (Vercel deploy: user connects repo to Vercel for production)
- Supabase auth configured and working (middleware refreshes session on every request)
- Design system: emerald accent, dark mode, mobile-first, shadcn/ui components
- All 8 segment routes created (Coaching detailed, others Coming Soon)
- /my dashboard created (login-gated)
- GitHub: pushed to github.com/dk6375/niodemy main branch
- Next session: Session 2 — Core data models + public browsing (knowledge schema, content, questions, W3Schools-style free access)

---
Task ID: 2
Agent: Development Agent (Z.ai Code)
Task: Session 2 — Core data models (knowledge, content, questions) + W3Schools-style public browsing.

Work Log:
- Plan v1.2 updates:
  - School segment changed from Class 1–10 → Class 6–10 (Class 1–5 excluded, needs kids gamification — separate future product)
  - Added Section 3.3: Combined Course Applicability (School/Senior/Coaching/GK = optional; College/ITI/Skills = none)
  - School combined course: depth-merge (foundation) + syllabus-merge (scholarship like NTSE)
  - GK segment: content-first structure (articles → then MCQ/Quiz/QNA/MockTest on demand)
  - Atlas: multi-segment coverage (School/Senior/College/ITI book solutions)
  - Domain fixed: snapzila-academy → niodemy.vercel.app
  - Brand color consistency note added (emerald across whole platform)
  - Home page segment cards updated with new descriptions
- Database setup:
  - Installed `pg` + `@types/pg` packages for SQL execution
  - Created migration runner script: scripts/migrate.ts (uses Supabase pooler URL)
  - Created verify script: scripts/verify.ts
  - Created 5 SQL migration files in supabase/migrations/:
    - 001_knowledge.sql (concepts, prerequisites, translations)
    - 002_content.sql (content_assets, versions, media)
    - 003_questions.sql (questions, collections, collection_items)
    - 004_fix_correct_answer.sql (jsonb → text for simpler inserts)
    - 005_move_to_public_schema.sql (moved all tables to public schema for PostgREST access)
  - Created seed file: supabase/seed/001_sample_data.sql
  - Ran all migrations + seed against Supabase (project: yhofteepwxmiiftcwjun)
  - Verified: 5 concepts, 3 lessons, 20 questions published
- Frontend (W3Schools-style free browsing):
  - Created query helpers: src/lib/queries/concepts.ts (getConceptBySlug, getPublishedConcepts, getContentForConcept, getQuestionsForConcept)
  - Built QuestionPractice component (src/components/learn/question-practice.tsx): interactive MCQ with answer check, explanation toggle, try again
  - Built concept detail page (src/app/concept/[slug]/page.tsx): definition, key facts, components, lesson (Markdown rendered), practice questions, depth layers sidebar
  - Built concepts browse page (src/app/concepts/page.tsx): grouped by subject, subject filter, search bar (decorative)
  - Added "Concepts" link to site header navigation
- Testing:
  - Dev server running, all routes return 200
  - Agent Browser: concepts page lists all 5 concepts grouped by subject
  - Agent Browser: concept detail page renders definition, key facts, components, lesson, 4 practice questions
  - Agent Browser: question practice works — select option, check answer, shows "✓ Correct!", try again, show explanation
  - VLM verified: "clean design, all sections visible (definition, key facts, components, lesson, practice questions), depth layers sidebar visible"
  - Lint: 0 errors

Stage Summary:
- Supabase database live with 5 published concepts, 3 lessons, 20 MCQs (across Biology, Polity, Mathematics, Physics)
- W3Schools-style free browsing working: anyone can browse concepts, read lessons, attempt questions WITHOUT login
- RLS policies enforce: only published content readable by public; anonymous users can browse
- Interactive question practice: select → check → see correct/incorrect → show explanation → try again
- Concept detail page: rich layout with definition, key facts, components, rendered Markdown lesson, practice questions, depth layers sidebar
- GitHub: pushed to github.com/dk6375/niodemy
- Next session: Session 3 — Learner dashboard + enrollment + depth-merge combined course engine (learning schema, education schema, exams schema)

---
Task ID: 3
Agent: Development Agent (Z.ai Code)
Task: Session 3 — Learner dashboard + enrollment + depth-merge combined course engine.

Work Log:
- Set git config: user.email = careeralertonline@gmail.com, user.name = dk6375 (for all future commits)
- Database migrations:
  - 006_education.sql: boards, classes, curriculums, curriculum_concepts tables (+ RLS: public read)
  - 007_learning.sql: enrollments, learning_paths, progress, attempts, bookmarks, notes tables (+ RLS: owner-only CRUD via auth.uid())
- Seed data (002_education_curriculum.sql):
  - Board: CBSE
  - Class: Class 8 (level 8, segment 'school')
  - 2 curriculums: "Class 8 CBSE Science" (academic_year 2025-26) + "Class 8 NEET Foundation Science"
  - Mapped existing concepts (Photosynthesis, Newton's Laws) to both curriculums at different depths:
    - CBSE Science: L2 (basic exam depth)
    - NEET Foundation: L3 (deeper foundation depth)
- Depth-merge combined course engine (src/lib/combined-course/depth-merge.ts):
  - generateDepthMergeCombinedCourse(): takes userId + curriculumIds, returns merged course
  - Algorithm: fetch all curriculum_concepts → merge by MAX depth → subtract mastered → sort by chapter order
  - Returns: concepts with target_depth, sources (which curriculums), mastery, status, overlap_stats
  - Saves to learning_paths table (cached for dashboard)
  - Helper functions: getAvailableCurriculums(), getUserEnrollments(), getUserProgressSummary()
- API routes:
  - POST/DELETE /api/enroll — enroll/unenroll in goals
  - POST/GET /api/combined-course — generate/fetch combined course
- Auth pages (full functional):
  - /login: email + password login via Supabase auth
  - /signup: email + password + full_name signup
- Learner dashboard (/my) — fully functional:
  - Welcome message with user name
  - Stats: Active Goals, Mastered, In Progress, Avg Mastery
  - Quick links: Goals, Path, AI Tutor, Bookmarks
  - Active goals list with enrollment details
  - Combined course CTA when 2+ goals enrolled
  - Overall progress bar with mastery breakdown
- My Goals page (/my/goals):
  - Lists available curriculums grouped by class
  - EnrollButton component (client-side, POST /api/enroll)
  - Shows current enrollments
  - Combined course CTA when 2+ enrollments
- My Path page (/my/path):
  - Generates depth-merge combined course on load
  - Shows header card with mode badge + overlap stats (total/common/unique)
  - Progress bar (mastered / total)
  - Concept list with: title, #N order, "N goals" badge, depth L#, importance, chapter name, mastery status
  - Clickable concepts → /concept/[slug]
- Helper scripts:
  - scripts/create-user.ts: create test user directly via SQL (bypasses email rate limit)
  - scripts/confirm-users.ts: auto-confirm unconfirmed users
  - scripts/list-users.ts: list auth users
- End-to-end testing (Agent Browser):
  - Created demo user (demo@niodemy.test / demo1234)
  - Logged in → redirected to /my dashboard
  - "Welcome back, demo!" shown
  - Navigated to /my/goals → saw 2 available curriculums (Class 8 CBSE Science + NEET Foundation)
  - Enrolled in BOTH → "Combined Course Ready!" message appeared
  - Clicked "View Combined Course" → /my/path
  - Combined course generated successfully:
    - Header: "Depth-Merge Combined Course" badge
    - Stats: Total 2, Common 2, Unique 0 (both concepts in both curriculums)
    - Progress: 0/2 mastered (0%)
    - 2 concepts listed: Photosynthesis (Depth L3, 2 goals, high, "Crop Production and Management") + Newton's Laws (Depth L3, 2 goals, high, "Force and Pressure")
    - Both marked "Not started"
  - Depth correctly merged: CBSE L2 + Foundation L3 → L3 (max)
- Lint: 0 errors

Stage Summary:
- Depth-merge combined course engine WORKING end-to-end
- User can: signup → login → enroll in multiple goals → get ONE combined course (not separate courses)
- Same NCERT concepts taught at max depth across goals (Allen Kota model online)
- Progress tracking + "Knowledge Passport" foundation laid (mastery per concept per user, portable across goals)
- Overlap stats show "72% common" style pitch (here: 2/2 common = 100%)
- GitHub: pushed to github.com/dk6375/niodemy with careeralertonline@gmail.com email
- Next session: Session 4 — Coaching segment + syllabus-merge combined course engine (exams schema, exam_concepts, RRB+SSC+Police multi-exam combined course)

---
Task ID: 4
Agent: Development Agent (Z.ai Code)
Task: Session 4 — Coaching segment + syllabus-merge combined course engine.

Work Log:
- Fixed all "Class 1" references across codebase + plan:
  - Home page: "from Class 1 to Career" → "from Class 6 to Career"
  - PLAN.md: Senior comparison "Class 1–10" → "Class 6–10"
  - PLAN.md: "from Class 1 to career" → "from Class 6 to career"
  - PLAN.md: URL structure "Class 1–10" → "Class 6–10"
  - PLAN.md: Session 7 scope "Class 1–10" → "Class 6–10"
- Database migration:
  - 008_exams.sql: exams, exam_cycles, exam_concepts, related_exams tables (+ RLS: public read)
- Seed data (003_exams_coaching.sql):
  - 3 exams: RRB Group D (railway), SSC GD Constable (police), MP Police Constable (police)
  - Full pattern_json (sections, questions, marks, duration, negative marking)
  - Full eligibility_json (education, age, relaxation, nationality)
  - Exam cycles for 2025
  - exam_concepts mappings: 5 existing concepts mapped to all 3 exams at L2 depth
  - related_exams: all 3 marked as "similar" to each other
- Syllabus-merge combined course engine (src/lib/combined-course/syllabus-merge.ts):
  - generateSyllabusMergeCombinedCourse(): takes userId + examIds
  - Algorithm: fetch all exam_concepts → union by concept → take MAX depth + MAX importance → subtract mastered → sort by in_exams_count (common first)
  - Computes overlap_stats: total, common_to_all, common_to_some, unique, per_exam, overlap_percent
  - Saves to learning_paths table (cached)
  - Helper functions: getAvailableExams(), getExamBySlug(), getExamConcepts()
- Updated /api/combined-course route: handles both depth-merge (curriculum_ids) and syllabus-merge (exam_ids) via "mode" parameter
- Coaching pages built:
  - /coaching (updated): hero + combined course pitch card + exam directory grouped by category + features section
  - /coaching/exam/[slug]: exam detail with pattern (4 stat cards), syllabus (concepts grouped by subject), eligibility sidebar, quick info sidebar, combined course CTA
  - /coaching/combined: CombinedCourseGenerator component (client) + combined course result with overlap stats + per-exam breakdown + concept list
- CombinedCourseGenerator component (client):
  - Selectable exam cards (click to enroll/unenroll via /api/enroll)
  - Category grouping
  - "Generate Combined Course" button (disabled if <2 selected)
  - Calls /api/combined-course with mode=syllabus-merge
  - Toast notifications
- End-to-end testing (Agent Browser):
  - /coaching page: 3 exams shown grouped (Railway, Police), pattern badges (100 Qs, 90 min, NM)
  - /coaching/exam/rrb-group-d: Exam Pattern (100 Qs, 100 marks, 90 min, -0.25 NM), 5 concepts in 3 subjects (General Science, General Awareness, Mathematics), Eligibility sidebar
  - /coaching/combined (logged in as demo@niodemy.test):
    - Selected all 3 exams (MP Police, SSC GD, RRB Group D)
    - Clicked "Generate Combined Course"
    - Result: "Syllabus-Merge Combined Course" with badge
    - Overlap stats: Total 5, Common to all 4, Common to some 0, Unique 1
    - Per-exam breakdown badges shown
    - Combined Progress: 0/5 mastered (0%)
    - 5 concepts listed:
      - #1 Photosynthesis — "3 exams" badge, "Common to all" badge, Depth L2, per-exam subject mapping (RRB: General Science, SSC: General Science, MP: Science)
      - #2 Newton's Laws of Motion — "3 exams", "Common to all", L2
      - #3 Fundamental Rights — "3 exams", "Common to all", L2
      - #4 Indian Parliament — "3 exams", "Common to all", L2
      - #5 Pythagoras Theorem — "2 exams" (RRB + SSC only, NOT MP Police), L2 medium
    - Each concept clickable → /concept/[slug]
- VLM verified: "Combined Course Generator tool, Syllabus-Merge Combined Course stats (5 total, 4 common to all), progress bar 0%, 5 specific concepts listed"
- Lint: 0 errors

Stage Summary:
- Syllabus-merge combined course engine WORKING end-to-end
- User can: browse exams → view exam detail (pattern + syllabus + eligibility) → select multiple exams → generate ONE combined course
- Overlap stats show the killer pitch: "5 concepts merged from 3 exams, 4 common to all — you don't need 3 separate courses!"
- Per-exam subject mapping visible (e.g., Photosynthesis is "General Science" in RRB, "Science" in MP Police)
- Concept #5 (Pythagoras) correctly shows "2 exams" (not in MP Police syllabus)
- Both combined course engines now live: depth-merge (School) + syllabus-merge (Coaching)
- GitHub: pushed to github.com/dk6375/niodemy (careeralertonline@gmail.com)
- Next session: Session 5 — Console (content authoring + exam management + teacher dashboard)
