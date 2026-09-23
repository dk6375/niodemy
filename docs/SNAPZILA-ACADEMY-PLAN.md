# SnapZila Academy — Master Development Plan

> **Document Version:** 1.1  
> **Last Updated:** Session 0 (Planning Phase) — v1.1 adds Senior (Class 11–12) segment + Hybrid-Merge combined course  
> **Status:** FINAL — Ready for development  
> **Purpose:** Any AI engineer or developer should be able to read this single document and build the entire platform from scratch.

---

## 0. How to Use This Document

This is the **single source of truth** for the SnapZila Academy platform.

**If you are an AI agent picking up this project:**
1. Read this entire document first.
2. Check `/worklog.md` to see what previous sessions have done.
3. Find your assigned session in **Section 15 (Session-wise Breakdown)**.
4. Build exactly what the session specifies.
5. After your session: update `/worklog.md`, commit & push to GitHub, run any DB migrations needed.
6. Never deviate from the architecture without updating this document first.

**Rules for all contributors (human or AI):**
- Mobile-first, always.
- World-class design, always.
- All content is freely browsable (W3Schools model) — no login wall to read.
- Supabase direct (no Prisma) — use RLS, Auth, Realtime, Storage, Edge Functions.
- One unified chat system for all chat contexts.
- Every session ends with: worklog update → git push → DB migrations (if any) → verify deployment.

---

## 1. Vision & Philosophy

### 1.1 The Mission

> **दुनिया का सबसे best educational platform बनाना — जहाँ कोई भी learner, किसी भी stage पर, किसी भी goal के लिए, सही depth में सीख सके।**

A unified learning ecosystem where:
- A Class 8 student can prepare for school + Olympiad + NEET Foundation simultaneously.
- A Class 12 student can prepare for boards + NEET/JEE simultaneously.
- A graduate can prepare for multiple competitive exams (RRB + SSC + Police) through ONE combined course — not three separate ones.
- A college student can learn their degree curriculum + placement prep.
- An ITI student can learn their trade + workshop skills.
- Anyone can learn a skill (coding, Excel, digital marketing) anytime.
- Everyone benefits from GK & Current Affairs, personalized to their exam level.
- Books solutions serve as SEO entry points and reference.

### 1.2 Core Philosophy

| Principle | Meaning |
|---|---|
| **Knowledge ≠ Curriculum ≠ Exam ≠ Course** | Four separate layers. Knowledge is universal. Curriculum maps knowledge to a class. Exam maps knowledge to a test. Course is a generated path. Never mix them. |
| **W3Schools Model Platform-Wide** | ALL content is freely browsable without login. Enrollment is for structured learning + progress tracking + personalization — NOT for access to content. |
| **One Canonical Entity, Multiple Experiences** | A Concept (e.g., Photosynthesis) is ONE record. It powers: concept page, GK collection, quiz, compare entry, combined course — all from the same data. |
| **Combined Course is the Killer Feature** | Students with multiple goals get ONE optimized path, not multiple separate courses. Two modes: depth-merge (school) + syllabus-merge (coaching). |
| **Don't Teach Me Twice** | If a student mastered a concept for one goal, the system skips it for another goal. Mastery is portable across goals. |
| **AI as Orchestration, Not Authority** | Human experts define canonical knowledge. AI assists with explanations, questions, personalization, tutoring. AI never auto-publishes canonical content. |
| **Mobile-First, Always** | India learns on phones. Every page, every component, every interaction must be designed mobile-first. |
| **Free Forever (For Now)** | All content free. No payment. Enrollment is free. Monetization comes later. |

### 1.3 What Makes This Next-Gen & Unique

1. **Combined Course Engine** — No competitor does this. Multiple exams → one optimized path.
2. **Cross-Segment Pathways** — Class 8 → NEET Foundation → NEET → Doctor career. One continuous journey.
3. **Depth-Layered Content** — Same concept taught at different depths based on goal. No duplicate content.
4. **Unified Chat** — One chat system for doubts, AI tutoring, live classes, QNA. Not fragmented.
5. **W3Schools-Style Free Access** — Browse everything free. Enrollment adds structure, not access.
6. **AI Study Companion** — Knows your progress, weak areas, learning style. Personal AI tutor.
7. **Knowledge Graph Navigation** — Visual concept maps, explore by connections.
8. **Exam-Centric GK** — GK personalized to your exam level (RRB basic vs UPSC deep).

---

## 2. Tech Stack

### 2.1 Core Stack (Non-Negotiable)

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Latest, fast, SEO-friendly, server components |
| **Language** | TypeScript 5 (strict) | Type safety, maintainability |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) | Modern, consistent, accessible |
| **Database** | Supabase (PostgreSQL) | Auth + DB + Storage + Realtime + RLS + Edge Functions in one |
| **ORM/Client** | Supabase JS Client (supabase-js) | Direct usage, no Prisma. Leverage RLS + Realtime. |
| **Hosting** | Vercel (free tier for now) | Zero-config Next.js deployment, free subdomain |
| **Version Control** | GitHub | Source of truth, worklog tracking |

### 2.2 Supporting Libraries

| Purpose | Library |
|---|---|
| State Management | Zustand (client) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Markdown | react-markdown + @mdxeditor/editor (for console) |
| Icons | Lucide React |
| Notifications | Sonner (toasts) |
| Dates | date-fns |
| Real-time Chat | Socket.io (mini-service) + Supabase Realtime |
| AI | z-ai-web-dev-sdk (LLM, VLM, TTS, ASR) — backend only |
| Authentication | Supabase Auth (email + OAuth later) |

### 2.3 Why Supabase Direct (No Prisma)?

- **RLS (Row Level Security):** Enforce content visibility at DB level. Free users can't access paid content even via API leaks.
- **Supabase Auth:** Built-in, shared across all segments.
- **Supabase Realtime:** Live chat, live class updates, real-time progress.
- **Supabase Storage:** Videos, images, PDFs, PPTs.
- **Edge Functions:** Combined course engine, AI orchestration, spaced repetition — Deno functions.
- **No ORM overhead:** Direct SQL where needed, typed client via `supabase-js`.

### 2.4 Infrastructure

| Component | Where |
|---|---|
| Frontend (Next.js app) | Vercel (free subdomain → custom domain later) |
| Database + Auth + Storage | Supabase (free tier) |
| Real-time chat service | Vercel/Render mini-service (Socket.io on separate port) |
| AI inference | z-ai-web-dev-sdk (backend) |
| Media (videos/images) | Supabase Storage (start) → Cloudflare R2 (when scale demands) |

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  SNAPZILA ACADEMY                                            │
│  (One domain, one account, one Supabase project)             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PUBLIC LAYER (W3Schools-style — no login to browse)  │  │
│  │                                                        │  │
│  │  /school    /senior     /coaching   /college   /iti      │  │
│  │  /skills    /gk         /atlas                          │  │
│  │                                                        │  │
│  │  All concepts, content, questions, quizzes,           │  │
│  │  mock tests, tutorials, chapters — browsable free.    │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ (login optional)                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PERSONALIZED LAYER (login required)                  │  │
│  │                                                        │  │
│  │  /my → Dashboard: goals, progress, combined course,    │  │
│  │        daily plan, mastery, bookmarks, notes          │  │
│  │  /learn/[path] → Structured learning path              │  │
│  │  /practice → Personalized practice                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ (role-gated)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  CONSOLE LAYER (admin/teacher only)                    │  │
│  │                                                        │  │
│  │  /console → Content authoring, exam management,        │  │
│  │             user management, analytics, chat moderation │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  SHARED BACKBONE:                                            │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐    │
│  │ Auth     │ Supabase │ Knowledge│ Learner  │ Chat     │    │
│  │ (1 login)│ (1 DB)   │ Graph    │ Profile  │ Engine   │    │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Segment Map

| Segment | Route | Audience | Content Style | Combined Course Mode |
|---|---|---|---|---|
| **School** | `/school` | Class 1–10 students | Chapter-based, board-specific | Depth-merge |
| **Senior** | `/senior` | Class 11–12 students (+ NEET/JEE/CUET) | Board + entrance integrated | Hybrid-merge |
| **Coaching** | `/coaching` | After 12th competitive exam aspirants | Concept + MCQ + PYQ + Mock (drill-based) | Syllabus-merge |
| **College** | `/college` | Degree students | Semester + subject + placement | Per-semester path |
| **ITI** | `/iti` | ITI trade students | Trade + workshop + practical | Trade-based path |
| **Skills** | `/skills` | Anyone, anytime | Project-based, W3Schools tutorials | Skill track / roadmap |
| **GK** | `/gk` | Everyone | Daily feed + quiz | Exam-centric personalization |
| **Atlas** | `/atlas` | Reference seekers | Book chapter-wise solutions | None (reference only) |

Plus:
- **`/my`** — Learner dashboard (personalized, login required)
- **`/console`** — Admin & teacher dashboard (role-gated)

### 3.3 Three Access Tiers

| Tier | Login? | What you can do |
|---|---|---|
| **Visitor** (Anonymous) | No | Browse ALL content free. Read concepts, attempt questions, view solutions, read GK, use Atlas. W3Schools model. |
| **Learner** (Logged in) | Yes | Everything Visitor can do + enroll in goals, get combined course, track progress, daily plan, bookmarks, notes, AI tutor, chat. |
| **Staff** (Console access) | Yes + role | Everything Learner can do + content authoring, exam management, analytics, chat moderation, user management. |

**Critical:** Content access is NEVER gated behind enrollment. Enrollment adds structure and tracking, NOT access.

---

## 4. Naming & URL Structure

### 4.1 Final Naming

| Segment | Name | Route | Notes |
|---|---|---|---|
| Class 1–10 | **School** | `/school` | Simple, clear |
| Class 11–12 (+ NEET/JEE/CUET) | **Senior** | `/senior` | Higher secondary; board + entrance integrated |
| Competitive coaching (after 12th) | **Coaching** | `/coaching` | Simple. NOT "Academy" (avoids confusion with brand) |
| College/University | **College** | `/college` | Simple |
| ITI/Vocational | **ITI** | `/iti` | Simple |
| Skills/Outcome-based | **Skills** | `/skills` | Simple |
| GK & Current Affairs | **GK** | `/gk` | Simple |
| Books Solutions | **Atlas** | `/atlas` | User specified this name. "Atlas" = reference/map. |
| Learner dashboard | **My** | `/my` | Personal dashboard |
| Admin/Teacher | **Console** | `/console` | Company management |

### 4.2 URL Structure

```
[domain].vercel.app/                    → Home (segment navigation + search)
├── /school/                            → School home (Class 1–10)
│   ├── /school/class/[class]/          → Class-specific page (e.g., /school/class/8/)
│   ├── /school/class/[class]/[subject]/ → Subject page
│   ├── /school/class/[class]/[subject]/[chapter]/ → Chapter page
│   └── /school/concept/[slug]/         → Concept detail page (indexable)
├── /senior/                            → Senior home (Class 11–12 + entrance)
│   ├── /senior/class/[12]/             → Class page (stream: Science/Bio, Science/Math, Commerce, Arts)
│   ├── /senior/class/[12]/[subject]/   → Subject page
│   ├── /senior/exam/[slug]/            → Entrance exam detail (NEET/JEE/CUET)
│   ├── /senior/concept/[slug]/         → Concept detail (shared knowledge graph)
│   └── /senior/practice/[type]/        → Practice (board-qna / neet-mcq / speed-drill / pyq)
├── /coaching/                          → Coaching home
│   ├── /coaching/exam/[slug]/          → Exam detail (indexable)
│   ├── /coaching/concept/[slug]/       → Concept detail (shared with school if same concept)
│   └── /coaching/quiz/[id]/            → Quiz page
├── /college/                           → College home
├── /iti/                               → ITI home
├── /skills/                            → Skills home
│   ├── /skills/learn/[slug]/           → Tutorial page (W3Schools-style)
│   └── /skills/track/[slug]/           → Skill roadmap
├── /gk/                                → GK home (daily feed)
│   ├── /gk/[category]/                 → Category page (e.g., /gk/polity/)
│   └── /gk/article/[slug]/             → Article page (indexable)
├── /atlas/                             → Atlas home
│   ├── /atlas/book/[slug]/             → Book page
│   └── /atlas/book/[slug]/[chapter]/   → Chapter solutions (indexable)
├── /my/                                → Learner dashboard (login)
│   ├── /my/goals/                      → Enrolled goals
│   ├── /my/path/                       → Current combined course
│   ├── /my/progress/                   → Mastery & progress
│   ├── /my/bookmarks/                  → Saved content
│   ├── /my/notes/                      → Personal notes
│   └── /my/chat/                       → AI tutor chat
├── /console/                           → Admin/teacher (role-gated)
│   ├── /console/content/               → Content authoring
│   ├── /console/questions/             → Question bank
│   ├── /console/exams/                → Exam & syllabus management
│   ├── /console/curriculum/            → Curriculum management
│   ├── /console/chat/                  → Chat moderation
│   ├── /console/users/                 → User management
│   ├── /console/analytics/             → Analytics
│   └── /console/teachers/             → Teacher dashboard
├── /api/                               → API routes
└── /live/[id]/                         → Live class page (YouTube stream + group chat)
```

### 4.3 Domain

- **Current:** Vercel free subdomain (e.g., `snapzila-academy.vercel.app`)
- **Future:** Custom domain (TBD by user)

---

## 5. Segments Deep-Dive

### 5.1 School (Class 1–10)

**Audience:** Class 1–10 students across boards (CBSE, ICSE, State boards like MP Board).

**Content Model:**
- Organized by: Board → Class → Subject → Chapter → Concept → Lesson
- Each class has its own complete curriculum design (user's specific requirement: "हर class के लिए पूरा system design")
- Board-specific content (CBSE Class 8 Science ≠ MP Board Class 8 Science in structure, though concepts overlap)

**Goals a student can have:**
- School exam prep (board-specific)
- Olympiad (NSO, IMO, etc.)
- Scholarship (NTSE, NMMS, etc.)
- Foundation (early NEET/JEE prep — NCERT taught deeper, NOT Class 11 content)

**Combined Course Mode: Depth-Merge**
- Student: Class 8 CBSE + Class 8 NEET Foundation
- Both goals map to SAME class (Class 8), SAME concept set, different depths
- Combined path: same concepts, depth = max(school_depth, foundation_depth)
- Allen Kota model: NCERT taught deeper, not advanced content

**Class Transition:**
- When student moves Class 8 → Class 9, system:
  1. Loads Class 9 curriculum
  2. Checks which Class 9 concepts student already mastered (from prior learning)
  3. Skips mastered, focuses on new
  4. "Don't teach me twice" applied across classes

**Key Principle:** Class 8 content and Class 11 content do NOT merge. Each class is its own bubble. Combined course works WITHIN a class (depth-merge), not across classes.

### 5.2 Senior (Class 11–12 + Entrance Exams)

**Audience:** Class 11–12 students across streams (Science-Bio, Science-Math, Commerce, Arts) who are ALSO preparing for entrance exams (NEET, JEE Main, JEE Advanced, CUET) alongside their board exams.

**Why Senior is a separate segment (not part of School):**
Class 11–12 + NEET/JEE is fundamentally different from Class 1–10 + Olympiad:
1. **Dual intense goals:** Board exam (detailed written answers) + Entrance exam (speed MCQs) — both high-stakes.
2. **Same syllabus, different demands:** NEET/JEE syllabus = NCERT Class 11–12 syllabus. Same concepts, but NEET needs DEPTH + SPEED + PYQ practice, while board needs DETAILED QNA + long-form answers.
3. **Different practice modes:** Board = long-answer writing practice; NEET = timed MCQ drills (180 Qs in 180 min).
4. **Foundation → Senior continuity:** Class 8 NEET Foundation student → Class 11 Senior (NEET track). Mastery carries over ("don't teach me twice").
5. **Allen Kota model:** NCERT taught at entrance-exam depth, not separate advanced content.

**Content Model:**
- Organized by: Board → Class (11/12) → Stream → Subject → Chapter → Concept → Lesson
- Each concept has BOTH board-level depth (L2–L3) AND entrance-level depth (L3–L4)
- Question types for BOTH formats:
  - Board: long-form, short-form, diagram-based, source-based
  - Entrance: MCQ (single correct), MCQ (multiple correct), assertion-reason, numerical, matching

**Goals a student can have:**
- Class 11/12 board exam (stream-specific)
- NEET (if Science-Bio stream)
- JEE Main / JEE Advanced (if Science-Math stream)
- CUET (for central university admission)
- State CET / other entrance

**Combined Course Mode: Hybrid-Merge (the third mode)**

Student: Class 12 CBSE (Science-Bio) + NEET
- **Syllabus:** Same NCERT Biology concepts. NEET may add a few extension concepts.
- **Depth:** max(board_depth, neet_depth) = neet_depth (L3–L4).
- **Practice formats:** Board QNA (long-form) + NEET MCQ (timed) + NEET PYQs + Board PYQs.
- **Speed dimension:** NEET needs 180 questions in 180 minutes → timed speed drills.
- **Result:** ONE combined course that prepares for BOTH board + NEET simultaneously.

```
Combined Class 12 + NEET course =
  Concepts (depth = NEET level)
  + Board QNA practice (for written exam)
  + NEET MCQ practice (for entrance)
  + NEET PYQs (last 10 years)
  + Board PYQs (last 10 years)
  + Speed drills (timed MCQ sets)
  + Daily plan balancing: concept learning + board practice + NEET practice
```

**The Pitch:** "आपको board + NEET दोनों की तैयारी एक ही course में। Board के लिए detailed answers, NEET के लिए speed MCQs — सब cover।"

**Transition: School → Senior:**
- Class 10 student (with NEET Foundation goal) → Class 11 Senior (NEET track)
- System: loads Class 11 curriculum, checks mastery from Class 8–10 foundation, skips mastered, deepens to NEET level.
- Foundation mastery → Senior credit. No re-learning.

**Transition: Senior → Coaching (droppers):**
- Class 12 student didn't crack NEET → takes a drop year → joins Coaching segment
- System: carries NEET mastery forward, focuses on weak areas + advanced PYQ practice.

### 5.3 Coaching (After 12th — Competitive Exams)

**Audience:** Students preparing for government job / competitive exams after 12th.

**Exams covered (Phase 2 onwards):**
- SSC: CGL, CHSL, GD, MTS
- Railway: RRB Group D, RRB NTPC, ALP
- Police: State police (MP Police, UP Police, etc.), CAPF
- Banking: IBPS PO, Clerk, SBI PO
- UPSC: CSE Prelims (later)
- State PSC (later)
- Defence: NDA, CDS (later)
- Teaching: CTET, TET (later)

**Content Model:**
- Organized by: Exam → Subject → Topic → Concept → (Lesson + MCQ + PYQ + Mock)
- Concept = atomic unit, mapped to exams via `exam_concepts` table
- Same concept (e.g., "Indian Constitution — Fundamental Rights") maps to multiple exams

**Combined Course Mode: Syllabus-Merge**
- Student: RRB Group D + SSC GD + MP Police
- System unions all three syllabi, dedupes common concepts, sets depth = max per exam
- Result: ONE combined course, not three
- "आपको 3 course नहीं, एक combined चाहिए" — this is the killer pitch

**Exam Entity (detailed):**
```
EXAM
├── Basic Info: name, slug, conducting_body, category, frequency, description
├── Eligibility: min_education, max_age, age_relaxation, nationality, category_rules
├── Exam Pattern: sections, questions_per_section, total_marks, duration, negative_marking, mode
├── Syllabus: mapped via exam_concepts (concept_id + depth + importance)
├── Schedule: notification_date, application_start/end, exam_date, result_date
├── Languages: [hi, en, ...]
├── Related Exams: relation_type (similar/feeder/backup/parallel/progression)
├── Previous Papers: linked PYQs
└── Official Links: notification_url, website
```

**Exam Cycles:** Exam identity is permanent; cycles (SSC CGL 2026) change yearly. `exams` table = permanent identity, `exam_cycles` table = yearly instance (syllabus/pattern/dates may change).

### 5.4 College (Degree + Semester + Placement)

**Audience:** University/college students pursuing degrees (B.Tech, BSc, BA, BCom, BCA, etc.).

**Content Model:**
- Organized by: University → Degree → Program → Semester → Subject → Chapter → Concept
- Semester-based structure
- Includes: Internal exams, practicals, vivas, assignments, CGPA tracking
- Placement prep module: aptitude + coding + interview prep (for final-year students)

**Combined Course:**
- College student: B.Tech CSE Semester 3 + Placement prep
- System: semester subjects + placement aptitude/coding track
- Combined path integrates both

**Later Phase:** Full college ERP is OUT OF SCOPE. We provide learning content + progress, not college administration.

### 5.5 ITI (Trades + Workshop + Practical)

**Audience:** ITI students learning trades (Electrician, Fitter, Welder, COPA, etc.).

**Content Model:**
- Organized by: Trade → Semester → Theory/Practical → Module → Concept
- Includes: Workshop procedures, tool guides, safety protocols, practical demonstrations
- Apprenticeship information

**Content Types Unique to ITI:**
- Workshop videos (step-by-step practical demos)
- Tool reference guides
- Safety checklists
- Viva questions
- Trade-specific calculations

### 5.6 Skills (Project-Based, W3Schools Tutorials Model)

**Audience:** Anyone wanting to learn a skill (coding, Excel, digital marketing, graphic design, export-import, shop management, etc.).

**Content Model — W3Schools Style:**
- Organized by: Skill Track → Tutorial Module → Lesson → Example → Exercise
- Tutorials are browsable free (W3Schools model)
- "Try it yourself" interactive examples where applicable (coding, Excel)
- Exercises after each tutorial
- Skill track / roadmap (e.g., "Become a Web Developer" = HTML → CSS → JS → React → Projects)

**Skills Decision: Same Platform (Final)**

**Rationale:**
1. **Shared backbone:** One account, one learner profile, one knowledge graph. A college student can learn a skill alongside their degree.
2. **W3Schools tutorials model fits:** Skills content is tutorial-based — same as the platform-wide free browsing model.
3. **Cross-segment value:** A B.Tech student learning C programming in college can also do the "Skills: C Programming" track. Same content, different context.
4. **Lower infrastructure cost:** One deployment, one DB, one auth.
5. **Future extraction possible:** If Skills grows large (1000+ courses, heavy video), it can be extracted into a separate app using the same Supabase backend. Architecture supports this (clean route group, separate content tables, API isolation).

**Why NOT separate like competitors (Seekho, etc.):**
- Competitors separate because their core is different (Seekho = entertainment-style short videos, not structured learning).
- Our model is structured learning. Skills fits naturally as a segment.
- Separate app = separate account, separate progress, lost cross-segment value.
- "Extract, don't pre-split" — start unified, split only when scale demands.

**W3Schools Tutorials Model (Platform-Wide):**
- This model applies to ALL segments, not just Skills.
- All content browsable free (concepts, tutorials, questions, quizzes, mock tests).
- Enrollment adds: structured path + progress tracking + personalization + AI tutor.
- Skills segment is the purest expression of this model (tutorial-first).

### 5.6 GK (Current Affairs — Exam-Centric)

**Audience:** Everyone. GK is needed by all exam aspirants at different levels.

**Content Model:**
- Daily feed of current affairs
- Categorized: Polity, Economy, Science, Sports, International, National, Awards, Appointments, etc.
- Each item linked to: Concepts (knowledge graph) + Exams (exam relevance) + Difficulty level

**Exam-Centric Personalization:**
- RRB Group D aspirant: basic GK, high-level facts
- SSC CGL aspirant: medium depth GK
- UPSC aspirant: deep analytical GK
- Same event, different depth presentations — powered by the same underlying data

**GK is NOT a Subject — It's a Collection Layer:**
- Questions have a `subject` (Biology, Polity, etc.) and a `gk_relevance` field (None/General/High)
- GK pages are dynamic collections: `/gk/polity/` = all polity questions where gk_relevance ≠ None
- Same question pool powers: GK page, quiz, mock test, exam-specific GK

**Cross-Segment Feeding:**
- GK feeds into Coaching (exam widget: "आज का GK for SSC")
- GK feeds into School (age-appropriate current affairs)
- GK feeds into College (placement current affairs)

### 5.7 Atlas (Books Solutions)

**Audience:** Students looking for textbook solutions (NCERT, state board, reference books).

**Content Model:**
- Organized by: Book → Chapter → Exercise → Question → Solution
- Indexable pages (SEO traffic engine)
- Each solution links to: underlying concept (knowledge graph), related questions, practice

**Purpose:**
1. **SEO Traffic Magnet:** High search volume for "NCERT Class 10 Maths Chapter 1 Solutions"
2. **Lead Generation:** Atlas → School/Coaching enrollment ("Want structured learning? Enroll free")
3. **Reference:** Quick answer lookup (W3Schools-style — free, no login)

**Solution Structure:**
```
Book Solution Page:
├── Book info (title, class, board, subject)
├── Chapter info
├── Question (as in book)
├── Solution (step-by-step, Markdown + LaTeX for math)
├── Concept link (which concept this tests)
├── Related questions (practice)
└── "Learn this concept" CTA → concept page
```

---

## 6. Content Access Model (W3Schools-Style)

### 6.1 The Principle

> **ALL content is freely browsable without login. Enrollment adds structure and tracking, NOT access.**

This is the W3Schools model applied platform-wide:
- W3Schools: You can read every tutorial, try every example, without an account. Account = progress tracking + exercises + certificates.
- SnapZila Academy: You can read every concept, attempt every question, view every solution, without an account. Enrollment = combined course + progress tracking + personalization + AI tutor + daily plan.

### 6.2 What's Free (No Login)

| Content Type | Free? |
|---|---|
| Concept pages | ✅ Yes |
| Lessons / Tutorials | ✅ Yes |
| Chapters | ✅ Yes |
| MCQs / Questions | ✅ Yes (attempt + view answer) |
| Quizzes | ✅ Yes |
| Mock Tests | ✅ Yes |
| PYQs (Previous Year Questions) | ✅ Yes |
| GK Articles | ✅ Yes |
| Book Solutions (Atlas) | ✅ Yes |
| QNA / Forum | ✅ Yes (read; posting requires login) |
| Live Classes | ✅ Yes (watch; chat requires login) |

### 6.3 What Requires Login (Enrollment)

| Feature | Requires Login? | Requires Enrollment? |
|---|---|---|
| Combined Course generation | ✅ | ✅ |
| Progress tracking | ✅ | ✅ |
| Daily plan / personalized schedule | ✅ | ✅ |
| Mastery tracking | ✅ | ✅ |
| Bookmarks | ✅ | ❌ (login only) |
| Notes | ✅ | ❌ (login only) |
| AI Tutor chat | ✅ | ❌ (login only) |
| Doubt chat in chapters | ✅ | ❌ (login only) |
| QNA posting | ✅ | ❌ (login only) |
| Live class chat | ✅ | ❌ (login only) |

### 6.4 SEO Strategy

| SEO Level | Content | Indexable? |
|---|---|---|
| Level 1 — MUST INDEX | Concept pages, GK articles, Atlas solutions, exam detail pages, tutorials, chapter pages, PYQ collections | ✅ |
| Level 2 — SELECTIVELY INDEX | High-value collections (e.g., "SSC CGL Polity MCQs") | ✅ (only when genuinely differentiated) |
| Level 3 — DON'T INDEX | Personalized pages (/my/*), practice sessions, quiz attempts, bookmarks | ❌ |
| Level 4 — DEFINITELY DON'T INDEX | Combinatorial junk (exam × subject × difficulty × language × user) | ❌ |

**Canonical Page Principle:** ONE canonical page per concept (e.g., `/concept/photosynthesis/`). Multiple presentation views (School view, Coaching view, GK view) use the same canonical URL with different UI — NOT duplicate pages.

---

## 7. Database Schema (Supabase)

### 7.1 Schema Organization

PostgreSQL schemas for logical separation within ONE Supabase project:

```
supabase_project/
├── auth          (Supabase built-in — auth.users)
├── public        (profiles, console_users)
├── knowledge     (concepts, prerequisites, translations)
├── education     (boards, classes, curriculums, curriculum_concepts)
├── exams         (exams, exam_cycles, exam_concepts, eligibility, related_exams)
├── content       (content_assets, media, versions)
├── questions     (questions, collections, collection_items)
├── learning      (enrollments, learning_paths, progress, attempts)
├── chat          (rooms, messages, reactions)
├── gk            (current_events, event_concepts, event_exams)
└── console       (assignments, audit_logs, teacher_profiles)
```

### 7.2 Core Tables (Phase 1 — Must Have)

```sql
-- ============================================
-- PUBLIC SCHEMA — User & Profile
-- ============================================

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  preferred_language text default 'hi',  -- hi / en
  role text default 'learner',  -- learner / teacher / admin / content_writer
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- KNOWLEDGE SCHEMA — The Universal Graph
-- ============================================

create table knowledge.concepts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject text not null,  -- Biology / Polity / Mathematics / etc.
  domain text,  -- Science / Social Science / etc.
  summary text,
  content_json jsonb,  -- structured content (definition, key_facts, components, etc.)
  depth_layers jsonb,  -- { L1: "...", L2: "...", L3: "...", L4: "..." }
  common_misconceptions jsonb,
  status text default 'draft',  -- draft / review / published / deprecated
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table knowledge.concept_prerequisites (
  concept_id uuid references knowledge.concepts on delete cascade,
  prerequisite_id uuid references knowledge.concepts on delete cascade,
  primary key (concept_id, prerequisite_id)
);

create table knowledge.concept_translations (
  concept_id uuid references knowledge.concepts on delete cascade,
  language text not null,  -- hi / en / mr / bn / ta
  title text,
  content_json jsonb,
  primary key (concept_id, language)
);

-- ============================================
-- EDUCATION SCHEMA — Boards, Classes, Curriculums
-- ============================================

create table education.boards (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,  -- CBSE / ICSE / MP Board
  slug text unique not null
);

create table education.classes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references education.boards,
  name text not null,  -- "Class 8"
  level int not null,  -- 1-12
  unique (board_id, name)
);

create table education.curriculums (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references education.boards,
  class_id uuid references education.classes,
  subject text not null,  -- Science / Mathematics / etc.
  academic_year text,  -- 2025-26
  status text default 'active'
);

create table education.curriculum_concepts (
  curriculum_id uuid references education.curriculums on delete cascade,
  concept_id uuid references knowledge.concepts on delete cascade,
  depth_required int default 1,  -- 1-4 (L1-L4)
  importance text default 'medium',  -- low / medium / high
  chapter_name text,  -- which chapter this concept belongs to in this curriculum
  order_index int,
  primary key (curriculum_id, concept_id)
);

-- ============================================
-- EXAMS SCHEMA — Competitive Exams
-- ============================================

create table exams.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,  -- ssc / railway / police / banking / upsc / defence / teaching
  conducting_body text,
  description text,
  pattern_json jsonb,  -- { sections: [...], total_marks, duration, negative_marking }
  eligibility_json jsonb,  -- { min_education, max_age, age_relaxation, ... }
  languages text[] default '{hi,en}',
  official_url text,
  status text default 'active',
  created_at timestamptz default now()
);

create table exams.exam_cycles (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams.exams on delete cascade,
  cycle_name text not null,  -- "SSC CGL 2026"
  year int not null,
  notification_date date,
  application_start_date date,
  application_end_date date,
  exam_date date,
  result_date date,
  pattern_json jsonb,  -- overrides exam.pattern_json if changed this cycle
  syllabus_json jsonb,  -- overrides if changed
  vacancies int,
  status text default 'upcoming'  -- upcoming / application_open / exam_held / result_out
);

create table exams.exam_concepts (
  exam_id uuid references exams.exams on delete cascade,
  concept_id uuid references knowledge.concepts on delete cascade,
  depth_required int default 1,  -- 1-4
  importance text default 'medium',  -- low / medium / high
  subject text,  -- which subject this falls under in this exam
  primary key (exam_id, concept_id)
);

create table exams.related_exams (
  exam_id_1 uuid references exams.exams on delete cascade,
  exam_id_2 uuid references exams.exams on delete cascade,
  relation_type text not null,  -- similar / feeder / backup / parallel / progression
  primary key (exam_id_1, exam_id_2)
);

-- ============================================
-- CONTENT SCHEMA — Lessons, Media, Versions
-- ============================================

create table content.content_assets (
  id uuid primary key default gen_random_uuid(),
  type text not null,  -- lesson / tutorial / note / slide / diagram / article
  title text not null,
  slug text unique not null,
  body_md text,  -- Markdown body
  content_json jsonb,  -- structured content (for non-prose content)
  concept_id uuid references knowledge.concepts,  -- which concept this teaches
  segment text not null,  -- school / coaching / college / iti / skills / gk / atlas
  context_id uuid,  -- polymorphic: class_id / exam_id / trade_id / skill_track_id / book_id
  author_id uuid references public.profiles,
  status text default 'draft',  -- draft / review / published / deprecated
  seo_json jsonb,  -- { title, description, canonical_url, indexable, og_image }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table content.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content.content_assets on delete cascade,
  version int not null,
  body_md text,
  content_json jsonb,
  author_id uuid references public.profiles,
  change_note text,
  created_at timestamptz default now()
);

create table content.media (
  id uuid primary key default gen_random_uuid(),
  type text not null,  -- video / image / pdf / ppt / audio
  url text not null,  -- Supabase Storage URL
  title text,
  description text,
  duration int,  -- for video/audio (seconds)
  concept_id uuid references knowledge.concepts,
  content_id uuid references content.content_assets,
  storage_path text,  -- Supabase Storage path
  created_at timestamptz default now()
);

-- ============================================
-- QUESTIONS SCHEMA — MCQs, PYQs, Collections
-- ============================================

create table questions.questions (
  id uuid primary key default gen_random_uuid(),
  type text not null,  -- mcq / numerical / truefalse / short / long / assertion_reason / match
  body text not null,  -- question text (Markdown)
  body_json jsonb,  -- structured question (for match, assertion-reason, etc.)
  options_json jsonb,  -- [{ key: "A", text: "..." }, ...]
  correct_answer jsonb,  -- "A" or ["A","C"] or "text"
  explanation text,  -- Markdown explanation
  concept_id uuid references knowledge.concepts,
  difficulty int default 2,  -- 1-5
  exam_format text default 'any',  -- board / competitive / both / any (determines practice type)
  time_recommended int,  -- recommended solve time in seconds (for speed drills)
  marks int,  -- marks for this question (for board long-form: 5/3/2; for MCQ: 4/1)
  source text,  -- pyq / custom / book
  source_ref text,  -- "SSC CGL 2023 Shift 1" or "NCERT Class 10 Ex 1.1 Q2" or "CBSE Board 2023 Q5"
  exam_id uuid references exams.exams,  -- if PYQ (entrance exam)
  board_ref text,  -- if board PYQ: "CBSE Class 12 2023" or "MP Board 2022"
  exam_year int,
  gk_relevance text default 'none',  -- none / general / high
  status text default 'draft',  -- draft / review / published
  created_at timestamptz default now()
);

create table questions.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null,  -- gk / exam_set / chapter_set / mock_test / quiz
  description text,
  seo_json jsonb,  -- { title, description, h1, intro_content, faq_content }
  status text default 'published',
  created_at timestamptz default now()
);

create table questions.collection_items (
  collection_id uuid references questions.collections on delete cascade,
  question_id uuid references questions.questions on delete cascade,
  order_index int,
  primary key (collection_id, question_id)
);

-- ============================================
-- LEARNING SCHEMA — Enrollment, Paths, Progress
-- ============================================

create table learning.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  segment text not null,  -- school / coaching / college / iti / skills
  target_type text not null,  -- class / exam / trade / skill_track
  target_id uuid not null,  -- class_id / exam_id / trade_id / skill_track_id
  status text default 'active',  -- active / paused / completed / abandoned
  priority int default 1,  -- for multi-goal weighting (e.g., SSC=2, RRB=1)
  enrolled_at timestamptz default now()
);

create table learning.learning_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  path_json jsonb not null,  -- { concepts: [...], ordered, with depth + priority }
  version int default 1,
  status text default 'active',
  generated_at timestamptz default now(),
  recomputed_at timestamptz
);

create table learning.progress (
  user_id uuid references public.profiles on delete cascade,
  concept_id uuid references knowledge.concepts on delete cascade,
  mastery int default 0,  -- 0-100
  status text default 'not_started',  -- not_started / learning / understood / practiced / mastered / needs_revision
  attempts_count int default 0,
  correct_count int default 0,
  last_reviewed timestamptz,
  next_review_date timestamptz,  -- spaced repetition
  primary key (user_id, concept_id)
);

create table learning.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  question_id uuid references questions.questions on delete cascade,
  user_answer jsonb,
  is_correct boolean,
  time_taken int,  -- seconds
  created_at timestamptz default now()
);

create table learning.bookmarks (
  user_id uuid references public.profiles on delete cascade,
  content_id uuid references content.content_assets on delete cascade,
  note text,
  created_at timestamptz default now(),
  primary key (user_id, content_id)
);

create table learning.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  content_id uuid references content.content_assets on delete cascade,
  body text,  -- user's personal note on this content
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CHAT SCHEMA — Unified Chat System
-- ============================================

create table chat.rooms (
  id uuid primary key default gen_random_uuid(),
  type text not null,  -- chapter_doubt / live_class / ai_tutor / qna
  context_type text,  -- concept / content / live_class / none
  context_id uuid,  -- concept_id / content_id / live_class_id
  title text,
  created_at timestamptz default now()
);

create table chat.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references chat.rooms on delete cascade,
  user_id uuid references public.profiles,  -- null if AI
  sender_type text not null,  -- user / teacher / ai / system
  body text not null,  -- Markdown
  attachments_json jsonb,  -- [{ type: "image", url: "..." }]
  reply_to uuid references chat.messages,  -- threaded replies
  is_pinned boolean default false,
  is_best_answer boolean default false,
  upvotes int default 0,
  created_at timestamptz default now()
);

create table chat.message_reactions (
  message_id uuid references chat.messages on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  reaction text not null,  -- emoji or type
  primary key (message_id, user_id, reaction)
);

-- ============================================
-- GK SCHEMA — Current Affairs
-- ============================================

create table gk.current_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  body_md text not null,
  category text not null,  -- polity / economy / science / sports / international / national / awards / appointments
  event_date date not null,
  source_url text,
  source_name text,
  gk_relevance text default 'general',  -- none / general / high
  seo_json jsonb,
  status text default 'published',
  created_at timestamptz default now()
);

create table gk.event_concepts (
  event_id uuid references gk.current_events on delete cascade,
  concept_id uuid references knowledge.concepts on delete cascade,
  primary key (event_id, concept_id)
);

create table gk.event_exams (
  event_id uuid references gk.current_events on delete cascade,
  exam_id uuid references exams.exams on delete cascade,
  relevance text default 'general',  -- low / medium / high
  primary key (event_id, exam_id)
);

-- ============================================
-- CONSOLE SCHEMA — Admin & Teacher
-- ============================================

create table console.teacher_profiles (
  user_id uuid references public.profiles primary key,
  expertise text[],  -- ["Polity", "History"]
  segments text[],  -- ["coaching", "school"]
  bio text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table console.content_assignments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content.content_assets,
  assigned_to uuid references public.profiles,
  assigned_by uuid references public.profiles,
  status text default 'assigned',  -- assigned / in_progress / submitted / approved / rejected
  due_date date,
  created_at timestamptz default now()
);

create table console.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles,
  action text not null,  -- create / update / delete / publish
  entity_type text,  -- concept / content / question / exam / ...
  entity_id uuid,
  changes_json jsonb,
  created_at timestamptz default now()
);
```

### 7.3 RLS (Row Level Security) Strategy

```sql
-- Public content: readable by everyone (anonymous included)
alter table content.content_assets enable row level security;
create policy "Public can read published content"
  on content.content_assets for select
  using (status = 'published');

alter table questions.questions enable row level security;
create policy "Public can read published questions"
  on questions.questions for select
  using (status = 'published');

-- User's own data: readable only by owner
alter table learning.progress enable row level security;
create policy "Users read own progress"
  on learning.progress for select
  using (auth.uid() = user_id);
create policy "Users update own progress"
  on learning.progress for update
  using (auth.uid() = user_id);

-- Console tables: only staff can write
alter table console.audit_logs enable row level security;
create policy "Staff can read audit logs"
  on console.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'teacher')
    )
  );

-- (Similar RLS policies for all tables — write during Phase 1)
```

### 7.4 Edge Functions (For Complex Logic)

| Function | Purpose |
|---|---|
| `generate-combined-course` | Combined course engine (both modes) |
| `schedule-spaced-repetition` | Daily revision scheduling |
| `ai-tutor-response` | AI tutor chat (LLM integration) |
| `ai-doubt-response` | AI doubt solving in chapter chat |
| `generate-mock-test` | Adaptive mock test generation |
| `compute-exam-readiness` | Exam readiness score calculation |

---

## 8. Combined Course Engine

### 8.1 Three Modes

| Mode | Segment | What It Does | Example |
|---|---|---|---|
| **Depth-Merge** | School | Same class, same concepts, deeper depth for foundation goals | Class 8 CBSE + Class 8 NEET Foundation = same NCERT, taught deeper |
| **Hybrid-Merge** | Senior | Same syllabus (board + entrance), merge depth + practice formats + speed + PYQs | Class 12 CBSE Bio + NEET = one course, board QNA + NEET MCQ + speed drills |
| **Syllabus-Merge** | Coaching | Different exams, different syllabi, union + dedupe | RRB Group D + SSC GD + MP Police = one combined course |

### 8.2 Depth-Merge Algorithm (School)

```typescript
// For student with goals: [Class 8 CBSE, Class 8 NEET Foundation]
// Both map to same class level (8), so same concept set, different depths

async function depthMergeCombinedCourse(userId: string, goals: Goal[]) {
  // 1. Get all curriculum_concepts for all goals (same class)
  const curriculumIds = goals.map(g => g.curriculum_id);
  const { data: concepts } = await supabase
    .from('education.curriculum_concepts')
    .select('concept_id, depth_required, importance, chapter_name, order_index')
    .in('curriculum_id', curriculumIds);

  // 2. Merge: same concept → take MAX depth
  const mergedConcepts = mergeByMaxDepth(concepts);

  // 3. Subtract already-mastered
  const { data: mastered } = await supabase
    .from('learning.progress')
    .select('concept_id')
    .eq('user_id', userId)
    .gte('mastery', 80);
  const pending = subtractMastered(mergedConcepts, mastered);

  // 4. Add prerequisites recursively
  const withPrereqs = await addPrerequisites(pending);

  // 5. Sort by chapter order (within same class, order matters)
  const sorted = sortByChapterOrder(withPrereqs);

  // 6. Schedule into daily plan
  const dailyPlan = scheduleDaily(sorted, userId);

  // 7. Cache as learning_path
  await saveLearningPath(userId, sorted, dailyPlan);

  return { concepts: sorted, dailyPlan };
}
```

### 8.3 Hybrid-Merge Algorithm (Senior — Class 11–12 + Entrance)

```typescript
// For student with goals: [Class 12 CBSE Science-Bio, NEET]
// Same NCERT syllabus, but NEET needs deeper depth + speed + PYQs
// Board needs detailed QNA. Merge ALL practice dimensions.

async function hybridMergeCombinedCourse(userId: string, goals: Goal[]) {
  const curriculumId = goals.find(g => g.type === 'class')?.curriculum_id;
  const entranceExamIds = goals.filter(g => g.type === 'exam').map(g => g.exam_id);

  // 1. Get curriculum concepts (board syllabus)
  const { data: boardConcepts } = await supabase
    .from('education.curriculum_concepts')
    .select('concept_id, depth_required, importance, chapter_name, order_index')
    .eq('curriculum_id', curriculumId);

  // 2. Get entrance exam concepts (NEET/JEE syllabus — mostly same NCERT + extensions)
  const { data: entranceConcepts } = await supabase
    .from('exams.exam_concepts')
    .select('concept_id, depth_required, importance, subject, exam_id')
    .in('exam_id', entranceExamIds);

  // 3. Merge concepts: union (board ∪ entrance), depth = MAX per concept
  const mergedConcepts = mergeByMaxDepthAcrossBoardAndEntrance(boardConcepts, entranceConcepts);
  // Result: same NCERT concepts at NEET depth + any extra entrance-only concepts

  // 4. Subtract already-mastered (carries from Class 8-10 foundation!)
  const { data: mastered } = await supabase
    .from('learning.progress')
    .select('concept_id')
    .eq('user_id', userId)
    .gte('mastery', 80);
  const pending = subtractMastered(mergedConcepts, mastered);

  // 5. Add prerequisites recursively
  const withPrereqs = await addPrerequisites(pending);

  // 6. Sort by chapter order (board curriculum order)
  const sorted = sortByChapterOrder(withPrereqs);

  // 7. Assemble PRACTICE LAYERS (this is what makes it hybrid):
  //    For each concept, gather:
  //    a) Board QNA questions (long-form, short-form, diagram-based)
  //    b) Entrance MCQ questions (single correct, multiple correct, assertion-reason)
  //    c) Board PYQs (last 10 years)
  //    d) Entrance PYQs (NEET/JEE last 10 years)
  //    e) Speed drill sets (timed MCQ batches)
  const practiceLayers = await assemblePracticeLayers(sorted, {
    boardCurriculumId: curriculumId,
    entranceExamIds,
  });

  // 8. Schedule daily plan: balance concept learning + board practice + entrance practice + speed
  const dailyPlan = scheduleHybridDaily(sorted, practiceLayers, userId, entranceExamIds);
  // e.g., Day plan: 2 new concepts (board+entrance depth) + 1 board QNA practice + 1 NEET MCQ set + 15-min speed drill

  // 9. Cache as learning_path
  await saveLearningPath(userId, sorted, dailyPlan, practiceLayers, 'hybrid-merge');

  return { concepts: sorted, practiceLayers, dailyPlan };
}
```

**Key difference from Depth-Merge:**
- Depth-Merge (School): only merges DEPTH. One practice format per concept.
- Hybrid-Merge (Senior): merges DEPTH + PRACTICE FORMATS (board QNA + entrance MCQ) + SPEED DRILLS + BOTH PYQs. Multiple practice layers per concept.

**Daily Plan Structure (Senior Hybrid):**
```
Day plan for Class 12 + NEET student:
  - Learn: Photosynthesis at L4 depth (NEET level)  [30 min]
  - Board Practice: Write long-form answer on Photosynthesis  [20 min]
  - NEET Practice: 20 MCQs on Photosynthesis (timed)  [15 min]
  - Speed Drill: 30 rapid MCQs (mixed topics, timed)  [10 min]
  - Revision: Spaced repetition items for today  [15 min]
  Total: ~90 min
```

### 8.4 Syllabus-Merge Algorithm (Coaching)

```typescript
// For student with goals: [RRB Group D, SSC GD, MP Police]
// Different exams, different syllabi — union them

async function syllabusMergeCombinedCourse(userId: string, examIds: string[]) {
  // 1. Get all exam_concepts for all selected exams
  const { data: concepts } = await supabase
    .from('exams.exam_concepts')
    .select('concept_id, depth_required, importance, subject, exam_id')
    .in('exam_id', examIds);

  // 2. Union + dedupe: same concept → take MAX depth + MAX importance
  const unioned = unionByMaxDepthAndImportance(concepts);

  // 3. Compute overlap stats (for the "72% common" pitch)
  const overlapStats = computeOverlap(concepts, examIds);

  // 4. Subtract already-mastered
  const { data: mastered } = await supabase
    .from('learning.progress')
    .select('concept_id')
    .eq('user_id', userId)
    .gte('mastery', 80);
  const pending = subtractMastered(unioned, mastered);

  // 5. Add prerequisites recursively
  const withPrereqs = await addPrerequisites(pending);

  // 6. Topological sort by prerequisite graph
  const sorted = topologicalSort(withPrereqs);

  // 7. Priority rank: exam_weight × goal_priority × gap × recency × importance
  const ranked = priorityRank(sorted, userId, examIds);

  // 8. Schedule into daily plan (based on exam dates, available time/day)
  const dailyPlan = scheduleDaily(ranked, userId, examIds);

  // 9. Cache as learning_path
  await saveLearningPath(userId, ranked, dailyPlan, overlapStats);

  return { concepts: ranked, dailyPlan, overlapStats };
}
```

### 8.5 Priority Score Formula

```
Priority Score = 
  (Exam Weight × 0.30) +        // how important is this exam to user
  (Goal Priority × 0.20) +       // user's priority for this goal
  (Knowledge Gap × 0.25) +       // how far from mastery
  (Recency × 0.10) +             // how recently tested in exams
  (Importance × 0.15)            // concept importance for exam
```

### 8.6 "Don't Teach Me Twice" Feature

When a student adds a new goal (exam/class):
1. System loads the new goal's concepts.
2. Checks `learning.progress` — which concepts are already mastered?
3. Skips mastered concepts (or offers a quick diagnostic to verify).
4. Only adds the DELTA (new concepts + deeper depth for existing).
5. Updates `learning_paths` with the new combined course.

**Example:**
- Student mastered "Fundamental Rights" at L2 for SSC.
- Adds UPSC as a goal → UPSC needs "Fundamental Rights" at L4.
- System doesn't re-teach L1-L2. It shows: "You know L1-L2. Continue from L3 (Judicial Interpretation) for UPSC."

### 8.7 Daily Plan Auto-Rewiring

Based on exam dates, the plan auto-adjusts:
```
180 days to exam → Learning mode (cover syllabus)
90 days          → Coverage + Practice mode
60 days          → Practice + Revision mode
30 days          → Exam mode (mock tests + revision)
7 days           → Ultra-revision mode (key facts + weak areas)
1 day            → Light revision (confidence boost)
```

If exam date changes → plan recomputes automatically.

---

## 9. Chat System (Unified)

### 9.1 Design Principle

> **ONE chat component, ONE backend service, FOUR contexts. Not four separate chat systems.**

The user's explicit requirement: "अलग अलग system नहीं बनाना unified रखना और एक ही ui से chat वाला काम करे"

### 9.2 Four Chat Contexts (One Component, Different Modes)

| Context | Where | Real-time? | AI? | Teacher? | Persisted? |
|---|---|---|---|---|---|
| **Chapter Doubt Chat** | Embedded in lesson/concept page | ✅ (Socket.io) | ✅ (auto-reply if no teacher) | ✅ (when online) | ✅ |
| **Live Class Group Chat** | `/live/[id]` during YouTube stream | ✅ (Socket.io) | ❌ | ✅ (moderator) | ✅ (ephemeral-ish) |
| **AI Tutor** | `/my/chat` | ❌ (request-response) | ✅ (always) | ❌ | ✅ |
| **QNA Forum** | QNA pages (persistent threads) | ❌ (async) | ✅ (assists) | ✅ | ✅ |

### 9.3 Unified Chat Component

```typescript
// components/chat/ChatRoom.tsx
// ONE component, adapts based on `mode` prop

interface ChatRoomProps {
  mode: 'chapter_doubt' | 'live_class' | 'ai_tutor' | 'qna';
  roomId: string;
  contextType?: 'concept' | 'content' | 'live_class';
  contextId?: string;
}

// The component renders differently based on mode:
// - chapter_doubt: threaded, AI auto-reply, teacher can pin best answer
// - live_class: fast-flowing, emoji reactions, slow mode, moderator pin
// - ai_tutor: 1-on-1 with AI, context-aware (knows user's progress)
// - qna: persistent, upvote/downvote, best answer marking
```

### 9.4 Backend Architecture

```
┌─────────────────────────────────────────────┐
│  CHAT BACKEND (Unified)                      │
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │  Supabase        │  │  Socket.io       │   │
│  │  (Persistence)   │  │  Mini-service    │   │
│  │                  │  │  (Real-time)     │   │
│  │  - chat.rooms    │  │                  │   │
│  │  - chat.messages │  │  - live class    │   │
│  │  - reactions     │  │  - doubt chat    │   │
│  │                  │  │  - typing ind.   │   │
│  │  RLS: own msgs   │  │  - presence     │   │
│  └─────────────────┘  └─────────────────┘   │
│           ↕                    ↕             │
│  ┌──────────────────────────────────────┐    │
│  │  z-ai-web-dev-sdk (LLM)              │    │
│  │  - AI doubt responses                │    │
│  │  - AI tutor (context-aware)          │    │
│  │  - AI QNA assistance                 │    │
│  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### 9.5 Socket.io Mini-Service

```
mini-services/chat-service/
├── index.ts          # Socket.io server (port 3001)
├── package.json
└── rooms.ts          # Room management logic
```

**Frontend connects via:**
```typescript
// Gateway pattern (per environment rules):
import { io } from 'socket.io-client';
const socket = io('/?XTransformPort=3001');
// NOT: io('http://localhost:3001') — gateway handles routing
```

### 9.6 AI Integration (z-ai-web-dev-sdk)

**AI Doubt Response (in chapter chat):**
```typescript
// When a student asks a doubt in a chapter:
// 1. If a teacher is online → notify teacher, wait for response
// 2. If no teacher responds within 30s → AI responds
// 3. AI response is marked as "AI-generated" (transparency)
// 4. Teacher can later review and add to/correct AI response

async function aiDoubtResponse(roomId: string, doubt: string, conceptId: string) {
  // Get concept context for AI
  const concept = await getConcept(conceptId);
  const prompt = `
    Student is learning: ${concept.title}
    Concept summary: ${concept.summary}
    Student's doubt: ${doubt}
    
    Respond helpfully in ${user.preferred_language}. 
    Be concise. If you don't know, say so.
  `;
  const response = await zai.chat.completions.create({ prompt });
  return saveAndBroadcast(roomId, response, sender_type: 'ai');
}
```

**AI Tutor (context-aware):**
- Knows student's enrolled goals, progress, weak areas.
- Can pull relevant content and explain.
- Can generate quick quizzes.
- Can schedule revision.

### 9.7 Chat Features (All Contexts)

| Feature | Chapter Doubt | Live Class | AI Tutor | QNA |
|---|---|---|---|---|
| Text messages | ✅ | ✅ | ✅ | ✅ |
| Image attachments | ✅ | ✅ | ❌ | ✅ |
| Threaded replies | ✅ | ❌ | ❌ | ✅ |
| Emoji reactions | ✅ | ✅ | ❌ | ✅ |
| Pin message | ✅ (teacher) | ✅ (moderator) | ❌ | ✅ |
| Best answer | ✅ (teacher) | ❌ | ❌ | ✅ |
| Typing indicator | ✅ | ✅ | ❌ | ❌ |
| Slow mode | ❌ | ✅ | ❌ | ❌ |
| AI auto-reply | ✅ (if no teacher) | ❌ | ✅ (always) | ✅ (assist) |
| Upvote/downvote | ❌ | ❌ | ❌ | ✅ |

---

## 10. Console (Admin & Teacher Dashboard)

### 10.1 Purpose

> **कंपनी के सभी काम और management के लिए console के अंदर सब कुछ बनाना।**

The Console is the control center for the entire platform. All company operations happen here.

### 10.2 Console Modules

| Module | Route | Purpose |
|---|---|---|
| **Content Authoring** | `/console/content` | Create/edit lessons, tutorials, articles. Rich Markdown editor + media upload. |
| **Question Bank** | `/console/questions` | Create/edit MCQs, PYQs. Bulk import. Tag to concepts/exams. |
| **Exam Management** | `/console/exams` | Add/edit exams, syllabus, patterns, cycles, eligibility, related exams. |
| **Curriculum Management** | `/console/curriculum` | Manage boards, classes, subjects, curriculum-concept mappings. |
| **Concept Graph** | `/console/concepts` | Manage concepts, prerequisites, depth layers, translations. |
| **GK Management** | `/console/gk` | Publish current affairs, tag to concepts/exams. |
| **Atlas (Books)** | `/console/atlas` | Manage books, chapters, solutions. |
| **Chat Moderation** | `/console/chat` | Review doubts, flag inappropriate content, teacher response queue. |
| **User Management** | `/console/users` | View/manage users, roles, enrollments. |
| **Teacher Dashboard** | `/console/teachers` | Teacher profiles, assignments, performance. |
| **Analytics** | `/console/analytics` | Platform analytics — content performance, user engagement, learning outcomes. |
| **Live Classes** | `/console/live` | Schedule live classes, manage YouTube streams, chat moderation. |
| **Audit Logs** | `/console/audit` | All changes tracked. |
| **Settings** | `/console/settings` | Platform configuration, SEO settings, feature flags. |

### 10.3 Content Authoring Tool

Rich editor for creating structured content:
- **Markdown editor** (@mdxeditor/editor) — for prose content
- **Structured content editor** — for concept depth layers, key facts, components
- **Media upload** — video, image, PDF, PPT (stored in Supabase Storage)
- **Live preview** — see how content renders on mobile/desktop
- **SEO fields** — meta title, description, canonical URL, indexable flag
- **Versioning** — every save creates a version, can rollback
- **Workflow** — Draft → Review → Published → Updated → Deprecated

**Media Support (progressive — add later):**
- Lessons start with text only.
- Add video embed/upload later.
- Add graphics/images later.
- Add PPT/slides later.
- All media types stored in `content.media` table, linked to content.

### 10.4 Teacher Dashboard

Separate view within console for teachers:
- **Assigned content** — what content they need to create/review
- **Doubt queue** — student doubts awaiting their response (chapter chat)
- **Live class schedule** — their upcoming live classes
- **Performance** — their content's engagement, student outcomes
- **Students** — students enrolled in their subjects (progress overview)

### 10.5 Role-Based Access

| Role | Can Access |
|---|---|
| `learner` | Public content + /my dashboard |
| `content_writer` | Console → Content Authoring (own assignments) + Question Bank (create) |
| `teacher` | Console → Content + Questions + Doubt Queue + Live Classes + Teacher Dashboard |
| `admin` | Full Console access (all modules) |

---

## 11. Design System

### 11.1 Principles

| Principle | Implementation |
|---|---|
| **Mobile-First** | Every component designed for mobile first, enhanced for desktop. Touch targets min 44px. |
| **World-Class Aesthetic** | Inspired by Linear, Notion, Vercel, Duolingo. Clean, modern, fast. |
| **Accessibility (WCAG AA)** | Screen reader support, keyboard navigation, high contrast, dyslexia-friendly font option. |
| **Dark Mode** | Full dark mode support via next-themes. |
| **Fast** | Core Web Vitals green. Server components, lazy loading, optimized images. |
| **Consistent** | shadcn/ui New York style. Consistent spacing (p-4, p-6), typography, colors. |
| **No Indigo/Blue** | Per project rules. Use neutral palette + brand accent (decided later, default: emerald/teal or rose). |

### 11.2 Color System

```css
/* Tailwind CSS 4 variables */
--background: white / #0a0a0a (dark)
--foreground: #0a0a0a / white
--primary: [brand accent — TBD, suggest emerald]
--muted: neutral grays
--card: white / neutral-900
--border: neutral-200 / neutral-800
```

### 11.3 Typography

| Element | Mobile | Desktop |
|---|---|---|
| H1 | text-2xl (24px) | text-4xl (36px) |
| H2 | text-xl (20px) | text-3xl (30px) |
| Body | text-sm (14px) | text-base (16px) |
| Small | text-xs (12px) | text-sm (14px) |

Font: Inter (UI) + a serif or dyslexia-friendly option for content reading.

### 11.4 Component Standards

| Component | Standard |
|---|---|
| Cards | `p-4 sm:p-6`, rounded-xl, border, subtle shadow |
| Buttons | min-h-11 (44px touch target), rounded-lg |
| Lists | max-h-96 overflow-y-auto with custom scrollbar |
| Forms | React Hook Form + Zod, inline validation |
| Loading | Skeletons (not spinners) for content |
| Errors | Clear, actionable error messages |
| Feedback | Sonner toasts for all actions |
| Modals | shadcn Dialog, mobile bottom-sheet on small screens |
| Navigation | Bottom nav on mobile, sidebar on desktop |

### 11.5 Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| `default` | 0–639px | Mobile (portrait) |
| `sm` | 640px+ | Mobile (landscape) / small tablet |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Large desktop |

### 11.6 PWA Support

- Installable (add to home screen)
- Offline mode for downloaded content
- Push notifications (later)

---

## 12. Next-Gen Features

### 12.1 Features to Build (Prioritized)

| # | Feature | Description | Phase |
|---|---|---|---|
| 1 | **Combined Course Engine** | The killer feature. Two modes: depth-merge (school) + syllabus-merge (coaching). | Phase 1-2 |
| 2 | **AI Study Companion** | Personal AI tutor that knows your progress, weak areas, learning style. Context-aware chat. | Phase 2 |
| 3 | **Spaced Repetition Engine** | Smart revision scheduling based on forgetting curve. `next_review_date` in progress table. | Phase 2 |
| 4 | **Unified Chat System** | One chat component, four contexts (doubt, live, AI, QNA). | Phase 2 |
| 5 | **Exam Readiness Score** | Real-time prediction of exam readiness based on mastery + time left + practice. | Phase 2 |
| 6 | **Knowledge Graph Navigator** | Visual map of concepts and connections. Explore by clicking nodes. | Phase 3 |
| 7 | **Adaptive Mock Tests** | Difficulty adjusts real-time based on performance. | Phase 3 |
| 8 | **Personalized Daily Capsule** | AI-curated daily plan: learn X new + revise Y + practice Z. | Phase 2 |
| 9 | **Doubt Wall** | Chapter-specific doubt feed. Students help each other + AI + teachers. Upvote best answers. | Phase 2 |
| 10 | **Cross-Segment Pathways** | "Start here, end there" — Class 8 → NEET → Doctor career path visualization. | Phase 3 |
| 11 | **Collaborative Notes** | Students annotate content, share notes with peers/study groups. | Phase 4 |
| 12 | **Voice Mode** | Ask questions by voice, get audio explanations. For accessibility + mobile. | Phase 4 |
| 13 | **Smart Search** | Semantic search across all content (concepts, questions, articles, GK). | Phase 3 |
| 14 | **Performance DNA** | Deep analytics on learning patterns (visual/auditory/kinesthetic tendencies). | Phase 4 |
| 15 | **Peer Learning Groups** | Form study groups, share progress, group chat. | Phase 4 |
| 16 | **Content Quality Scoring** | Students rate content. System surfaces best content. | Phase 3 |
| 17 | **Live Class Streaming** | YouTube live + group chat + doubt queue + whiteboard. | Phase 4 |
| 18 | **Progressive Disclosure** | Content reveals depth layers based on user's goal. A Class 8 student sees L1-L2; a NEET aspirant sees L1-L4. | Phase 2 |
| 19 | **Cross-Exam Intelligence** | "You mastered Fundamental Rights for SSC — it's also needed for UPSC at L4. You're 50% there!" | Phase 2 |
| 20 | **Revision Capsule** | AI generates personalized revision sheet before exams. | Phase 3 |
| 21 | **Streak System (Light)** | Daily learning streak. Not heavy gamification — just a gentle nudge. | Phase 3 |
| 22 | **PWA / Offline Mode** | Download content for offline access. | Phase 4 |
| 23 | **Multi-language** | Hindi + English + regional (Marathi, Bengali, Tamil, etc.) via `concept_translations`. | Phase 3 |
| 24 | **Bookmark & Note System** | Bookmark any content, take inline notes. | Phase 1 |
| 25 | **Accessibility Suite** | Screen reader, dyslexia font, high contrast, voice nav. | Phase 3 |
| 26 | **Speed Practice Engine (Senior)** | Timed MCQ drills for NEET/JEE speed training. Tracks questions/min + accuracy. Builds exam-day stamina. | Phase 2 (Senior) |
| 27 | **Board QNA Practice (Senior)** | Long-form answer writing practice with model answers, marking scheme, and teacher/AI feedback. For board exam prep. | Phase 2 (Senior) |
| 28 | **Dual PYQ Engine (Senior)** | Both board PYQs + entrance PYQs in one system. Year-wise, chapter-wise, difficulty-wise filtering. | Phase 2 (Senior) |
| 29 | **Hybrid Daily Plan (Senior)** | Daily plan that balances: concept learning + board QNA practice + entrance MCQ practice + speed drills + revision. Auto-adjusts by exam proximity. | Phase 2 (Senior) |

### 12.2 Unique Differentiators (What No Competitor Does)

1. **Combined Course — THREE Modes** — Depth-merge (School foundation), Hybrid-merge (Senior board+entrance), Syllabus-merge (Coaching multi-exam). No platform offers any of these three. We offer all three.
2. **Senior Hybrid-Merge (Board + NEET/JEE in ONE course)** — Allen Kota does this offline at ₹1L+/year. We do it online, free, with AI personalization. THE Senior differentiator.
3. **Speed + Detail Dual Practice** — No platform offers both timed speed drills (for entrance) AND detailed long-form QNA practice (for boards) in one system. We do.
4. **Depth-Layered Content** — Same concept, different depth for different goals. No duplicate content. Allen Kota does this offline; nobody does it online at scale.
5. **Cross-Segment Mastery Portability** — Mastered Photosynthesis in Class 8? It counts toward NEET Foundation → Class 11 Senior → NEET. One continuous mastery journey from Class 1 to career. No platform tracks this.
6. **Exam-Centric GK** — GK personalized to exam level. All competitors publish one-size-fits-all GK.
7. **Unified Chat (Doubt + AI + Live + QNA)** — Most platforms have separate systems. We have one.
8. **W3Schools-Style Free Access + Structured Enrollment** — Most Indian edtech locks content behind paywalls. We're free to browse, structured if enrolled.

---

## 13. SEO Strategy

### 13.1 SEO-First Architecture

| Principle | Implementation |
|---|---|
| Server-rendered content | Next.js server components for all indexable pages |
| Structured data | JSON-LD for QAPage, Article, Course, FAQPage, BreadcrumbList |
| Canonical URLs | One canonical URL per concept/content, no duplicates |
| Sitemap | Auto-generated sitemap.xml from published content |
| Meta tags | Per-page SEO fields (stored in `seo_json` column) |
| Fast loading | Core Web Vitals green (LCP < 2.5s, CLS < 0.1, INP < 200ms) |

### 13.2 Indexable URL Patterns

```
/concept/[slug]/              → Concept detail (Level 1 — MUST INDEX)
/school/class/[n]/[subject]/  → Class subject page (Level 1)
/atlas/book/[slug]/[chapter]/  → Book solution page (Level 1)
/gk/[category]/                → GK category page (Level 1)
/gk/article/[slug]/            → GK article page (Level 1)
/coaching/exam/[slug]/         → Exam detail page (Level 1)
/coaching/quiz/[id]/           → Quiz page (Level 2 — selectively index)
```

### 13.3 Noindex Patterns

```
/my/*              → Personalized (Level 3)
/console/*         → Admin (Level 3)
/api/*             → API (Level 3)
/learn/*           → Personalized learning path (Level 3)
/practice/*        → Personalized practice (Level 3)
/live/*            → Live class (Level 3)
```

### 13.4 Content SEO Workflow

Every content asset has `seo_json`:
```json
{
  "title": "Photosynthesis — Class 10 Biology",
  "description": "Learn photosynthesis: definition, process, equation, factors. With MCQs and PYQs.",
  "canonical_url": "/concept/photosynthesis/",
  "indexable": true,
  "og_image": "/images/og/photosynthesis.png",
  "keywords": ["photosynthesis", "class 10 biology", "ncert solutions"],
  "structured_data": {
    "@type": "Article",
    "headline": "Photosynthesis",
    "author": { "@type": "Organization", "name": "SnapZila Academy" }
  }
}
```

---

## 14. Phase-wise Roadmap

### Phase 1: Foundation (Sessions 1–3)

**Goal:** Core platform running — auth, DB, design system, public browsing, enrollment.

| Session | Deliverable |
|---|---|
| 1 | Project setup, Supabase connection, auth, design system, home page, Vercel deploy |
| 2 | Core schemas (knowledge, content, questions), public browsing pages, W3Schools-style free access |
| 3 | Learner dashboard (/my), enrollment, progress tracking, depth-merge combined course engine |

### Phase 2: Coaching MVP (Sessions 4–6)

**Goal:** Coaching segment live with combined course killer feature + chat + console.

| Session | Deliverable |
|---|---|
| 4 | Coaching segment, exam models, syllabus-merge combined course engine, RRB+SSC sample data |
| 5 | Console: content authoring, question bank, exam management, teacher dashboard |
| 6 | Unified chat system (all 4 contexts), Socket.io mini-service, AI integration |

### Phase 3: School + Atlas + GK (Sessions 7–10)

**Goal:** School, Atlas, GK segments live. Cross-segment integration.

| Session | Deliverable |
|---|---|
| 7 | School segment (Class 8, 10, 12), depth-merge in action, foundation goals |
| 8 | Atlas (books solutions), SEO optimization, lead gen CTAs |
| 9 | GK & current affairs, exam-centric personalization, cross-segment feeding |
| 10 | Cross-segment integration, unified search, progress aggregation |

### Phase 4: College + ITI + Skills + Live Classes (Sessions 11–14)

**Goal:** All 7 segments live. Live class streaming.

| Session | Deliverable |
|---|---|
| 11 | College segment (degree, semester, placement) |
| 12 | ITI segment (trades, workshop, practical) |
| 13 | Skills segment (W3Schools tutorials model) |
| 14 | Live class streaming (YouTube + group chat), advanced chat moderation |

### Phase 5: Next-Gen Features (Sessions 15+)

**Goal:** AI study companion, spaced repetition, analytics, knowledge graph navigator, PWA, multi-language, etc.

| Session | Deliverable |
|---|---|
| 15 | AI Study Companion (context-aware tutor) |
| 16 | Spaced repetition engine, exam readiness score |
| 17 | Knowledge graph navigator, adaptive mock tests |
| 18 | Multi-language (Hindi + English), PWA / offline mode |
| 19+ | Analytics, peer groups, voice mode, etc. |

---

## 15. Session-wise Breakdown (Detailed)

> Each session = one development work session (one chat/day). After each session: update worklog → git push → DB migrations (if any) → verify deployment.

### Session 1: Project Foundation

**Objective:** Get a live site with auth and design system.

**Tasks:**
1. Create new Next.js 16 project (or use current sandbox as base).
2. Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, shadcn/ui components.
3. Set up Supabase client (`lib/supabase/client.ts` for browser, `lib/supabase/server.ts` for server).
4. Implement auth: signup, login, logout, session management (Supabase Auth).
5. Create base layout: Header (logo, nav, auth buttons), Footer (sticky bottom), main content area.
6. Set up design system: Tailwind 4 config, shadcn/ui theme, dark mode (next-themes), brand colors.
7. Create home page: Hero + segment navigation cards (School, Coaching, College, ITI, Skills, GK, Atlas) + search bar.
8. Deploy to Vercel (free subdomain).

**Deliverable:** Live site at `[subdomain].vercel.app` with working auth + home page + design system.

**Files created:**
```
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
app/layout.tsx
app/page.tsx
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
components/site-header.tsx
components/site-footer.tsx
```

---

### Session 2: Core Data Models & Public Browsing

**Objective:** Content is browsable free (W3Schools model). No login to read.

**Tasks:**
1. Create Supabase schemas: `knowledge`, `content`, `questions`.
2. Run SQL migrations for all Phase 1 tables.
3. Set up RLS: published content readable by everyone.
4. Create console (basic): add a few sample concepts, content, questions via SQL or simple admin page.
5. Build public pages:
   - `/concept/[slug]` — concept detail page (renders depth_layers, content, questions)
   - `/school` — school segment home
   - `/coaching` — coaching segment home
   - `/gk` — GK home (list of current events)
   - `/atlas` — atlas home
6. Build question practice: inline MCQ attempt with answer reveal (no login needed).
7. Seed data: 5 concepts, 10 content assets, 20 questions.

**Deliverable:** Can browse concepts, read content, attempt questions — all without login. W3Schools model working.

**Files created:**
```
supabase/migrations/001_knowledge.sql
supabase/migrations/002_content.sql
supabase/migrations/003_questions.sql
supabase/migrations/004_rls.sql
app/concept/[slug]/page.tsx
app/school/page.tsx
app/coaching/page.tsx
app/gk/page.tsx
app/atlas/page.tsx
components/concept-view.tsx
components/question-practice.tsx
lib/queries/concepts.ts
lib/queries/questions.ts
```

---

### Session 3: Learner Dashboard & Enrollment

**Objective:** Students can enroll, get combined course, track progress.

**Tasks:**
1. Create Supabase schemas: `learning`, `education`, `exams`.
2. Implement enrollment: student selects goals (class/exam), creates enrollment.
3. Build `/my` dashboard: goals, continue learning, progress overview, bookmarks, notes.
4. Implement depth-merge combined course engine (Edge Function).
5. Implement progress tracking: mark concept as learning/understood/mastered.
6. Implement bookmarks and notes.
7. Seed: 2 curriculums (Class 8 CBSE + Class 8 NEET Foundation), map concepts.

**Deliverable:** Student can enroll in Class 8 CBSE + NEET Foundation, get combined course (depth-merged), track progress.

**Files created:**
```
supabase/migrations/005_learning.sql
supabase/migrations/006_education.sql
supabase/migrations/007_exams.sql
supabase/functions/generate-combined-course/index.ts
app/my/page.tsx
app/my/goals/page.tsx
app/my/path/page.tsx
app/my/progress/page.tsx
app/my/bookmarks/page.tsx
app/my/notes/page.tsx
components/enrollment-flow.tsx
components/progress-tracker.tsx
lib/combined-course/depth-merge.ts
```

---

### Session 4: Coaching Segment + Syllabus-Merge Engine

**Objective:** Coaching MVP with combined course killer feature.

**Tasks:**
1. Seed exam data: RRB Group D, SSC GD, MP Police (basic info + syllabus mapping).
2. Map ~60 concepts to these 3 exams via `exam_concepts`.
3. Implement syllabus-merge combined course engine (Edge Function).
4. Build coaching pages:
   - `/coaching/exam/[slug]` — exam detail (info, syllabus, pattern, related exams)
   - `/coaching/combined` — combined course view (shows overlap stats, combined path)
5. Build the "pitch moment": student selects RRB + SSC + Police → sees "72% common, 16% SSC-specific, 7% RRB, 5% Police — you need ONE course, not three."
6. Implement "don't teach me twice": adding a new exam skips mastered concepts.

**Deliverable:** Coaching MVP. Student selects multiple exams → gets ONE combined course with overlap stats. THE killer feature.

**Files created:**
```
supabase/seed/exams-coaching.sql
supabase/functions/generate-combined-course/syllabus-merge.ts
app/coaching/exam/[slug]/page.tsx
app/coaching/combined/page.tsx
components/exam-selector.tsx
components/combined-course-view.tsx
components/overlap-stats.tsx
lib/combined-course/syllabus-merge.ts
```

---

### Session 5: Console (Content Authoring + Management)

**Objective:** Teachers/admins can create and manage all content.

**Tasks:**
1. Build console layout: sidebar nav, role-gated access.
2. Content authoring tool: rich Markdown editor (@mdxeditor), media upload (Supabase Storage), SEO fields, versioning.
3. Question bank: create/edit MCQs, bulk import (CSV), tag to concepts/exams.
4. Exam management: add/edit exams, syllabus mapping, cycles, related exams.
5. Curriculum management: boards, classes, subjects, curriculum-concept mapping.
6. Concept graph management: concepts, prerequisites, depth layers, translations.
7. Teacher dashboard: assignments, doubt queue (placeholder), performance.
8. Audit logging for all changes.

**Deliverable:** Full console. Teachers can create/manage all content without touching SQL.

**Files created:**
```
app/console/layout.tsx
app/console/page.tsx (dashboard)
app/console/content/page.tsx
app/console/content/[id]/edit/page.tsx
app/console/questions/page.tsx
app/console/exams/page.tsx
app/console/curriculum/page.tsx
app/console/concepts/page.tsx
app/console/teachers/page.tsx
app/console/audit/page.tsx
components/console/sidebar.tsx
components/console/content-editor.tsx
components/console/question-editor.tsx
components/console/exam-editor.tsx
lib/console/rbac.ts
```

---

### Session 6: Unified Chat System

**Objective:** One chat component, four contexts, working end-to-end.

**Tasks:**
1. Create Supabase schema: `chat`.
2. Create Socket.io mini-service (`mini-services/chat-service/`, port 3001).
3. Build unified ChatRoom component (adapts by mode).
4. Implement Chapter Doubt Chat: embedded in concept/content page, AI auto-reply, teacher can respond.
5. Implement AI Tutor: `/my/chat`, context-aware (knows user's goals/progress), z-ai-web-dev-sdk.
6. Implement QNA Forum: persistent threads, upvote, best answer.
7. Implement Live Class Chat (placeholder — full live class in Session 14).
8. AI integration: z-ai-web-dev-sdk for doubt responses + AI tutor.

**Deliverable:** Working chat in chapters + AI tutor + QNA forum. One UI, one backend.

**Files created:**
```
supabase/migrations/008_chat.sql
mini-services/chat-service/index.ts
mini-services/chat-service/package.json
app/api/chat/route.ts
components/chat/chat-room.tsx
components/chat/chat-message.tsx
components/chat/chat-input.tsx
components/chat/ai-tutor.tsx
app/my/chat/page.tsx
app/qna/page.tsx
app/qna/[id]/page.tsx
lib/chat/context.ts
lib/ai/doubt-response.ts
lib/ai/tutor.ts
```

---

### Session 7: School Segment

**Objective:** School segment functional for Class 8, 10 (Class 1–10 scope).

**Tasks:**
1. Seed curriculum data: CBSE Class 8, 10 (Science, Math, Social Science).
2. Seed ~40 concepts per class, mapped to curriculums with depth levels.
3. Build school pages:
   - `/school` — school home (class selector, Class 1–10)
   - `/school/class/[n]` — class page (subjects list)
   - `/school/class/[n]/[subject]` — subject page (chapters)
   - `/school/class/[n]/[subject]/[chapter]` — chapter page (concepts list + content)
4. Implement goal options: school exam, olympiad, scholarship, foundation (NEET/JEE Foundation).
5. Demonstrate depth-merge: Class 8 CBSE + Class 8 NEET Foundation → combined course.
6. Cross-class transition demo: Class 8 → Class 9 (mastery carries over).

**Deliverable:** School segment live. Student can browse Class 8/10, enroll, get combined course (depth-merge).

---

### Session 7b: Senior Segment (Class 11–12 + NEET/JEE)

**Objective:** Senior segment functional — board + entrance combined course (hybrid-merge).

**Tasks:**
1. Seed curriculum data: CBSE Class 11, 12 (Physics, Chemistry, Biology, Mathematics).
2. Seed entrance exam data: NEET, JEE Main (basic info + syllabus mapping to concepts).
3. Map ~60 Class 11–12 concepts to BOTH board curriculum AND entrance exams (with different depth levels).
4. Seed question types for BOTH formats:
   - Board QNA: long-form (5-mark), short-form (3-mark), very-short (2-mark), diagram-based, source-based
   - Entrance MCQ: single correct, multiple correct, assertion-reason, numerical
   - PYQs: NEET last 5 years + CBSE Board last 5 years (sample)
5. Build Senior pages:
   - `/senior` — Senior home (class + stream selector: Science-Bio, Science-Math, Commerce, Arts)
   - `/senior/class/[12]` — class page (subjects, with entrance exam options)
   - `/senior/exam/[slug]` — entrance exam detail (NEET/JEE: pattern, syllabus, PYQs)
   - `/senior/practice/[type]` — practice pages (board-qna / neet-mcq / speed-drill / pyq)
6. Implement hybrid-merge combined course engine (Edge Function).
7. Demonstrate: Class 12 CBSE Bio + NEET → ONE combined course with:
   - Concepts at NEET depth (L4)
   - Board QNA practice sets
   - NEET MCQ practice sets
   - Both PYQs (board + NEET)
   - Speed drills (timed MCQ)
   - Daily plan balancing all dimensions
8. Implement speed practice: timed MCQ sessions with accuracy + speed tracking.
9. Implement board QNA practice: long-form answer writing with model answers.
10. School → Senior transition demo: Class 10 NEET Foundation → Class 11 Senior (mastery carries over).

**Deliverable:** Senior segment live. Student can enroll in Class 12 + NEET, get hybrid-merged combined course with board QNA + NEET MCQ + speed drills + PYQs. THE Senior killer feature.

**Files created:**
```
supabase/seed/curriculum-senior.sql
supabase/seed/exams-senior.sql  (NEET, JEE)
supabase/seed/questions-senior.sql  (board QNA + NEET MCQ + PYQs)
supabase/functions/generate-combined-course/hybrid-merge.ts
app/senior/page.tsx
app/senior/class/[n]/page.tsx
app/senior/exam/[slug]/page.tsx
app/senior/practice/[type]/page.tsx
components/senior/stream-selector.tsx
components/senior/hybrid-course-view.tsx
components/senior/board-qna-practice.tsx
components/senior/speed-drill.tsx
lib/combined-course/hybrid-merge.ts
```

---

### Session 8: Atlas (Books Solutions) + SEO

**Objective:** Atlas live, SEO-optimized, generating traffic.

**Tasks:**
1. Seed books: NCERT Class 8/10/12 Science + Math.
2. Seed chapter-wise solutions (10-20 per book as sample).
3. Build Atlas pages:
   - `/atlas` — Atlas home (book browser)
   - `/atlas/book/[slug]` — book page (chapter list)
   - `/atlas/book/[slug]/[chapter]` — chapter solutions (indexable, SEO-optimized)
4. SEO optimization: JSON-LD structured data, sitemap generation, meta tags, canonical URLs.
5. Lead gen: "Want structured learning? Enroll free" CTA on solution pages.
6. Link solutions to concepts (knowledge graph).

**Deliverable:** Atlas live, SEO-optimized, lead-generating.

---

### Session 9: GK & Current Affairs

**Objective:** GK segment live, exam-centric, feeding into other segments.

**Tasks:**
1. Create Supabase schema: `gk`.
2. Seed ~50 current events (categorized, tagged to concepts/exams).
3. Build GK pages:
   - `/gk` — GK home (daily feed)
   - `/gk/[category]` — category page (polity, economy, etc.)
   - `/gk/article/[slug]` — article page (indexable)
4. Implement GK collections (dynamic views over question graph).
5. Exam-centric personalization: RRB student sees basic GK, UPSC sees deep GK.
6. Cross-segment feeding: GK widget in Coaching dashboard, School dashboard.

**Deliverable:** GK live, personalized to exam level, feeding other segments.

---

### Session 10: Integration & Polish

**Objective:** All segments connected, unified search, smooth UX.

**Tasks:**
1. Cross-segment navigation: unified header, segment switcher.
2. Unified search: search across concepts, content, questions, GK, Atlas.
3. Progress aggregation: /my shows progress across all enrolled goals.
4. Performance optimization: image optimization, lazy loading, code splitting.
5. Mobile UX polish: bottom navigation, touch targets, gestures.
6. Accessibility audit: screen reader, keyboard nav, contrast.

**Deliverable:** Integrated, polished platform. Ready for more segments.

---

### Session 11: College Segment

**Tasks:** University/degree/semester models, semester subjects, placement prep module, college dashboard.

### Session 12: ITI Segment

**Tasks:** Trade models, workshop content, practical demos, tool guides, safety protocols, apprenticeship info.

### Session 13: Skills Segment (W3Schools Tutorials)

**Tasks:** Skill tracks, tutorial modules, "try it yourself" interactive examples (coding), exercises, roadmaps.

### Session 14: Live Classes

**Tasks:** YouTube live stream embedding, group chat (Socket.io), doubt queue, moderator controls, live class scheduling in console.

### Session 15+: Next-Gen Features

As per Section 12 priorities.

---

## 16. Worklog & GitHub Workflow

### 16.1 Worklog File

**Location:** `/worklog.md` (root of project)

**Format:**
```markdown
---
Task ID: [session-number]
Agent: [agent name / human]
Task: [what was asked to do]

Work Log:
- [step 1]
- [step 2]
- ...

Stage Summary:
- [key results]
- [decisions made]
- [artifacts produced]
- [next session prerequisites]
```

### 16.2 After Every Session (MANDATORY)

```
1. Update /worklog.md (append new section)
2. Run lint: bun run lint
3. Git commit: git add . && git commit -m "Session [N]: [summary]"
4. Git push: git push origin main
5. If DB changes: run Supabase migrations
6. Verify Vercel deployment (check preview/production URL)
7. Check dev.log for errors
```

### 16.3 Git Workflow

```
main branch → production-ready code
  ├── Direct commits allowed for now (solo/small team)
  ├── Later: feature branches + PRs
  └── Tags: v0.1.0 (Phase 1), v0.2.0 (Phase 2), etc.
```

### 16.4 Supabase Migrations

```
supabase/migrations/
├── 001_knowledge.sql
├── 002_content.sql
├── 003_questions.sql
├── 004_rls.sql
├── 005_learning.sql
├── ...
└── README.md (migration order + notes)
```

**After schema changes:**
```bash
# Apply migration to Supabase
supabase db push
# Or run SQL directly via Supabase dashboard if CLI not set up
```

---

## 17. Folder Structure

```
snapzila-academy/
├── app/
│   ├── (public)/                    # W3Schools-style free browsing
│   │   ├── school/
│   │   │   ├── page.tsx
│   │   │   ├── class/[n]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [subject]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [chapter]/
│   │   │   │           └── page.tsx
│   │   ├── senior/
│   │   │   ├── page.tsx
│   │   │   ├── class/[n]/
│   │   │   ├── exam/[slug]/
│   │   │   └── practice/[type]/
│   │   ├── coaching/
│   │   │   ├── page.tsx
│   │   │   ├── exam/[slug]/
│   │   │   │   └── page.tsx
│   │   │   └── combined/
│   │   │       └── page.tsx
│   │   ├── college/
│   │   ├── iti/
│   │   ├── skills/
│   │   │   ├── page.tsx
│   │   │   ├── learn/[slug]/
│   │   │   └── track/[slug]/
│   │   ├── gk/
│   │   │   ├── page.tsx
│   │   │   ├── [category]/
│   │   │   └── article/[slug]/
│   │   └── atlas/
│   │       ├── page.tsx
│   │       └── book/[slug]/[chapter]/
│   ├── concept/
│   │   └── [slug]/page.tsx          # Canonical concept page
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   └── my/
│   │       ├── page.tsx
│   │       ├── goals/
│   │       ├── path/
│   │       ├── progress/
│   │       ├── bookmarks/
│   │       ├── notes/
│   │       └── chat/                # AI tutor
│   ├── (console)/
│   │   └── console/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── content/
│   │       ├── questions/
│   │       ├── exams/
│   │       ├── curriculum/
│   │       ├── concepts/
│   │       ├── gk/
│   │       ├── atlas/
│   │       ├── chat/
│   │       ├── users/
│   │       ├── teachers/
│   │       ├── analytics/
│   │       ├── live/
│   │       ├── audit/
│   │       └── settings/
│   ├── live/[id]/page.tsx           # Live class page
│   ├── qna/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── enroll/route.ts
│   │   ├── progress/route.ts
│   │   └── search/route.ts
│   ├── layout.tsx
│   ├── page.tsx                     # Home
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── site/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── segment-nav.tsx
│   │   └── search-bar.tsx
│   ├── learn/
│   │   ├── concept-view.tsx
│   │   ├── content-renderer.tsx
│   │   ├── question-practice.tsx
│   │   ├── progress-tracker.tsx
│   │   ├── enrollment-flow.tsx
│   │   ├── combined-course-view.tsx
│   │   └── mastery-badge.tsx
│   ├── chat/
│   │   ├── chat-room.tsx
│   │   ├── chat-message.tsx
│   │   ├── chat-input.tsx
│   │   ├── ai-tutor.tsx
│   │   └── live-chat.tsx
│   ├── console/
│   │   ├── sidebar.tsx
│   │   ├── content-editor.tsx
│   │   ├── question-editor.tsx
│   │   ├── exam-editor.tsx
│   │   └── curriculum-editor.tsx
│   └── shared/
│       ├── breadcrumb.tsx
│       ├── empty-state.tsx
│       └── loading-skeleton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── combined-course/
│   │   ├── depth-merge.ts
│   │   ├── syllabus-merge.ts
│   │   └── types.ts
│   ├── ai/
│   │   ├── doubt-response.ts
│   │   ├── tutor.ts
│   │   └── client.ts                 # z-ai-web-dev-sdk client
│   ├── queries/
│   │   ├── concepts.ts
│   │   ├── content.ts
│   │   ├── questions.ts
│   │   ├── exams.ts
│   │   └── progress.ts
│   ├── console/
│   │   └── rbac.ts
│   └── utils/
│       ├── cn.ts
│       ├── seo.ts
│       └── slug.ts
├── mini-services/
└── chat-service/
│       ├── index.ts
│       └── package.json
├── supabase/
├── migrations/
│   ├── 001_knowledge.sql
│   ├── 002_content.sql
│   └── ...
├── seed/
│   ├── concepts-school.sql
│   ├── concepts-coaching.sql
│   └── exams-coaching.sql
├── docs/
│   └── SNAPZILA-ACADEMY-PLAN.md      # THIS DOCUMENT
├── public/
│   ├── images/
│   └── icons/
├── worklog.md                        # Session worklog
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.local                        # Supabase keys
├── .env.example
├── .gitignore
└── README.md
```

---

## 18. Skills Decision (Final)

### Decision: Skills stays in the same platform as a distinct segment.

**Route:** `/skills`

**Rationale:**
1. **Shared backbone** — One account, one learner profile, one knowledge graph. A college student learning C programming in their degree can also do the "Skills: C Programming" track — same concepts, different context.
2. **W3Schools tutorials model fits** — Skills content is tutorial-based (learn Python, learn Excel). This is the same model as the platform-wide free browsing model.
3. **Cross-segment value** — A B.Tech CSE student → career path → required skills → "Start Skills: Python track." Seamless.
4. **Lower cost** — One deployment, one DB, one auth.
5. **Future extraction possible** — If Skills grows large (1000+ courses, heavy video hosting, different audience), it can be extracted into a separate app using the same Supabase backend. The architecture supports this (clean route group `/skills`, separate content tables, API isolation).

**Why NOT separate like competitors (Seekho, Relevel, etc.):**
- Competitors separate because their core is different (Seekho = entertainment short videos; Relevel = job-focused assessments). Their Skills product doesn't share infrastructure with an academic platform.
- Our model is structured learning. Skills fits naturally as a segment alongside School, Coaching, etc.
- A separate app = separate account, separate progress, lost cross-segment value.
- **Principle: "Extract, don't pre-split."** Start unified. Split only when scale demands it.

**Skills Segment Design (W3Schools Tutorials Model):**
- Browse tutorials free (no login)
- "Try it yourself" interactive examples (coding, Excel)
- Exercises after each tutorial
- Skill tracks / roadmaps ("Become a Web Developer")
- Certificate on completion (future, paid)
- Project-based learning (build something real)

**If extraction needed later:**
1. Move `/skills` route group into a separate Next.js app.
2. Share Supabase project (same DB, same auth).
3. Deploy as separate domain (e.g., `skills.[brand].com`).
4. Learner profile and knowledge graph remain shared.

---

## 19. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# z-ai-web-dev-sdk (for AI features)
ZAI_API_KEY=your_zai_api_key

# Socket.io chat service
CHAT_SERVICE_PORT=3001

# App
NEXT_PUBLIC_APP_URL=https://[subdomain].vercel.app
```

---

## 20. Open Items / TBD

| Item | Status | Notes |
|---|---|---|
| Brand name / custom domain | TBD | Using Vercel free subdomain for now. User will decide brand later. |
| Brand color (accent) | TBD | Suggest emerald or teal (not indigo/blue per rules). Default to emerald. |
| Video hosting | Supabase Storage (start) | Move to Cloudflare R2 when video volume grows. |
| Payment integration | DEFERRED | All free for now. Add when monetization needed. |
| W3PrimeCode integration | DEFERRED | Share identity later. Separate for now. |
| Multi-language beyond Hindi/English | Phase 3+ | Start with Hindi + English. Add regional later. |
| Gamification depth | Light only | Streak system (gentle). No heavy gamification until learning quality is proven. |
| Mobile app (React Native) | DEFERRED | PWA first. Native app later if needed. |
| Existing SnapZila migration | N/A | This is a NEW separate project. No migration from existing snapzila.com. |

---

## 21. Success Metrics

How we know each phase succeeded:

| Phase | Success Metric |
|---|---|
| Phase 1 | Site live, auth working, 5+ concepts browsable free, enrollment + progress tracking functional |
| Phase 2 | Coaching combined course demo works (RRB+SSC+Police → one course with overlap stats), chat works, console usable by teachers |
| Phase 3 | School/Atlas/GK live, SEO pages indexable, cross-segment navigation smooth |
| Phase 4 | All 7 segments live, live class streaming works |
| Phase 5 | AI tutor is genuinely helpful, spaced repetition active, PWA installable |

---

## 22. Critical Reminders for All Developers (Human & AI)

1. **Mobile-first, ALWAYS.** Design for phone first. India learns on phones.
2. **All content free to browse.** Never gate content behind login. Login adds tracking, not access.
3. **Supabase direct, no Prisma.** Use RLS, Auth, Realtime, Storage, Edge Functions.
4. **One unified chat.** Never build a separate chat system. One component, four modes.
5. **World-class design.** Not "good enough." Linear/Notion/Vercel quality.
6. **Every session ends with:** worklog update → git push → DB migration (if needed) → verify deploy.
7. **Hindi + English.** Content and UI should support both from Day 1.
8. **Concepts are canonical.** One concept = one record. Multiple experiences from it.
9. **AI assists, doesn't replace.** Human-verified canonical content. AI for tutoring, doubts, personalization.
10. **This document is the source of truth.** Any architectural change → update this doc first, then build.

---

## Appendix A: Glossary

| Term | Meaning |
|---|---|
| **Concept** | Atomic unit of knowledge (e.g., "Photosynthesis"). Universal, not tied to class/exam. |
| **Knowledge Unit** | Same as Concept. |
| **Depth Layer** | L1 (Core) → L2 (Exam Facts) → L3 (Conceptual) → L4 (Advanced). Same concept at different depths. |
| **Curriculum** | Board + Class + Subject combination (e.g., CBSE Class 8 Science). Maps concepts at specific depths. |
| **Exam** | A competitive test (e.g., RRB Group D). Maps concepts at specific depths/importance. |
| **Exam Cycle** | A yearly instance of an exam (e.g., SSC CGL 2026). Syllabus/dates may change per cycle. |
| **Combined Course** | ONE optimized learning path for multiple goals. Two modes: depth-merge (school) + syllabus-merge (coaching). |
| **Depth-Merge** | Combining goals within the same class (same concepts, deeper depth). E.g., Class 8 CBSE + Class 8 NEET Foundation. |
| **Syllabus-Merge** | Combining different exams' syllabi (union + dedupe). E.g., RRB + SSC + Police. |
| **Mastery** | 0-100 score per concept per user. States: not_started → learning → understood → practiced → mastered → needs_revision. |
| **Knowledge Passport** | A learner's mastery profile across all concepts. Portable across goals. |
| **Enrollment** | When a student selects a goal (class/exam/trade/skill). Free. Adds structured path + tracking. |
| **Segment** | One of 7 product areas: School, Coaching, College, ITI, Skills, GK, Atlas. |
| **Console** | Admin/teacher dashboard. All company management. |
| **W3Schools Model** | All content freely browsable. Enrollment adds structure, not access. |
| **Atlas** | Books Solutions segment. SEO reference. |
| **RLS** | Row Level Security (Supabase/PostgreSQL feature). DB-level access control. |

---

## Appendix B: Reference Inspirations

| Platform | What to Learn From |
|---|---|
| **W3Schools** | Free content browsing, tutorials model, "try it yourself" |
| **Duolingo** | Mobile-first UX, streaks (light gamification), instant feedback |
| **Linear** | Design quality, speed, clean UI |
| **Notion** | Content structure, blocks, flexibility |
| **Khan Academy** | Mastery-based progression, concept-first teaching |
| **Allen Kota** | Foundation model (NCERT taught deeper, not advanced content) |
| **Unacademy** | (What to avoid) Paywall-heavy, content-duplicative |
| **Byju's** | (What to avoid) Sales-heavy, not learner-centric |

---

**END OF DOCUMENT**

> This document is the complete master plan. Any AI engineer reading this should be able to build the SnapZila Academy platform from Session 1 onwards.  
>  
> **Next step:** User provides GitHub + Supabase credentials → Create new repo → Push this document → Begin Session 1.
