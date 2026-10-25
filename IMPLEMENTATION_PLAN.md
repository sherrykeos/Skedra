# Skedra — Comprehensive Implementation Plan

> **Status:** Revised Implementation Plan for Alignment  
> **Source Documents:** 
> - [`context.md`](./context.md) — Product & Engineering Source of Truth
> - [`PRD.md`](./PRD.md) — Product Requirements & Experience Specification
> - [`AGENTS.md`](./AGENTS.md) — Coding Agent Operating Rules & Anti-AI-Slop Guidelines
> **Verified Design References:** 
> - `design-references/designStyle.jpg` (Directional visual reference from Nixtio)
> - `design-references/logo.svg` / `design-references/logo.skedra.png` (Skedra brand identity)

---

## Document Taxonomy & Classification Standard

To preserve absolute integrity and avoid treating provisional ideas as settled contracts, every architectural choice, constraint, and feature in this plan is tagged with one of five rigorous classifications:

- `[Confirmed Requirement]` — Explicitly established by the source project documents (`context.md` § 20, `PRD.md`, `AGENTS.md` § 5) or confirmed by direct user instruction (e.g., framework selection). Must be honored without unauthorized alteration.
- `[Recommended Architecture]` — Explicitly recommended in `context.md` (e.g., Next.js, IndexedDB via Dexie, JSON Schema + Ajv, Vitest), which provides the approved architectural direction unless practical verification proves a blocking constraint.
- `[Inference]` — A direct, logical deduction derived from confirmed requirements to bridge practical engineering gaps.
- `[Proposal]` — A sensible technical, component, or UX implementation detail introduced in this plan for review and alignment prior to implementation.
- `[Open Question]` — A recognized uncertainty or parameter explicitly designated as open in `context.md` § 21 that requires empirical calibration or user choice.

---

## A. Product Understanding

### 1. Purpose and Target Problem
Skedra is a **plan-first, local-first planning and execution system** `[Confirmed Requirement]` (`context.md` § 1, § 3) designed to transform structured roadmaps into realistic, manageable, deterministic daily execution schedules.

Modern self-directed learners, students, and professionals preparing for high-stakes milestones—such as the **GATE exam, DSA and technical interviews, professional certifications, or multi-month engineering curricula**—suffer from a broken execution loop `[Confirmed Requirement]` (`context.md` § 2):
1. **Roadmaps lack calendar reality:** Syllabi and roadmaps specify *what* to study and their prerequisite order, but possess no awareness of real-world calendar limits, daily capacity, or fatigue buffers.
2. **Calendars are fragile and rigid:** Traditional calendars treat work as static slots. The moment life diverges or a session overruns, the entire calendar breaks. Constant manual rescheduling causes cognitive fatigue, guilt, and eventual abandonment.
3. **To-do apps create infinite backlog guilt:** Flat task lists lack capacity constraints, leading to unbounded accumulation of overdue tasks with no sense of milestone feasibility.
4. **AI planners hallucinate without determinism:** LLM-based conversational schedulers produce non-reproducible, unvalidated schedules that lack mathematical guarantees and durable tracking.

Skedra bridges this chasm by separating high-level structural planning from day-to-day execution. The user brings the roadmap; Skedra provides an honest, mathematically sound, feasible daily agenda that adapts when life happens, preserves progress, and maintains long-term retention—all while keeping the user in full control `[Confirmed Requirement]` (`context.md` § 1, § 3).

### 2. Core Domain Taxonomy `[Confirmed Requirement]` (`context.md` § 1, § 4, § 9, § 10)
- **Plan:** The primary organizational entity and workspace. Backed by an imported roadmap, a plan encapsulates scope, schedule, progress records, revision policies, and plan-specific constraints (`context.md` § 1).
- **Roadmap:** The domain's structural breakdown: groups, topics, subtopics, executable tasks, and their prerequisite dependency graph. Defines *what* work exists (`context.md` § 4).
- **Schedule:** The time-allocation mapping of executable tasks into calendar dates, sessions, and daily capacity windows. Defines *when* work is performed.
- **Session:** A concrete, scheduled block of focused execution on a specific day (e.g., a 45-minute study session for a task).
- **Progress Tracking:** The empirical log of real work: recording actual duration, state transitions (`not_started`, `in_progress`, `completed`, `partially_completed`, `blocked`), remaining effort, and optional recall self-ratings (`context.md` § 9).
- **Revision Planning:** A coordinated strategy for spaced retention sharing daily capacity with new learning, distinguishing **Regular Revision** (spaced retention) from **Serious Revision** (intensive pre-deadline exam preparation) (`context.md` § 10).

### 3. Defining Behaviors & Principles `[Confirmed Requirement]` (`context.md` § 3, `AGENTS.md` § 5)
- **Engine Complexity, Interface Clarity:** Sophisticated scheduling algorithms, topological sorting, and capacity math remain in the engine; the user interface stays clean, calm, and actionable (`context.md` § 1).
- **Deterministic Scheduling:** Schedulers are pure TypeScript functions. Identical inputs, state, and engine version produce the exact same schedule without external API or LLM dependencies (`context.md` § 3 #2, § 7).
- **Zero False Feasibility:** Skedra never claims a plan is feasible if required work exceeds capacity. It calculates and reports the exact quantitative deficit in plain language (`context.md` § 3 #4, § 7).
- **No Silent Task Dropping:** Required tasks are never discarded, shortened, or delayed silently to make an overloaded schedule appear feasible (`context.md` § 3 #5).
- **User Agency & Safe Adaptation:** Missed sessions are never blindly dumped onto the next day. Consequential schedule adjustments produce before/after previews and require explicit user approval (`context.md` § 3 #6, § 11).
- **Local-First Data Ownership (V1):** All data is stored locally in the browser (IndexedDB). No mandatory accounts, cloud sync, or external backend servers exist in V1. Discoverable manual export and safe restore guarantee complete user sovereignty (`context.md` § 3 #10, § 14).

### 4. Intended Experience & Aesthetic Direction
- **Calm, Engineered Aesthetic:** Drawing directional inspiration from `design-references/designStyle.jpg` (Nixtio reference), the app uses a compact dark chrome (`#111315`), a subtle cool canvas (`#EEF7F7`), soft rounded white surfaces (`#FFFFFF` / `#F7F9FA`), and restrained pastel task stream fills `[Confirmed Requirement]` (`PRD.md` § 5, `AGENTS.md` § 6).
- **Anti-AI-Slop:** Zero decorative neon gradients, glassmorphism blur, floating 3D elements, or walls of vanity statistic cards `[Confirmed Requirement]` (`AGENTS.md` § 6).
- **Authentic Product Copy:** Crisp, human, functional copy with explicit quantities (hours, dates, minutes) and no vacuous motivational slogans `[Confirmed Requirement]` (`AGENTS.md` § 6).

---

## B. Scope, Phasing & Release Boundaries

To ensure rigorous project execution without premature over-commitment or unauthorized feature deferral, Skedra's development is structured into three explicit tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Tier 1: First Working Vertical Slice (Checkpoint)                      │
│ - Import & validate roadmap JSON (both modes)                          │
│ - Deterministic scheduling (roadmap_only) & exact allocation (pre-sch) │
│ - Availability, buffer & break budgeting                               │
│ - Plan-first workspace (Overview, Roadmap, Schedule, Today Agenda)     │
│ - Focus session timer, progress event logging, reload durability       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validates core loop
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Tier 2: Complete V1 Release Scope                                      │
│ - Safe Adaptation: non-cascading missed work reallocation              │
│ - Before/after schedule diff previews, user approval & undo            │
│ - Revision Subsystem: Regular Revision (spaced) & Serious Revision     │
│ - Shared capacity budgeting between learning and revision              │
│ - Authentic progress analytics & genuine data-backed charts            │
│ - Full local data backup export & transactional, previewable restore   │
│ - Configurable local notification preferences                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validated in production
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Tier 3: Post-V1 Horizons (Explicitly Deferred)                         │
│ - Mandatory user accounts, authentication & cloud sync                 │
│ - Multi-device synchronization & real-time collaboration               │
│ - Conversational AI chatbot or generative roadmap authoring            │
│ - Native mobile wrapper apps & heavy PWA offline sync                  │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Tier 1: The First Working Vertical Slice (Checkpoint) `[Confirmed Requirement]` (`context.md` § 22)
The first implementation checkpoint validates the foundational product hypothesis through a single, dependable, end-to-end workflow:
> **Import sample roadmap → validate it → generate or preserve schedule by mode → open plan workspace → complete a task session → reload browser without losing progress.**

This checkpoint includes:
1. Canonical schema validation and repair preview for both `roadmap_only` and `pre_scheduled` modes.
2. Capacity-bounded scheduling and honest feasibility diagnostics.
3. Plan-first navigation: Plans Home, Plan Overview, Roadmap hierarchy, Schedule (Week/Day/Agenda), and Global Today.
4. Active focus session timer logging actual duration, state changes, and remaining effort.
5. Durable local persistence in IndexedDB surviving browser reloads.

### 2. Tier 2: Complete V1 Release Scope `[Confirmed Requirement]` (`context.md` § 16, § 17, § 20)
All capabilities confirmed in `context.md` are integral parts of the V1 release, built systematically on top of the validated Tier 1 core:
1. **Safe Adaptation Engine (`context.md` § 11):** Detection of missed work, non-cascading reallocation across future capacity, before/after schedule diff previews, mandatory user approval, and undo capability.
2. **Dual Revision Subsystem (`context.md` § 10):** Independent configuration of Regular Revision (spaced reviews) and Serious Revision (intensive pre-exam sprint), scheduled within shared daily capacity budgets, with adaptive intervals informed by quick recall feedback.
3. **Data-Backed Progress Analytics (`context.md` § 12, `PRD.md` § 6):** Honest charts answering clear questions (Planned vs. Actual study time, completion by topic, daily workload distribution) with explicit units, accessible labels, and meaningful empty states.
4. **Data Sovereignty & Safe Restore (`context.md` § 14):** Full application backup export and transactional restore with schema validation, timestamp checks, and pre-restore previews.
5. **Configurable Notifications (`context.md` § 13):** Opt-in local browser reminders for upcoming sessions and deadlines (off by default).

### 3. Tier 3: Post-V1 Horizons (Explicitly Out of Scope) `[Confirmed Requirement]` (`context.md` § 16)
- Mandatory cloud accounts, server authentication, or cloud databases.
- Multi-user collaboration, shared roadmaps, or real-time cloud sync.
- Generative AI roadmap authoring or conversational chatbot assistants.
- Native mobile wrappers (iOS/Android) or complex PWA service workers (deferred until core application value is validated).

---

## C. Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                    Next.js (App Router) Client SPA                     │
│   Plans Home  │  Import Wizard  │  Plan Workspace  │  Focus Session    │
│   (Tailwind CSS + PRD Tokens + Anti-AI-Slop Typography & Surfaces)     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ UI Events / Client Routing
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Application & State Layer                          │
│        React Context / Custom Hooks + Repository Abstraction           │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │ Domain Calls                             │ Storage Calls
               ▼                                          ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│   Pure TypeScript Engines    │          │   Local Persistence Layer    │
│  - Roadmap Schema Validator  │          │  - Dexie.js (IndexedDB)      │
│  - Dependency Graph Analyzer │          │  - Repository Interfaces     │
│  - Deterministic Scheduler   │          │  - State Migrations          │
│  - Feasibility Evaluator     │          │  - Backup / Restore Engine   │
│  - Revision Coordinator      │          └──────────────────────────────┘
│  (Zero DOM/Storage/Net deps) │
└──────────────────────────────┘
```

### 1. Framework & Runtime Stack `[Confirmed Requirement]` (Direct User Instruction & `context.md` § 15)
- **Application Framework:** **Next.js (App Router) + React + TypeScript**.
  - *Architecture Pattern:* Skedra V1 is a client-side, local-first application. Interactive views and data layers operate as Next.js Client Components (`"use client"`) accessing browser IndexedDB.
  - *Deployment & Build:* Configured for static export (`output: 'export'`) or client rendering, producing a fast, self-contained bundle deployable to Vercel or any static host with zero mandatory server runtime dependencies for V1.
- **Language:** **TypeScript 5.x** with strictly configured `compilerOptions` (`"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`). All domain types are explicitly defined without loose casts `[Confirmed Requirement]` (`AGENTS.md` § 6).

### 2. Styling & Design System `[Confirmed Requirement]` (`PRD.md` § 5)
- **Styling Solution:** **Tailwind CSS** configured with exact design tokens from `PRD.md`:
  - `chrome`: `#111315` (compact top bar / app chrome)
  - `app-canvas`: `#EEF7F7` (subtle cool outer canvas)
  - `surface`: `#FFFFFF` (main work surfaces, cards, modals)
  - `surface-subtle`: `#F7F9FA` (nested sections, inactive cards)
  - `border`: `#DCE3E6` (subtle dividers, card outlines, inputs)
  - `accent`: `#7156E8`, `accent-hover`: `#5E43D3`, `accent-soft`: `#EEE9FF`
  - Restrained pastel stream fills: Mint `#DDF5E8`, Lavender `#F0E3FA`, Sky `#DDF2F8`, Peach `#FFF0D8`
  - Semantic indicators: Success `#1F805D`, Warning `#9B6200`, Danger `#B4232F`
- **Typography:** Inter (via `next/font/google` or system sans-serif fallback), using tabular figures (`tabular-nums`) for timers, metrics, and dates `[Confirmed Requirement]` (`PRD.md` § 5).
- **Icons:** A single, lightweight, consistent line-icon family (`lucide-react`) `[Proposal]`.

### 3. Validation & Scheduling Engines `[Recommended Architecture]` (`context.md` § 6, § 7)
- **Schema Validation:** **JSON Schema (Draft 7 / 2020-12)** with **Ajv** for runtime validation in browser and tests.
- **Scheduling Engine:** Pure TypeScript module located under `src/engine/`. It accepts plain data objects, configuration options, and an injectable clock/reference date, returning proposed allocations and diagnostic structures. Completely decoupled from React, DOM, or storage APIs (`context.md` § 3 #12, § 7).

### 4. Local Persistence & State Management `[Recommended Architecture]` (`context.md` § 14)
- **Database Engine:** **Dexie.js (IndexedDB wrapper)**. Provides indexed queries, reactive live queries, transactional safety, and schema version migrations.
- **Storage Boundary (Repository Pattern):** Application code interacts with abstract repository interfaces (`IPlanRepository`, `ITaskRepository`, `ISessionRepository`, `IProgressRepository`), decoupling business logic from Dexie and facilitating testing and future cloud backends `[Confirmed Requirement]` (`context.md` § 14, § 15).
- **Application State:** React Context or lightweight custom hooks for active view state (selected plan, current date cursor, active timer), while persistent entities are queried from IndexedDB `[Proposal]`.

### 5. Testing Infrastructure `[Recommended Architecture]` (`context.md` § 15)
- **Unit & Domain Testing:** **Vitest** for fast execution of schema validation, graph algorithms, and scheduling logic.
- **Component & Integration Testing:** **Testing Library / React** for user workflows.
- **End-to-End Verification:** **Playwright** for complete user journeys (Import -> Schedule -> Execute -> Reload -> Adapt).

---

## D. Domain Model and Data Contracts

### 1. Canonical Roadmap Contract Strategy `[Confirmed Requirement]` (`context.md` § 4, § 6)
The roadmap contract is the external versioned interface. Both planning modes share this schema.

#### Critical Contract Invariants `[Confirmed Requirement]`
1. **Multi-Allocation Support:** A single task may require multiple scheduled sessions across different days or time slots (e.g., a 6-hour topic split into three 2-hour sessions, or multiple pre-scheduled calendar sessions). The schema must natively support multiple scheduled allocations per task.
2. **Stable Task Identity:** Task identity (`id`) must remain invariant across session splits, schedule changes, and progress updates (`context.md` § 3 #8, § 8).
3. **Pre-Scheduled Preservation:** Every allocation in `pre_scheduled` mode must be preserved exactly as authored: date, start/end time, and duration must never be automatically split, consolidated, shifted, or mutated (`context.md` § 4).
4. **Organizational Nodes:** Groups, topics, and subtopics are hierarchy nodes that consume no time themselves unless explicitly represented as executable tasks (`context.md` § 4).

#### Draft Contract Definition `[Proposal]`
```typescript
export type PlanningMode = 'roadmap_only' | 'pre_scheduled';

export interface RoadmapMetadata {
  id: string;                      // Stable UUID
  title: string;                   // Human-readable title
  description?: string;
  schemaVersion: string;           // Semantic version, e.g., "1.0.0"
  targetDate?: string;             // ISO 8601 date (YYYY-MM-DD)
  estimatedTotalHours?: number;
  author?: string;
  tags?: string[];
  customMetadata?: Record<string, unknown>; // Preserved custom data
}

export type RoadmapNodeKind = 'group' | 'topic' | 'subtopic';

export interface RoadmapNode {
  id: string;                      // Stable UUID
  parentId?: string | null;        // null if root node
  kind: RoadmapNodeKind;           // Organizational node; consumes no time
  title: string;
  order: number;
}

export interface ScheduledAllocation {
  id: string;                      // Stable allocation identifier
  date: string;                    // YYYY-MM-DD
  startTime?: string;              // HH:mm (optional clock time)
  endTime?: string;                // HH:mm (optional clock time)
  durationMinutes: number;         // Allocated duration (> 0)
}

export interface ExecutableTask {
  id: string;                      // Stable UUID
  nodeId: string;                  // Parent topic/subtopic reference
  title: string;
  description?: string;
  estimatedMinutes: number;        // Must be > 0
  prerequisiteTaskIds: string[];   // Explicit task-level dependencies
  deadline?: string;               // Optional task-specific hard deadline (YYYY-MM-DD)
  priorityWeight?: number;         // 1-5 scale (default 3)
  isMilestone?: boolean;
  scheduledAllocations?: ScheduledAllocation[]; // Required & complete in pre_scheduled mode
  customMetadata?: Record<string, unknown>;
}

export interface CanonicalRoadmap {
  metadata: RoadmapMetadata;
  mode: PlanningMode;
  nodes: RoadmapNode[];
  tasks: ExecutableTask[];
}
```

#### Unresolved Schema Decisions to Finalize During Milestones `[Open Question]` (`context.md` § 6, § 21)
- **Top-Level vs. Embedded Allocations:** Whether `pre_scheduled` allocations are embedded within `ExecutableTask.scheduledAllocations` or represented as a separate top-level `schedule: ScheduledAllocation[]` collection referencing `taskId`.
- **Time Representation:** Standardizing between discrete `startTime` / `durationMinutes` vs. ISO-8601 interval strings (`2026-11-01T09:00:00/2026-11-01T10:30:00`).
- **Hierarchy Representation:** Flat node array with `parentId` references vs. nested tree objects. (Flat array recommended for simpler serialization and schema validation).

### 2. Application Entity Model (IndexedDB Storage) `[Proposal]`
Within Skedra's local database, runtime entities track execution, splits, and progress:

- **`PlanEntity`:** `id`, `roadmapId`, `title`, `mode`, `status` (`active` | `completed` | `archived`), `targetDate`, `availabilityConfig`, `createdAt`, `updatedAt`.
- **`TaskEntity`:** `id`, `planId`, `nodeId`, `title`, `estimatedMinutes`, `actualMinutes`, `remainingMinutes`, `status` (`not_started` | `in_progress` | `completed` | `partially_completed` | `blocked`), `prerequisiteTaskIds`, `deadline`, `isMilestone`.
- **`ScheduledSessionEntity`:** `id`, `planId`, `taskId`, `allocationId` (if pre-scheduled), `date` (`YYYY-MM-DD`), `startTime` (`HH:mm`), `durationMinutes`, `sessionType` (`learning` | `practice` | `regular_revision` | `serious_revision`), `status` (`scheduled` | `active` | `completed` | `missed` | `skipped`), `isProtected` (true in pre-scheduled mode).
- **`ProgressEventEntity`:** `id`, `planId`, `taskId`, `sessionId`, `timestamp`, `actualMinutes`, `previousState`, `newState`, `recallRating` (`easy` | `partial` | `difficult` | `skipped` | `none`), `notes`.
- **`RevisionConfigEntity`:** `id`, `planId`, `regularEnabled`, `seriousEnabled`, `regularIntervals`, `seriousStartDaysBeforeTarget`, `sharedBudgetMinutes`.
- **`ScheduleProposalEntity`:** `id`, `planId`, `createdAt`, `reason`, `diffSummary`, `proposedSessions`, `status` (`pending` | `approved` | `rejected`).

### 3. Application Full Backup Contract (`skedra-backup.schema.json`) `[Confirmed Requirement]` (`context.md` § 14)
A backup encapsulates full application state, fundamentally distinct from an external roadmap file:
- `schemaVersion`: Version of the backup format.
- `exportTimestamp`: ISO 8601 creation timestamp.
- `appVersion`: Application build identifier.
- `payload`: Complete database dump of all plans, tasks, scheduled sessions, progress events, revision configs, and user settings.
- `integrity`: Integrity checksum / verification hash `[Proposal]`.

---

## E. Scheduling Engine & Feasibility Diagnostics

### 1. Pure Engine Pipeline `[Confirmed Requirement]` (`context.md` § 7)
The scheduler is an algorithmic pipeline that executes in sequence without side effects:

```
[Inputs: CanonicalRoadmap + AvailabilityConfig + ExistingProgress + InjectedClock]
     │
     ▼
1. Validation & Graph Assembly
   - Verify task references and parse dependencies into Directed Acyclic Graph (DAG)
   - Detect circular dependencies using DFS / Kahn's algorithm
     │
     ▼
2. Mode Enforcement
   - If pre_scheduled: Validate completeness & conflict rules; freeze allocations; bypass generator
   - If roadmap_only: Proceed to allocation pipeline
     │
     ▼
3. Eligibility & Topological Ordering
   - Determine eligible tasks (all prerequisites satisfied or completed)
   - Calculate critical path length to deadlines
     │
     ▼
4. Priority Scoring & Deterministic Tie-Breaking
   - Priority = f(deadline proximity, critical path depth, priority weight, momentum)
   - Deterministic tie-breaker: sort by topological order, then stable task ID
     │
     ▼
5. Capacity-Bounded Slotting & Splitting
   - Iterate through available days starting from reference date
   - Net daily capacity = DailyBudget - BufferMinutes - PlannedBreaks
   - If task remaining effort > MaxSessionDuration and splitting enabled: allocate session slice
   - Slot sessions into available windows until net capacity is filled
     │
     ▼
6. Revision Integration
   - Deduct revision session requirements from shared daily capacity budget
     │
     ▼
7. Feasibility Diagnostics
   - Compare required effort against net available capacity
   - Detect unallocated tasks, aggregate capacity deficits, and deadline/bottleneck conflicts
   - Output structured, plain-language diagnostic report
```

### 2. Rigorous Feasibility Diagnostics `[Confirmed Requirement]` (`context.md` § 3 #4, § 7)
Feasibility diagnostics must never equate unallocated work with a raw capacity deficit without valid calculation. The engine computes and reports distinct diagnostic metrics:

1. **Total Required Effort ($E_{req}$):** The sum of remaining estimated minutes across all active, required tasks.
2. **Total Net Available Capacity ($C_{net}$):** The sum of daily study budgets across all user-selected available days up to the target date, minus reserved buffers and planned breaks:
   $$C_{net} = \sum_{d \in \text{Days}} \max(0, \text{Budget}_d - \text{Buffer}_d - \text{Breaks}_d)$$
3. **Aggregate Capacity Deficit:** The macro-level capacity shortfall across the plan's entire active window:
   $$\text{Deficit}_{capacity} = \max(0, E_{req} - C_{net})$$
   *Example:* 100 hours required across a 70-hour net capacity window yields an exact **30-hour capacity deficit**.
4. **Unallocated Work:** Tasks or task segments that could not be scheduled into the calendar.
   - *Important:* A plan may have $E_{req} \le C_{net}$ (zero aggregate capacity deficit) yet still have **unallocated work** due to prerequisite ordering constraints, strict time-window boundaries, or task-specific deadlines that force work into a narrower time slice than the whole window.
5. **Deadline & Bottleneck Conflicts:** The engine identifies specific bottleneck tasks where the prerequisite chain duration exceeds the time available before an intermediate or final deadline.
6. **Diagnostic Reporting:** The UI reports the exact nature of the problem:
   - *Aggregate Capacity Deficit:* "Plan requires 100 hrs of work, but only 70 hrs are available (30-hr deficit)."
   - *Deadline / Bottleneck Conflict:* "Sufficient total hours exist, but 12 hrs of prerequisite tasks for 'Task X' cannot fit before its deadline on Nov 15."

### 3. Constraints vs. Optimization Preferences `[Confirmed Requirement]` (`context.md` § 7)
- **Hard Constraints (Never Violated):**
  - Dependency order (prerequisites must complete before dependent tasks start).
  - Maximum daily capacity budget.
  - User-defined non-working days.
  - Protected `pre_scheduled` allocations.
  - Hard deadlines (plan-level target date and task-level deadlines).
- **Optimization Preferences (Soft):**
  - Preferred time-of-day windows.
  - Subject interleaving to maintain learning momentum.
  - Even distribution of workload across available days.

### 4. Buffer and Break Math `[Confirmed Requirement]` (`context.md` § 8)
- **Buffer is Reserved Capacity, Not Planned Work:** Buffers absorb fatigue and overruns. The scheduler never allocates sessions into buffer time.
- **Buffer Calculation:** Support fixed minutes or percentage:
  - *Example:* 180-minute daily budget with a 15% buffer reserves $\lceil 180 \times 0.15 \rceil = 27$ minutes.
  - Net capacity for work and planned breaks = $180 - 27 = 153$ minutes.
  - If a 15-minute break is configured, net schedulable task capacity = $153 - 15 = 138$ minutes.

### 5. Pre-Scheduled Mode Validation & Conflict Detection `[Confirmed Requirement]` (`context.md` § 4, § 6)
In `pre_scheduled` mode, Skedra validates the supplied schedule strictly without silent modifications:
- Validates that every task has complete, valid scheduled allocations.
- Detects overlapping or colliding allocations.
- Detects allocations scheduled on non-working days or outside configured time windows (if strict constraints are chosen).
- Detects dependency violations (e.g., Task B scheduled prior to prerequisite Task A).
- Detects allocations placed after task or plan deadlines.
- If conflicts exist, Skedra reports them clearly and halts import; it **never** silently rearranges, shifts, or splits pre-scheduled work.

### 6. Safe Adaptation Pipeline `[Confirmed Requirement]` (`context.md` § 3 #6, § 11)
When sessions are missed:
1. Past-due incomplete sessions are marked `missed`; they are **never** blindly dumped onto tomorrow.
2. The engine recalculates a feasible reallocation of remaining unfinished effort across future capacity.
3. Generates a `ScheduleProposal` containing:
   - Plain-language explanation of why the change is needed.
   - Before/after schedule comparison (dates shifted, affected sessions).
   - Clear "Approve changes" and "Keep current schedule" actions.
4. **Rejection Safety:** Rejecting the proposal leaves the existing schedule strictly unchanged.
5. **Undo:** Approved adaptations support immediate undo back to the prior schedule version.

---

## F. User Experience & Interaction Strategy

### 1. Screen Architecture & Information Flow `[Confirmed Requirement]` (`PRD.md` § 4)
Following the plan-first model, the user experience is structured around three global destinations and a rich plan workspace:

```
Global Navigation:  [Plans] (Default)  |  [Today] (Combined Agenda)  |  [Settings] (Global Defaults & Data)
                         │
                         ▼ (Select or Create Plan)
Plan Workspace:     [Plan Title & Context Header]
                    Tabs:  Overview  |  Schedule  |  Roadmap  |  Revisions  |  Progress  |  Settings
```

### 2. Major User Workflows & States `[Confirmed Requirement]` (`PRD.md` § 6)

#### Workflow 1: Plans Home (Default Entry Point)
- **Primary Goal:** View active plans at a glance; initiate plan creation.
- **Card Content:** Plan title, mode badge (`roadmap_only` vs `pre_scheduled`), deadline, progress bar (% and task ratio), next scheduled session.
- **States:**
  - *Empty State:* Clean canvas explaining what a plan is, with an **"Import Roadmap"** primary button.
  - *Populated State:* Grid/list of cards with contextual actions (Open, Export, Archive, Delete).

#### Workflow 2: Create Plan / Import Wizard (3 Steps)
- **Step 1 — Import & Validate:**
  - Dropzone for `.json` roadmaps with instant Ajv validation.
  - *Error State:* Grouped into Blocking Errors and Warnings with specific task titles. If repairs exist, provides an explicit **"Preview & Apply Repair"** button with revalidation.
- **Step 2 — Availability & Capacity:**
  - Available day toggles (Mon–Sun), daily study budget, buffer percentage (default 15%), optional time windows.
- **Step 3 — Feasibility Review:**
  - Feasibility verdict: If feasible, shows total hours, weekly load, and completion date.
  - *Infeasible State:* Highlights the exact capacity deficit and unallocated tasks in warning text (never green). Outlines options: increase daily hours, add study days, or extend target date.
  - Primary CTA: **"Create Plan"** or **"Use Supplied Schedule"**.

#### Workflow 3: Plan Overview & Roadmap Tree
- **Overview:** Answers the 4 key questions: What is this plan? Where am I? What is next? Is anything at risk?
- **Roadmap Tree:** Visual hierarchy of groups, topics, and tasks. Tasks clearly distinguished from group containers. Status badges (`completed`, `in_progress`, `blocked`). Tasks blocked by prerequisites show lock indicators with tooltip explanations.

#### Workflow 4: Schedule Views & Today Agenda
- **Views:** Day, Week, and Agenda perspectives. Mobile defaults to Agenda view to prevent dense, unreadable calendar grids.
- **Session Cards:** Compact cards utilizing pastel category fills (Mint, Lavender, Sky, Peach), displaying task title, topic context, duration, and action button.

#### Workflow 5: Focus Session Execution
- **Focus Mode:** Dedicated clean view with task title, topic breadcrumb, active timer (elapsed/countdown), and controls (Start, Pause, Resume, Finish).
- **Finish Dialog:** Logs actual duration, state (`completed`, `partially_completed`, `blocked`), and optional quick recall rating (`Easy`, `Partial`, `Difficult`, `Skip`).

---

## G. Ordered Implementation Milestones

```
[Tier 1: Validation Checkpoint Slice]
Milestone 0: Next.js Project Scaffolding & Tooling Baseline
     │
     ▼
Milestone 1: Canonical Roadmap Contract & Validation Engine
     │
     ▼
Milestone 2: Deterministic Scheduling Engine & Feasibility Diagnostics
     │
     ▼
Milestone 3: Local Persistence Layer & Application State
     │
     ▼
Milestone 4: Core App Shell & Plans Workspace (UI Baseline)
     │
     ▼
Milestone 5: Roadmap Import & Feasibility Wizard (Onboarding Slice)
     │
     ▼
Milestone 6: Plan Workspace (Overview, Roadmap Tree, Schedule & Today Agenda)
     │
     ▼
Milestone 7: Focus Session & Progress Logging (Validation Checkpoint Proven)
     │
     ▼
[Tier 2: Complete V1 Release Scope]
Milestone 8: Safe Adaptation & Missed Work Flow
     │
     ▼
Milestone 9: Revision Subsystem (Regular & Serious)
     │
     ▼
Milestone 10: Progress Analytics & Data Governance
     │
     ▼
Milestone 11: Production Hardening, Accessibility & Launch Readiness
```

---

### Milestone 0: Next.js Project Scaffolding & Tooling Baseline

- **Objective:** Establish a clean, minimal Next.js + TypeScript + Tailwind CSS development environment with strict compiler settings, testing harness, and brand assets before writing application logic.
- **Concrete Deliverables:**
  - Initialize clean Next.js (App Router) + React + TypeScript project at workspace root.
  - Configure ESLint, Prettier, and TypeScript with strict compiler options (`"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`).
  - Configure Tailwind CSS with the PRD design tokens (palette, spacing, radii, typography scale).
  - Configure Vitest with a passing smoke test.
  - Verify and integrate Skedra logo assets from `design-references/logo.svg` (with `design-references/logo.skedra.png` as fallback) into an SVG logo component.
  - Define root scripts: `dev`, `build`, `test`, `typecheck`, `lint`.
  - **Zero placeholder screens, zero speculative UI.**
- **Affected Folders/Files:**
  - `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.js`
  - `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
  - `src/components/common/Logo.tsx`
  - `src/tests/smoke.test.ts`
- **Dependencies & Prerequisites:** Approved Next.js stack `[Confirmed Requirement]`.
- **Automated Tests & Verification:**
  - `npm run build` exits 0 with zero warnings.
  - `npm run test` executes smoke test and exits 0.
  - `npm run typecheck` and `npm run lint` exit 0.
- **Acceptance Criteria:**
  - Clean build and test pipeline operational.
  - Tailwind tokens match `PRD.md` specification.
  - No application business logic or placeholder screens are added yet.

---

### Milestone 1: Canonical Roadmap Contract & Validation Engine

- **Objective:** Define and enforce the external data contract for Skedra roadmaps with mode-aware validation, graph analysis, and repair preview capabilities.
- **Concrete Deliverables:**
  - Author canonical JSON Schema (`schemas/roadmap.schema.json`) supporting both `roadmap_only` and `pre_scheduled` modes with multi-allocation task support.
  - Generate TypeScript interfaces matching the JSON Schema strictly (`src/types/roadmap.ts`).
  - Implement validation engine using Ajv (`src/engine/validator/schemaValidator.ts`).
  - Implement graph analysis (`src/engine/validator/graphValidator.ts`): detect circular dependencies (Kahn's algorithm / DFS) and orphan prerequisite references.
  - Implement repair engine (`src/engine/validator/repairEngine.ts`): propose repairs with reasons, generate before/after preview, require approval, and revalidate.
  - Create fixture library in `tests/fixtures/roadmaps/`: valid `roadmap_only`, valid `pre_scheduled` (multi-allocation), cyclic graph, duplicate IDs, missing fields, corrupted duration.
- **Affected Folders/Files:**
  - `schemas/roadmap.schema.json`
  - `src/types/roadmap.ts`
  - `src/engine/validator/schemaValidator.ts`
  - `src/engine/validator/graphValidator.ts`
  - `src/engine/validator/repairEngine.ts`
  - `src/tests/engine/validator.test.ts`, `src/tests/fixtures/roadmaps/*`
- **Dependencies & Prerequisites:** Milestone 0.
- **Automated Tests & Verification:**
  - Valid `roadmap_only` passes validation with zero errors.
  - Valid `pre_scheduled` passes and enforces allocation presence and integrity.
  - Circular dependencies detected with exact cycle path reported.
  - Orphan dependencies and duplicate IDs fail with specific item pointers.
  - Repair proposals produce correct diffs and pass revalidation.
- **Acceptance Criteria:**
  - Roadmap contract is fully defined, supports multi-allocations, and is 100% test-covered.
  - Engine is pure TypeScript with zero UI or browser DOM dependencies.

---

### Milestone 2: Deterministic Scheduling Engine & Feasibility Diagnostics

- **Objective:** Build the pure, algorithmic scheduling core capable of generating capacity-bounded schedules and diagnosing feasibility without UI or database dependencies.
- **Concrete Deliverables:**
  - Implement topological sorter and task eligibility evaluator.
  - Implement deterministic priority ranker with stable tie-breakers.
  - Implement capacity allocator: allocate tasks into daily budgets, deduct buffer percentage, enforce breaks, handle non-working days.
  - Implement task splitter for `roadmap_only` mode (preserving stable task identity and total effort).
  - Implement `pre_scheduled` mode validator (strictly preserves allocations, performs zero automatic modifications).
  - Implement mathematically sound feasibility diagnostics: compute required effort, net available capacity, aggregate capacity deficit, unallocated tasks, and deadline/bottleneck conflicts.
- **Affected Folders/Files:**
  - `src/types/scheduler.ts`
  - `src/engine/scheduler/topologicalSort.ts`
  - `src/engine/scheduler/priorityRanker.ts`
  - `src/engine/scheduler/capacityAllocator.ts`
  - `src/engine/scheduler/taskSplitter.ts`
  - `src/engine/scheduler/feasibilityEvaluator.ts`
  - `src/engine/scheduler/index.ts`
  - `src/tests/engine/scheduler.test.ts`
- **Dependencies & Prerequisites:** Milestone 1.
- **Automated Tests & Verification:**
  - Determinism test: identical inputs produce identical schedule allocations across multiple runs.
  - Capacity test: daily allocations never exceed `dailyBudget - buffer - breaks`.
  - Infeasibility test: 100 hours of work across a 70-hour window reports an exact 30-hour capacity deficit and identifies unallocated tasks.
  - Bottleneck test: prerequisite chains exceeding task-level deadlines are flagged as deadline conflicts even if total aggregate hours exist.
  - Mode test: `pre_scheduled` allocations are returned 100% identical to input.
- **Acceptance Criteria:**
  - The engine generates valid schedules or honest feasibility diagnostics for all fixture roadmaps.
  - Engine has 0 external dependencies besides standard math/date utilities.

---

### Milestone 3: Local Persistence Layer & Application State

- **Objective:** Provide robust, transactional local browser storage (IndexedDB via Dexie) with a clean repository abstraction, data migrations, and export/restore capabilities.
- **Concrete Deliverables:**
  - Configure Dexie database schema (`src/db/database.ts`) with tables for plans, tasks, sessions, progress events, and settings.
  - Implement Repository pattern: `PlanRepository`, `TaskRepository`, `SessionRepository`, `ProgressRepository`.
  - Implement full application JSON export generator (`src/db/export.ts`).
  - Implement backup restore engine with schema validation, timestamp check, and transactional database replacement (`src/db/restore.ts`).
  - Implement IndexedDB fake/in-memory setup for unit and repository tests.
- **Affected Folders/Files:**
  - `src/db/database.ts`, `src/db/schema.ts`
  - `src/db/repositories/planRepository.ts`, `src/db/repositories/taskRepository.ts`, etc.
  - `src/db/backup/exportService.ts`, `src/db/backup/restoreService.ts`
  - `src/tests/db/repository.test.ts`, `src/tests/db/backupRestore.test.ts`
- **Dependencies & Prerequisites:** Milestone 1, Milestone 2.
- **Automated Tests & Verification:**
  - Entity CRUD operations persist and query correctly.
  - Reload test: writing entities, closing db, and reopening verifies 100% persistence.
  - Backup/Restore test: export state, clear db, restore state -> verify exact data equality.
  - Corrupt backup test: restore fails defensively without corrupting existing database.
- **Acceptance Criteria:**
  - Local database layer is fully operational and tested.
  - Data boundary is clean and ready for UI consumption.

---

### Milestone 4: Core App Shell & Plans Workspace (UI Baseline)

- **Objective:** Build the responsive visual application shell and the default Plans Home screen, establishing the authentic Nixtio-inspired aesthetic.
- **Concrete Deliverables:**
  - Build App Shell: compact dark top bar (`#111315`), Skedra SVG logo, global navigation (`Plans`, `Today`, `Settings`), responsive mobile navigation.
  - Build Plans Home (`src/components/plans/PlansView.tsx`):
    - Top action bar with "New plan" primary action.
    - Plan card grid / list: title, mode badge, deadline, progress bar, next session info.
    - Contextual menu on cards (Archive, Export, Delete).
    - First-use empty state with clear illustration/copy and prominent CTA.
    - Skeleton loading state matching card geometry.
- **Affected Folders/Files:**
  - `src/components/layout/AppShell.tsx`, `src/components/layout/TopBar.tsx`, `src/components/layout/MobileNav.tsx`
  - `src/components/plans/PlansView.tsx`, `src/components/plans/PlanCard.tsx`, `src/components/plans/EmptyPlans.tsx`
  - `src/components/common/ProgressBar.tsx`, `src/components/common/Badge.tsx`
  - `src/tests/ui/plansView.test.tsx`
- **Dependencies & Prerequisites:** Milestone 0, Milestone 3.
- **Automated Tests & Verification:**
  - Render Plans Home with empty state and populated state.
  - Manual contrast verification for text on dark top bar and white cards.
  - Responsive test: layout reflows cleanly from desktop grid to single-column mobile list.
- **Acceptance Criteria:**
  - The user can see their list of plans or an actionable empty state.
  - Design reflects the Nixtio visual reference without AI-slop cliches.

---

### Milestone 5: Roadmap Import & Feasibility Wizard (The Onboarding Slice)

- **Objective:** Implement the end-to-end roadmap import wizard, connecting schema validation, availability configuration, and scheduling feasibility.
- **Concrete Deliverables:**
  - Build 3-Step Wizard modal/view (`src/components/wizard/ImportWizard.tsx`):
    - **Step 1:** File drag-and-drop / file selector, Ajv validation integration, error/warning breakdown, and repair preview modal with user approval.
    - **Step 2:** Availability setup: days of week, daily hours, buffer percentage, session duration limits.
    - **Step 3:** Feasibility review: total workload vs. capacity comparison, workload deficit banner (if infeasible), and plan confirmation.
  - Persist newly created Plan, Tasks, and Scheduled Sessions into IndexedDB upon confirmation.
- **Affected Folders/Files:**
  - `src/components/wizard/ImportWizard.tsx`, `src/components/wizard/StepImport.tsx`
  - `src/components/wizard/StepAvailability.tsx`, `src/components/wizard/StepReview.tsx`
  - `src/components/wizard/ValidationSummary.tsx`, `src/components/wizard/FeasibilityBanner.tsx`
  - `src/tests/ui/importWizard.test.tsx`
- **Dependencies & Prerequisites:** Milestone 1, Milestone 2, Milestone 3, Milestone 4.
- **Automated Tests & Verification:**
  - Import valid roadmap -> step through wizard -> plan appears on Plans Home.
  - Import invalid roadmap -> blocking errors displayed inline with task names; "Next" button disabled.
  - Import infeasible roadmap -> exact capacity deficit displayed; warning banner rendered.
- **Acceptance Criteria:**
  - A user can upload a roadmap file, configure their schedule, review feasibility, and instantiate a live plan in IndexedDB.

---

### Milestone 6: Plan Workspace (Overview, Roadmap Tree, Schedule & Today Agenda)

- **Objective:** Build the core inspection screens inside an active plan, allowing users to browse their roadmap hierarchy and review their schedule.
- **Concrete Deliverables:**
  - Plan Workspace header: Plan title, mode badge, local tab navigation (`Overview`, `Schedule`, `Roadmap`, `Settings`).
  - **Plan Overview Tab:** Progress metrics, upcoming milestone, next scheduled session card with "Start" CTA, and feasibility alerts.
  - **Roadmap Tab:** Expandable topic hierarchy tree, task list with effort badges, dependency locks, and task detail drawer.
  - **Schedule Tab:** Week view, Day view, and Agenda view. Sessions rendered with pastel category backgrounds and clear text labels.
  - **Global Today View:** Combined cross-plan chronological agenda accessible from global navigation.
- **Affected Folders/Files:**
  - `src/components/plan/PlanWorkspaceView.tsx`, `src/components/plan/PlanHeader.tsx`
  - `src/components/plan/OverviewTab.tsx`, `src/components/plan/RoadmapTab.tsx`
  - `src/components/plan/ScheduleTab.tsx`, `src/components/schedule/SessionCard.tsx`
  - `src/components/today/TodayView.tsx`, `src/components/task/TaskDetailDrawer.tsx`
  - `src/tests/ui/planWorkspace.test.tsx`
- **Dependencies & Prerequisites:** Milestone 5.
- **Automated Tests & Verification:**
  - Navigate between tabs without losing plan state.
  - Roadmap tree correctly displays prerequisites and block statuses.
  - Schedule accurately renders sessions across day/week/agenda views.
  - Today view aggregates sessions from all active plans for the current date.
- **Acceptance Criteria:**
  - Full structural and temporal inspection of an imported plan is functional.

---

### Milestone 7: Focus Session & Progress Logging (Validation Checkpoint Slice)

- **Objective:** Deliver the execution layer: running a study session, tracking elapsed time, and logging progress into IndexedDB with 100% reload durability.
- **Concrete Deliverables:**
  - Focus Session Modal/View (`src/components/focus/FocusSessionView.tsx`):
    - Clean, distraction-free interface with task title and parent topic context.
    - Active stopwatch / countdown timer with Play, Pause, Resume, and Finish buttons.
  - Session Completion Dialog:
    - Input actual duration (prefilled with timer value).
    - Status selection (`Completed`, `Partially completed`, `Blocked`).
    - Optional quick recall rating (`Easy`, `Partial`, `Difficult`, `Skip`).
  - Update `TaskEntity` and `ScheduledSessionEntity`, append `ProgressEventEntity` to IndexedDB.
  - Verify reload durability: refresh browser during or after session and verify progress is completely preserved.
- **Affected Folders/Files:**
  - `src/components/focus/FocusSessionView.tsx`, `src/components/focus/TimerDisplay.tsx`
  - `src/components/focus/SessionFinishModal.tsx`, `src/components/focus/RecallRatingSelector.tsx`
  - `src/engine/progress/progressService.ts`
  - `src/tests/ui/focusSession.test.tsx`, `src/tests/integration/executionLoop.test.ts`
- **Dependencies & Prerequisites:** Milestone 6.
- **Automated Tests & Verification:**
  - Start session -> tick timer -> finish as "Completed" -> task state updates in Roadmap and Schedule.
  - Interrupted session test: pause halfway -> record partial progress -> remaining effort updates correctly.
  - Browser reload test: simulate browser reload, verify all logged minutes and state transitions persist.
- **Acceptance Criteria:**
  - **The First Implementation Checkpoint is Proven:** Import -> Validate -> Schedule/Preserve -> Plan Workspace -> Execute Focus Session -> Reload Durability (`context.md` § 22).

---

### Milestone 8: Safe Adaptation & Missed Work Flow (Tier 2 V1 Scope)

- **Objective:** Implement non-cascading schedule adaptation for missed work, featuring impact diff previews, explicit approval gates, and undo support.
- **Concrete Deliverables:**
  - Missed work detector: identify past-due scheduled sessions that were not completed.
  - Schedule adaptation engine: calculate reallocation of unfinished effort across future days without blindly overloading tomorrow.
  - Change Proposal Modal (`src/components/adaptation/ChangeProposalModal.tsx`):
    - Plain-language explanation of why the change is proposed.
    - Before/after schedule comparison (shifted dates, affected sessions).
    - Clear "Approve changes" and "Keep current schedule" buttons.
  - Rejection safety: rejecting the proposal leaves the schedule strictly untouched.
  - Undo action for approved adaptations.
- **Affected Folders/Files:**
  - `src/engine/adaptation/missedWorkEngine.ts`, `src/engine/adaptation/diffGenerator.ts`
  - `src/components/adaptation/ChangeProposalModal.tsx`, `src/components/adaptation/ScheduleDiffView.tsx`
  - `src/tests/engine/adaptation.test.ts`, `src/tests/ui/adaptationModal.test.tsx`
- **Dependencies & Prerequisites:** Milestone 7.
- **Automated Tests & Verification:**
  - Simulate missed session -> trigger adaptation -> diff shows reallocation over future days.
  - Reject proposal test -> schedule retains original dates.
  - Approve proposal test -> schedule updates; undo reverts to previous state.
  - `pre_scheduled` safety test: missed sessions in pre-scheduled mode prompt for manual user rescheduling and never mutate automatically.
- **Acceptance Criteria:**
  - The system handles disruptions gracefully, maintaining feasibility without user panic or cascading backlogs (`context.md` § 11).

---

### Milestone 9: Revision Subsystem (Regular & Serious) (Tier 2 V1 Scope)

- **Objective:** Integrate spaced retention (Regular Revision) and pre-deadline sprint (Serious Revision) into the scheduler within a shared daily capacity budget.
- **Concrete Deliverables:**
  - Revision configuration UI in Plan Settings: independent toggles for Regular and Serious revision, editable interval sequences (5, 10, 20, 40, 80 days), and serious revision start window.
  - Revision queue generator: automatically schedule spaced review sessions when tasks complete.
  - Capacity budgeting: revision sessions claim time from the shared daily budget alongside learning sessions.
  - Recall assessment adaptation: Easy/Partial/Difficult feedback gently calibrates subsequent intervals; neutral handling of skipped recall.
  - Missed revision dialog: prompt user to reschedule, skip, or reset interval sequence.
- **Affected Folders/Files:**
  - `src/engine/revision/regularRevisionEngine.ts`, `src/engine/revision/seriousRevisionEngine.ts`
  - `src/components/plan/RevisionsTab.tsx`, `src/components/revision/RevisionQueue.tsx`
  - `src/components/revision/RevisionSettingsCard.tsx`
  - `src/tests/engine/revision.test.ts`, `src/tests/ui/revisionsTab.test.tsx`
- **Dependencies & Prerequisites:** Milestone 7, Milestone 8.
- **Automated Tests & Verification:**
  - Complete task -> regular revision session scheduled at T + 5 days.
  - Shared capacity test: learning + revision never exceeds daily workload budget.
  - Skipped recall test: skipping rating preserves default interval without penalty.
  - Serious revision test: triggers comprehensive review only within configured pre-deadline window.
- **Acceptance Criteria:**
  - Long-term retention is seamlessly balanced against new curriculum work (`context.md` § 10).

---

### Milestone 10: Progress Analytics & Data Governance (Tier 2 V1 Scope)

- **Objective:** Add data-backed progress charts, velocity learning calibration, and full application backup/restore surfaces.
- **Concrete Deliverables:**
  - Build Progress Tab charts (using lightweight SVG components):
    - Plan Completion (% and total task ratio).
    - Planned vs. Actual Study Time over selected date range.
    - Work Completed by Topic / Workstream.
    - Daily Workload Distribution.
  - Chart requirements: defined units, zero fabricated data, clean empty states, tap-to-inspect values, fully responsive (`context.md` § 12, `PRD.md` § 6).
  - Duration estimate calibration: observe persistent ratio of actual to estimated time and surface recommendation to calibrate future estimates (with reset option) (`context.md` § 9).
  - Global Settings: Export full backup JSON, validated Restore with preview modal, notification toggles.
- **Affected Folders/Files:**
  - `src/components/plan/ProgressTab.tsx`, `src/components/charts/PlannedVsActualChart.tsx`
  - `src/components/charts/TopicCompletionChart.tsx`, `src/components/charts/WorkloadChart.tsx`
  - `src/engine/progress/estimationCalibrator.ts`
  - `src/components/settings/SettingsView.tsx`, `src/components/settings/BackupRestoreCard.tsx`
  - `src/tests/ui/progressTab.test.tsx`, `src/tests/ui/backupRestore.test.tsx`
- **Dependencies & Prerequisites:** Milestone 7, Milestone 9.
- **Automated Tests & Verification:**
  - Charts render accurately with real progress event data; empty state displays when data is sparse.
  - Full application export downloads valid JSON; restore validates timestamp and successfully repopulates all plans.
  - Calibration test: consistently 2x actual durations prompt a calibration proposal without silently lowering goals.
- **Acceptance Criteria:**
  - Progress insights are genuine and data-backed; complete data ownership is accessible (`context.md` § 14).

---

### Milestone 11: Production Hardening, Accessibility & Launch Readiness

- **Objective:** Conduct rigorous accessibility audits, mobile responsive polish, cross-browser validation, and performance optimization for V1 release.
- **Concrete Deliverables:**
  - WCAG 2.2 AA Contrast Audit: verify dark text against pastel surfaces (`#DDF5E8`, `#F0E3FA`, etc.) and dark chrome navigation (`PRD.md` § 5).
  - Full Keyboard Navigation: ensure all modals, drawers, wizard steps, and focus session controls are 100% navigable via keyboard with visible focus rings.
  - Mobile & Tablet Reflow: test at 360px, 768px, 1024px, and desktop widths. Verify Agenda view on small screens and touch targets >= 44px.
  - Production Build Optimization: bundle inspection, code splitting, asset caching, and zero lint or TypeScript warnings.
  - End-to-end regression suite covering core user workflows.
- **Affected Folders/Files:**
  - `src/app/globals.css` (focus-visible states, media queries)
  - All UI component files (accessibility attributes, aria labels)
  - `playwright.config.ts`, `tests/e2e/*`
- **Dependencies & Prerequisites:** Milestones 0 through 10.
- **Automated Tests & Verification:**
  - Automated accessibility verification confirms 0 high-impact WCAG AA violations.
  - Full Playwright E2E suite passes cleanly on primary desktop and mobile viewports.
  - Production build bundle size remains compact without unneeded dependencies.
- **Acceptance Criteria:**
  - Skedra is robust, accessible, visually refined, and ready for real-world user adoption.

---

## H. Testing and Quality Strategy

### 1. Test Layering Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ 4. End-to-End User Journeys (Playwright)                    │
│    Core Import -> Schedule -> Execute -> Reload flows       │
├─────────────────────────────────────────────────────────────┤
│ 3. UI Component & View Integration (Testing Library)        │
│    Wizard steps, diff modals, calendar agenda rendering     │
├─────────────────────────────────────────────────────────────┤
│ 2. Persistence & Repository Tests (Dexie in-memory / fake)  │
│    Transactional integrity, backup export/restore durability│
├─────────────────────────────────────────────────────────────┤
│ 1. Pure Domain & Engine Tests (Vitest)                      │
│    Schema validation, DAG cycles, scheduler determinism     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Mandatory Test Coverage Invariants `[Confirmed Requirement]` (`context.md` § 7, `AGENTS.md` § 7)
- **Valid `roadmap_only` input:** Generates full schedule respecting capacity and dependencies.
- **Valid `pre_scheduled` input:** Preserves allocations 100% without mutation or splitting.
- **Malformed & Invalid JSON:** Fails gracefully with actionable error pointers; zero uncaught exceptions.
- **Circular Dependency Detection:** Catches cycles (A -> B -> C -> A) and returns the offending loop path.
- **Capacity & Buffer Limits:** Daily planned minutes never exceed `dailyBudget - buffer - breaks`.
- **Infeasibility Diagnostics:** 100 hours of work across a 70-hour window outputs an exact 30-hour capacity deficit and lists unallocated tasks.
- **Determinism:** Identical input objects executed multiple times yield byte-for-byte identical output schedules.
- **Reload Durability:** Progress events and session timer data survive database close and browser reload.
- **Rejection Safety:** Rejecting a schedule adaptation proposal leaves the existing schedule completely unaltered.
- **Transactional Backup Restore:** Corrupt or partial backup payloads fail safely without modifying local data.

---

## I. Open Decisions and Technical Risks

| Item | Impact | Classification | Proposed Approach / Default | Blocks Early Milestones? |
|---|---|---|---|---|
| **App Framework Choice** | Core developer experience, build bundle, routing | `[Confirmed Requirement]` | **Next.js (App Router) + React + TypeScript (Strict)**. Client SPA architecture for local-first IndexedDB state. | **Decided** |
| **Exact Priority Scoring Formula** | Relative ordering of tasks on the same calendar day | `[Proposal]` | Prioritize by critical path depth + deadline proximity; break ties via stable task ID (`context.md` § 21 #1). | No (Refined in Milestone 2) |
| **Pre-Scheduled Schema Format** | Structure of task allocations in JSON schema | `[Open Question]` | Support multiple allocations per task (`scheduledAllocations: ScheduledAllocation[]`). Validate embedded vs top-level in M1. | No (Refined in Milestone 1) |
| **Scheduling Granularity** (Clock Time vs. Daily Budget) | Complexity of calendar grid vs. flexibility for users | `[Proposal]` | Default to daily capacity buckets; support optional start/end clock times when time windows are configured (`context.md` § 8). | No (Refined in Milestone 2) |
| **Split Session Representation** | Entity relationships in local IndexedDB | `[Proposal]` | Single `TaskEntity` for total effort/progress, with multiple `ScheduledSessionEntity` instances allocated across days. | No (Refined in Milestone 3) |
| **Spaced Revision Spacing Formula** | Timing of subsequent review sessions | `[Proposal]` | Start with confirmed preset (5, 10, 20, 40, 80 days). Adjust by 1.3x for Easy, 0.7x for Partial, 1.0x for Skip (`context.md` § 10). | No (Refined in Milestone 9) |
| **Charting Implementation** | Bundle size, accessibility, and maintenance | `[Proposal]` | Use lightweight, accessible native SVG chart components rather than bloated dashboard libraries. | No (Refined in Milestone 10) |
| **Pastel Contrast Compliance** | WCAG 2.2 AA accessibility on soft pastel cards | `[Proposal]` | Use high-contrast dark text (`#15191D`) and subtle dark borders (`#DCE3E6`) on all pastel card fills (`PRD.md` § 5). | No (Audited in Milestone 4 & 11) |

---

## J. Recommended Initial Implementation Task

### The First Step: **Milestone 0 (Next.js Project Scaffolding & Tooling Baseline)**

- **Deliverable:** A fully initialized, clean, and verified Next.js + React + TypeScript project in the workspace root with:
  1. Tailwind CSS configured with all design tokens, colors, radii, and typography scales from `PRD.md`.
  2. Strict TypeScript compiler settings configured.
  3. Vitest test runner installed and configured with a passing smoke test.
  4. Brand asset verification: Skedra SVG logo component integrated from `design-references/logo.svg` (with `design-references/logo.skedra.png` as fallback).
  5. Core scripts defined: `dev`, `build`, `test`, `typecheck`, and `lint`.
  6. **Zero placeholder application screens.**
- **Why This Must Come First:**
  - Before writing domain schemas, graph cycle algorithms, or scheduling math, the repository must have an executable TypeScript environment and an automated test runner.
  - This ensures every line of code written in Milestone 1 (the canonical roadmap contract) is developed test-first and verified immediately against the build engine.
  - It creates zero speculative abstractions or premature application screens, taking the smallest safe step forward.

---

## Alignment Summary

This implementation plan adheres strictly to the confirmed principles of Skedra:
- **Engine complexity, interface clarity:** Deterministic scheduling under the hood; calm, focused workspace on the surface.
- **Honesty over optimism:** No false feasibility, no silent drops, and mathematically sound deficit calculations.
- **Respect for user sovereignty:** Local-first persistence, protected pre-scheduled roadmaps, and explicit approval for consequential adaptations.
- **Measured, incremental progress:** 12 logically ordered milestones, starting with robust tooling and contract verification, proving the core loop at Milestone 7, and culminating in an accessible, production-hardened V1 release.
