# Skedra — Product Source of Truth

> **Read this before making product, architecture, data-model, or behavior changes.** This document describes the intended product, confirmed decisions, current recommendations, and unresolved details. It does not prove that any feature has been implemented.

> **Current project status:** Product discovery is substantially complete. The actual repository state has not been verified as part of this document. Inspect the working tree and existing application before coding, migrating frameworks, or assuming a feature is missing.

## How to use this document

This file is the source of truth for Skedra's **product vision, intended behavior, features, domain rules, architecture direction, scope, and engineering constraints**. It deliberately does not define detailed screen layouts or a complete visual design system.

Use the project documents by responsibility:

1. **`context.md` — product and engineering source of truth.** Defines what Skedra is, what it must do, confirmed behavior, architecture direction, and what remains unresolved.
2. **`AGENTS.md` — coding-agent operating rules.** Defines how an agent audits the repository, makes changes, tests work, and protects existing code and data.
3. **`PRD.md` — detailed product requirements and UX/UI specification.** It describes user journeys, screen-by-screen requirements, interaction states, responsive behavior, visual direction, component patterns, chart presentation, accessibility, and experience acceptance criteria. Keep it aligned with the product invariants in this file.

The PRD exists as a project artifact and should be placed at the repository root. If a detailed UI decision is not covered by the PRD, use a restrained, reversible default and document the assumption rather than treating it as a confirmed design decision.

Use these distinctions throughout:

- **Confirmed** — a product decision explicitly accepted by the user. Do not change it without asking.
- **Recommended** — a proposed direction that should be verified against the existing codebase and practical needs before adoption.
- **Open** — a technical or product detail not yet decided. Use a conservative, reversible implementation and document the assumption.
- **Implemented** — only use this status after inspecting the code and verifying the behavior with tests or a reproducible manual check.

If this document conflicts with the user's latest explicit instruction, follow the latest instruction and update the document if the change is durable. If implementation details conflict with existing code, inspect the code and explain the smallest safe path forward. Do not treat recommendations as confirmed requirements.

---

## 1. Product identity

- **Name:** Skedra
- **Working tagline:** From roadmap to execution.
- **Category:** Universal roadmap-to-schedule planning and execution application.
- **Primary organizing unit:** A **Plan**, backed by an imported roadmap.
- **Product stage:** Discovery/specification complete enough to begin incremental implementation; verify the repository before claiming a build stage.
- **Brand status:** The name is creatively selected, not legally cleared. Global trademark, company-name, app-store, and domain availability remain unverified.

### Product promise

Give Skedra a structured roadmap and get back a realistic, understandable schedule that can be followed, measured, and adapted without losing user control.

**Core principle: complexity belongs in the engine; clarity belongs in the interface.**

Skedra can have sophisticated scheduling logic internally, but a user should not need to understand dependency graphs, optimization formulas, revision policies, or constraint rules to get started.

## 2. What Skedra does

Skedra turns structured work into an executable plan across domains such as:

- Exam preparation, including GATE-style preparation.
- DSA and interview preparation.
- Courses and certifications.
- Professional learning.
- Projects and multi-step goals.

Skedra is **not primarily an AI roadmap generator**. A user may create a roadmap manually or use an external AI with Skedra's published roadmap template and instructions. Skedra validates the resulting file, then either generates a schedule or presents a complete schedule supplied in the roadmap.

### Core workflow

1. Import a roadmap.
2. Parse and validate it.
3. Confirm availability and essential preferences.
4. Generate a schedule for a `roadmap_only` plan, or validate and preserve a `pre_scheduled` plan.
5. Show workload, feasibility, and important conflicts.
6. Let the user confirm the plan.
7. Execute sessions and record progress.
8. Use actual performance and missed sessions to recommend sensible adjustments.
9. Preserve roadmap versions, progress, and recoverable backups.

## 3. Non-negotiable product principles

1. **Plan-first.** A roadmap/plan is the main workspace. Daily work is the execution layer.
2. **Deterministic scheduling.** Scheduling is algorithmic TypeScript, not an LLM call. Identical inputs, state, and scheduler version should produce the same result.
3. **Feasibility before optimization.** Enforce hard constraints and prerequisites before ranking preferences.
4. **No false feasibility.** Never claim all work fits when it does not.
5. **No silent task dropping.** Required work must not disappear to make a schedule look feasible.
6. **User control.** Never silently change protected schedules, hard constraints, required scope, or hard deadlines.
7. **Explain important recommendations.** Explain meaningful scheduling choices, conflicts, and proposed changes in plain language.
8. **Preserve progress.** Maintain completed work, task identity, partial progress, actual time, and remaining effort through supported schedule changes.
9. **Progressive disclosure.** Sensible defaults should handle the normal path; advanced options appear only when useful.
10. **Local-first v1.** No required account, backend, or cloud sync. Persist locally and support export/restore.
11. **Responsive from the start.** Desktop is the first design target, but core workflows must work on mobile.
12. **Test the engine independently.** Scheduling logic must not depend on React components, browser storage, or network APIs.
13. **Avoid premature complexity.** Build and validate the smallest dependable end-to-end workflow before implementing every advanced feature.

## 4. Roadmap modes

One versioned canonical roadmap contract must support both modes.

### Mode A — `roadmap_only` (**confirmed**)

The roadmap defines scope and structure, not a complete calendar. It contains hierarchy, executable tasks, dependencies, estimates, priorities, relevant constraints, and metadata. Skedra generates the schedule.

- The scheduler may allocate tasks and split large tasks into sessions while preserving total effort and dependency semantics.
- Generated schedules may be adapted under the approval rules.
- Roadmap edits require an impact preview before affected schedule portions are regenerated.

### Mode B — `pre_scheduled` (**confirmed**)

The roadmap supplies the complete schedule, including dates, times, time slots, and task allocations. Skedra presents and tracks the supplied schedule as given.

- Validate the roadmap and its complete supplied schedule.
- Do **not** automatically regenerate, rearrange, reallocate, or split supplied scheduled work.
- Future changes must be explicitly initiated or approved by the user.
- Report inconsistencies or apparent infeasibility honestly; do not silently repair or rewrite the supplied plan.

### Shared rules

- Both modes use the same versioned contract and core task/hierarchy model.
- Validation is mode-aware: complete schedule data is required in `pre_scheduled`, while a schedule is generated for `roadmap_only`.
- Groups, topics, and subtopics are organizational nodes and do not consume time unless explicitly represented as executable tasks.
- Dependencies can cross hierarchy branches.
- IDs must be stable and references must resolve.

## 5. Product workspace structure (high-level)

**Confirmed direction:** plan-first. This section defines the product's major information groups and feature boundaries, not the detailed UI layout.

The plan is the primary organizing unit. Schedule, roadmap content, revisions, and progress belong to that plan. A global Today view may aggregate upcoming sessions across active plans, but it does not replace the plan as the organizing unit.

### Global product areas

- **Plans:** active, completed, and archived plans; status, overall progress, deadlines, create/import actions.
- **Today:** a convenient combined agenda for sessions scheduled across active plans.
- **Settings:** cross-plan defaults, notification preferences, data management, and backup/restore.

Keep global product navigation small. Tasks, schedule, revisions, and progress are primarily plan-scoped capabilities rather than separate global product domains.

### Capabilities within a plan

- **Overview:** goal, target date, progress summary, next session, milestones, and relevant alerts.
- **Schedule:** allocated sessions and day/week/month scheduling data.
- **Roadmap:** hierarchy, topics, executable tasks, dependencies, and completion.
- **Revisions:** configuration and execution of regular revision and serious revision.
- **Progress:** time invested, completion, consistency, completion by topic, and relevant performance measurements.
- **Plan settings:** planning mode, deadline, plan-specific constraints, revision strategy, and overrides.
- **Task details:** task-specific effort, dependencies, state, partial progress, actual time, and optional mastery data.

The exact naming, screen hierarchy, navigation controls, and screen-to-screen flow are not frozen by this document. Those detailed requirements belong in `PRD.md`.

### Visual-design scope boundary

The user supplied a preferred style reference that should be stored in the repository as `docs/design-references/Nixtio.jpg` for future UI/UX work. It is a reference for visual direction only, not a mandate to copy another product's brand, layout, content, or component arrangement. Previous AI-generated Skedra mockups were rejected and are not approved designs.

This file intentionally does **not** define color tokens, font choices, font sizes, spacing scales, component styling, screen layouts, responsive breakpoints, or detailed chart treatments. Capture and maintain those in `PRD.md`, using the reference image and actual workflows. Do not infer a final design system from the image alone.

## 6. Roadmap contract and import validation

The roadmap format is a public, versioned interface between Skedra and external authoring tools. Exact property names must be designed and tested before the schema is frozen.

### Required concepts

- Schema version, e.g. `schemaVersion`.
- Stable roadmap ID and metadata.
- Planning mode: `roadmap_only` or `pre_scheduled`.
- Target date/date range and relevant constraints.
- Hierarchical roadmap nodes.
- Stable IDs for nodes and executable tasks.
- Dependencies/prerequisites.
- Estimated duration and scheduling-critical task properties.
- Optional custom metadata.
- Complete schedule data in `pre_scheduled` mode.

**Recommended implementation:** JSON Schema as the canonical contract, TypeScript types aligned with it, and Ajv for runtime validation. Do not finalize field-level details until representative examples and tests exercise both planning modes.

### Validation must detect

- Invalid JSON or unsupported schema version.
- Missing required fields or invalid types.
- Duplicate IDs.
- Missing/invalid dependency references.
- Circular dependencies.
- Invalid dates/deadlines.
- Negative or invalid durations.
- Missing or incomplete `pre_scheduled` allocations.
- Contradictory constraints or impossible schedule allocations.
- Other mode-specific inconsistencies.

### Import repair policy (**confirmed**)

1. Validate first.
2. Explain errors clearly and identify the affected item.
3. Propose repairs with reasons and expected consequences.
4. Require user approval before applying repairs.
5. Revalidate the repaired data.
6. Import only after validation passes.
7. Preserve the original upload and user intent.
8. Ask for clarification if a repair is ambiguous; do not guess.

Never silently create required tasks, drop tasks, or invent dependencies.

## 7. Scheduling engine

### Architecture

Implement a pure TypeScript scheduling module independent of UI, storage, and network code. Inputs should include the roadmap, planning mode, relevant constraints/preferences, progress state, revision configuration, and scheduler version. The result should include both schedule allocations and diagnostics/feasibility information.

### Conceptual stages

1. Validate the roadmap and dependency graph.
2. Determine eligible work based on dependencies, dates, task status, and rules.
3. Rank eligible work with a deterministic, context-aware priority score.
4. Allocate work into available days/time windows while enforcing capacity and hard constraints.
5. Coordinate new learning and revision within a shared capacity budget.
6. Detect unmet deadlines, unallocated work, and constraint conflicts.
7. Produce a proposed schedule and plain-language feasibility report.
8. During adaptation, compare proposed and current schedules and minimize unnecessary disruption.

### Priority factors (**factors confirmed; formula open**)

Consider:

- Importance.
- Urgency/deadline proximity.
- Difficulty and effort.
- Prerequisites and work blocked by delay.
- Momentum and achievable progress.
- Consequences of postponement.
- Revision urgency and recall/performance where relevant.

Priority is not feasibility. A task's priority score cannot override a hard constraint.

### Constraints

Hard constraints must never be violated. Soft preferences may be unmet when a plan is infeasible, but consequential unmet preferences should be surfaced.

Potential hard constraints include prerequisites, explicit maximum workload, protected deadlines, and protected `pre_scheduled` allocations. Preferred study days and time ranges require explicit hard-versus-soft semantics in settings and the data model.

If roadmap constraints conflict with user settings, explain the conflict and ask which constraint to change or override. Never silently choose.

### Infeasible plans (**confirmed**)

If 100 hours of required work must fit into a period that allows only 70 hours, report the 30-hour gap. Explain trade-offs such as increasing capacity, extending a deadline, or explicitly reducing/defering scope. Require a user decision and revalidate after changes.

Never silently:

- Drop required work.
- Exceed user capacity limits.
- Move hard deadlines.
- Claim an infeasible plan is feasible.
- Override conflicting constraints.

### Determinism and tests

- Same inputs/state and scheduler version produce the same result.
- Use deterministic tie-breakers.
- Keep priority scoring separate from feasibility checks.
- Protect completed work and recorded progress.
- Test dependency ordering, cycles, capacity, deadlines, buffers, infeasibility, and mode-specific behavior.

**Open:** score formula/weights, normalization, tie-breaker order, constraint tolerances, and exact approval thresholds. Do not portray arbitrary values as confirmed decisions.

## 8. Availability, session length, splitting, and buffers

Users should be able to set:

- Available days.
- Daily work budget.
- Preferred/allowed time windows.
- Break preferences.
- Buffer policy (fixed minutes or percentage).
- Default session duration.
- Minimum and maximum session duration.

### Time-slot granularity (**open**)

Current recommendation: use exact clock-time allocations where a user defines time windows; use daily allocations if only a daily budget is provided. Validate this against UX and `pre_scheduled` import requirements before locking it into the contract.

### Task splitting (**confirmed for generated schedules**)

Large tasks may be split into manageable sessions in `roadmap_only` mode. Splitting must preserve stable task identity, total estimated effort, dependency semantics, progress, remaining effort, and links between the task and generated sessions. Do not automatically split or rearrange protected pre-scheduled work.

### Duration estimates

Use configurable defaults and adapt only within user-defined limits. Task kind/difficulty and observed completion history may inform estimates. Keep estimated time, actual time, and remaining effort distinct. Exact estimation formulas remain open.

### Buffers (**confirmed**)

Buffer is reserved capacity, not planned work. Support a fixed buffer or percentage. Example: a 15% buffer on 180 available minutes reserves 27 minutes, leaving 153 minutes of planned work before separately defined breaks. If the buffer is consumed, reassess rather than silently overload the day.

## 9. Tasks, sessions, progress, and performance learning

### Task states (**confirmed**)

Use these internal states and human-readable labels:

- `not_started` — Not started
- `in_progress` — In progress
- `completed` — Completed
- `partially_completed` — Partially completed
- `blocked` — Blocked

Track completion percentage where useful, actual time, remaining effort, partial progress, and optional mastery/confidence.

### Interrupted sessions (**confirmed**)

Preserve recorded progress and actual time. Let the user resume or reschedule remaining work rather than restarting automatically or losing completed effort.

### Performance-aware planning (**confirmed direction; formula open**)

Compare estimated with actual effort and learn from persistent completion/capacity patterns. Distinguish persistent trends from temporary disruptions. Explain material estimate changes and let users inspect/reset learned estimates.

Performance learning must not silently lower goals, remove required work, or execute consequential schedule changes without approval.

## 10. Revision subsystem

Revision is optional and shares the same scheduler and capacity budget as new learning. Keep two distinct types.

### Regular revision

- Supports long-term retention through spaced reviews.
- Triggered by learning/completion and a configurable interval strategy.
- Has configurable review count and intervals.
- May include optional active recall.
- Prefers weekends or user-selected days, with a configurable window around due dates.
- May adapt intervals based on recall performance.
- Can continue after the main deadline if enabled.
- Can be disabled independently from serious revision.

A proposed General Retention preset uses intervals of 5, 10, 20, 40, and 80 days **between consecutive reviews**. This is a configurable starting point, not a universal scientific optimum.

### Serious revision

- Supports comprehensive preparation before a configured deadline, often an exam.
- Is independently optional; an exam deadline alone must not enable it.
- The user chooses the start window.
- May include comprehensive review, weak-area work, timed questions, practice papers, and mock tests.
- Ends at the configured deadline.

### Presets and customization (**confirmed**)

Presets are complete editable starting configurations. Users can customize interval sequences, review count, active recall, preferred days/windows, duration limits, adaptive behavior, serious-revision start window, and whether either revision type is enabled. Users may save custom strategies.

### Recall assessment and adaptation

Default to a quick self-rating such as Easy, Partial, or Difficult. Use quiz/practice results when available. Allow skipping; skipped assessment does **not** mean poor recall.

Proposed adaptation direction:

- Easy → consider extending the interval.
- Partial → consider shortening the interval.
- Difficult → consider earlier review or relearning.
- Skipped → do not infer forgetting.

Exact thresholds and formulas are open.

### Missed revisions (**confirmed**)

Ask the user whether to reschedule, skip, or reset the revision sequence. Do not silently discard/reset it. If revision does not fit alongside new learning, compare feasible choices and explain trade-offs. A quick recall session should not count as a full exam-preparation session unless it genuinely meets that purpose.

## 11. Schedule adaptation, approvals, undo, and history

### Missed work (**confirmed**)

Do not blindly add unfinished work to tomorrow. Reassess remaining work, deadlines, dependencies, priority, capacity, and future workload. Offer a feasible proposal and show consequences.

### Significant changes

Show a before/after preview, explain why the proposal is being made, and require approval. If rejected, retain the current schedule. Support undo for supported changes.

The threshold for what counts as significant remains open. Routine updates may be automatic only if the user explicitly enables a clearly bounded policy.

### Roadmap edits

When a roadmap is edited, preview impacts on affected allocations, dependencies, deadlines, and workload before regenerating the affected parts of a generated schedule.

### Pre-scheduled protection

Supplied allocations remain unchanged unless the user explicitly initiates or approves a change. No silent rescheduling or task splitting in this mode.

### Versioning

Preserve the original imported roadmap. Maintain versions after edits and retain enough change history to explain or undo supported transformations. Exact retention limits remain open.

## 12. Charts and progress reporting

Graphs and charts are a **product requirement**, not decoration. Each chart should answer a useful question with a defined metric, readable labels, and a relevant time range.

### Candidate chart families

- Overall roadmap completion.
- Planned versus actual study time over time.
- Weekly workload versus completed effort.
- Completion by subject/topic/workstream.
- Milestone progress.
- Consistency/streaks where meaningful.
- Estimated versus actual task duration.
- Recall/mastery trends when sufficient data exists.

### Chart requirements

- Use titles, labels, units, and legends where appropriate.
- Do not rely on color alone to communicate status.
- Support hover/tap inspection of values.
- Provide meaningful empty states and avoid implying trends from insufficient data.
- Do not put every metric on one crowded dashboard.
- Make charts responsive and readable on mobile.
- On mobile, prefer clear compact charts and agenda-first calendar interactions.

The MVP chart list and metric definitions are open and should be selected based on workflow needs and testing.

## 13. Settings and notifications

Notifications are configurable and disabled until the user enables them. Supported categories include upcoming sessions, deadlines, overdue work, and relevant schedule updates.

Suggested settings groups:

- General/appearance.
- Availability and capacity.
- Scheduling preferences and approval behavior.
- Revision defaults/presets.
- Notifications.
- Data/backup/restore.
- Advanced diagnostics or controls only when needed.

Clearly distinguish global defaults from plan-specific overrides.

## 14. Local data, backups, and restore

### V1 persistence direction (**recommended architecture**)

- Automatically persist local state.
- Use IndexedDB through Dexie for structured data.
- Provide manual export and restore.
- Support optional automatic file backup only where the browser/device supports it and the user has granted permission.
- No required backend, login, or cloud sync in v1.
- Defer PWA-specific polish until the core product is validated.

Do not promise silent access to arbitrary files. Browser filesystem support and permissions vary, especially on mobile.

### Roadmap file versus recovery backup

- **Roadmap file:** imported plan definition, optionally including a supplied schedule.
- **Recovery backup:** full application state, including original roadmap/version references, current schedule, progress, mastery, constraints, permissions, and relevant history.

Use distinct format/schema markers for roadmap and backup formats.

### Safe restore

Backups should include stable IDs, schema/version metadata, timestamps, and integrity metadata (e.g. a checksum where appropriate). Validate and preview before restore. Identify the plan and timestamp, warn about stale backups, and preserve current state until restoration succeeds.

## 15. Recommended technical direction

These are recommendations, not proof of the current repository stack. Inspect the existing project before migrating or replacing anything.

- **Framework:** Next.js + TypeScript if starting fresh or if a migration is justified by repository findings.
- **UI:** React + Tailwind CSS.
- **Roadmap contract:** JSON Schema.
- **Runtime validation:** Ajv.
- **Scheduler:** pure TypeScript module.
- **Local persistence:** IndexedDB via Dexie.
- **Tests:** Vitest.
- **Hosting target:** Vercel.
- **Architecture:** modular monolith, not microservices.
- **Storage boundary:** repository interface so another backend can be added later.
- **V1 auth/backend/cloud sync:** deferred.
- **PWA:** deferred until core value is validated.

### Candidate logical modules

- Roadmap schema and types.
- Import parser and validator.
- Dependency graph validator.
- Scheduling engine and constraint evaluator.
- Feasibility diagnostics.
- Schedule-diff and approval workflow.
- Revision policies.
- Session execution and progress events.
- Performance estimation.
- Local repository/migrations.
- Export/backup/restore.
- Charts and reporting.
- UI routes and components.

The scheduler must be testable without rendering the UI or loading browser storage.

### Conceptual entities (not a finalized database schema)

- **Plan:** metadata, mode, source roadmap ID, date range, constraints, status, schema version.
- **Roadmap node:** stable ID, hierarchy relationship, type, order, metadata.
- **Task:** estimated effort, priority factors, dependencies, status, completion, optional mastery.
- **Scheduled session:** task reference, date/time allocation, planned duration, session type/status.
- **Progress event:** timestamp, actual duration, state transition, partial progress, optional recall.
- **Revision strategy:** settings and preset/version identity.
- **Schedule version/change proposal:** current and proposed allocations, reason, user decision.
- **Backup manifest:** timestamp, format/schema versions, plan identifiers, integrity metadata.

Do not finalize the database shape until the roadmap contract and core use cases are tested.

## 16. MVP scope and build sequence

Build the smallest useful product first. Avoid implementing the entire advanced system before proving the central workflow.

### Phase 0 — Repository audit and contract

- Inspect repository, framework, routes, UI components, data model, persistence, and tests.
- Inventory existing behavior before changing architecture.
- Design the canonical roadmap JSON Schema and planning-mode semantics.
- Create representative valid and invalid sample files.

### Phase 1 — Import and plan workspace

- Import roadmap JSON.
- Parse/validate and show understandable errors.
- Suggest repairs but require approval and revalidation.
- Render roadmap hierarchy and task details.
- Preserve the distinct behavior of `roadmap_only` and `pre_scheduled`.

### Phase 2 — Scheduling core

- Dependency validation and task eligibility.
- Deterministic priority and capacity allocation.
- Availability/time window/buffer handling.
- Feasibility report with unallocated work and constraint diagnostics.
- Tests for determinism, dependencies/cycles, capacity, deadlines, buffers, infeasibility, and mode behavior.

### Phase 3 — Schedule and execution

- Day/week views and global Today shortcut.
- Start/track/update task sessions.
- Record actual time, partial completion, and remaining effort.
- Persist state locally and verify reload behavior.

### Phase 4 — Progress and safe adaptation

- Select well-defined core charts.
- Handle missed sessions and overload proposals.
- Add schedule-diff preview, approval, and undo.
- Add roadmap-edit impact preview and history.
- Calibrate estimates carefully.

### Phase 5 — Revisions and data protection

- Separate regular and serious revision policies.
- Coordinate revision sessions within shared capacity.
- Implement recall capture and missed-review decisions.
- Add export, backup validation, restore preview, and safe restore.
- Add configurable reminders.

### Later, after validation

- Advanced analytics.
- Cloud accounts and sync.
- Full PWA/offline polish where needed.
- Collaboration/sharing.
- More advanced optimization methods.
- AI-assisted roadmap interpretation/generation only if user research justifies it.

This is a proposed sequence. Adjust it after inspecting the actual repository; do not claim any phase is implemented unless verified.

## 17. Acceptance criteria for the first useful release

- A valid `roadmap_only` roadmap imports, validates, and generates a schedule.
- A valid `pre_scheduled` roadmap imports and displays without silent schedule changes.
- Invalid IDs, references, and circular dependencies are reported clearly.
- No repair is applied without approval and revalidation.
- The scheduler never violates hard constraints.
- Infeasibility is reported honestly; required work is not silently discarded.
- Completed work, partial progress, and actual time survive reloads and supported adaptations.
- Missed work does not blindly overload the next day.
- Significant schedule changes are previewed and approved.
- Regular and serious revision can be enabled/disabled independently.
- Export and restore validate the backup and preview before replacement.
- Charts have clear metrics, meaningful empty states, and responsive/mobile layouts.
- The common path works with defaults; advanced setup remains optional.

## 18. Risks and mitigations

- **Overengineering:** Validate import → schedule → execute → progress before completing every feature.
- **Poor scheduling choices:** Keep feasibility separate from ranking, test representative scenarios, and expose diagnostics.
- **Overwhelming UI:** Use progressive disclosure, good defaults, contextual settings, and human language.
- **Destructive changes:** Use previews, approvals, undo, versions, and transactional restore.
- **Noisy performance learning:** Distinguish persistent patterns from temporary disruptions; allow inspection/reset.
- **Browser/mobile limitations:** Treat file-handle backup as optional; always preserve manual export/restore.
- **Brand conflict:** Complete global trademark/domain/business-name clearance before investing heavily in final branding.

## 19. Brand and product-document status

- **Name:** Skedra.
- **Working tagline:** From roadmap to execution.
- **Brand intent:** Engineered, minimal, clear, trustworthy, adaptable.
- **Brand/legal status:** Creative name selected; not legally cleared.
- **Product organization:** Plan-first.
- **Visual reference:** The user-provided image at `docs/design-references/Nixtio.jpg` is the preferred style reference for the upcoming PRD, not a finalized Skedra design.
- **Design-document status:** Detailed visual, interaction, responsive, and screen-specific decisions are intentionally out of scope for this file and belong in `PRD.md`.
- **Previous mockups:** Generated Skedra mockups were rejected; they must not be treated as approved designs.

## 20. Confirmed decision register

The following are the 30 consolidated product decisions accepted during discovery. Detailed behavior appears in the sections above.

1. Use a hybrid deterministic scheduler balancing importance, momentum, workload, and deadlines subject to constraints.
2. Support one versioned schema for Roadmap Only and Pre-scheduled modes; preserve supplied pre-scheduled allocations.
3. Recommend adjustments after missed sessions; do not automatically apply significant changes.
4. Surface constraint conflicts and ask the user which constraint to change or override.
5. Track detailed progress including actual time, partial progress, and optional mastery.
6. Support fixed revision presets plus optional adaptive intervals.
7. Provide complete editable revision presets; allow saving custom strategies.
8. Regular revision may continue after the main deadline if enabled; serious revision ends at its configured deadline.
9. Use quick recall self-ratings by default; use practice results when available; skipped assessment never implies poor recall.
10. Estimate revision duration with configurable defaults and minimum/maximum limits.
11. Track learning at task level and group related work into revision sessions without duplicates.
12. Use a universal core schema with custom metadata and strict scheduler-critical fields.
13. Validate imports first; proposed repairs require approval and revalidation.
14. Report infeasibility and trade-offs; never silently drop required work or claim false feasibility.
15. Use context-aware priorities with explanations; hard constraints outrank scores.
16. Prevent missed work from creating a cascading backlog.
17. Learn duration/capacity estimates from performance, distinguish temporary disruptions, and allow reset.
18. Support configurable breaks and buffer time.
19. Respect user-defined available days and time windows.
20. Split large tasks into sessions when permitted, preserving total effort and dependencies.
21. Support configurable/adaptive session lengths within user bounds.
22. Use five task states: Not started, In progress, Completed, Partially completed, Blocked.
23. Preserve partial progress and actual time for interrupted sessions.
24. Preview roadmap-edit impact before regenerating affected generated schedule portions.
25. Provide daily, weekly, and roadmap views; distinguish planned and completed work.
26. Preview significant changes, request approval, and support undo.
27. Use local persistence, optional authorized file backup, and manual export/restore with validation/preview.
28. Preserve original roadmaps and roadmap versions.
29. Keep notifications configurable and off until enabled.
30. Prioritize dependable import, validation, scheduling, progress, revision, and backup/restore before advanced analytics or cloud sync.

## 21. Open implementation decisions

These are details to resolve through design, code, tests, and representative examples. They do not justify reopening confirmed product decisions or blocking the first prototype.

1. Exact priority-score formula, normalization, weights, and deterministic tie-breaking.
2. Scheduling granularity when only daily capacity is supplied versus explicit time windows.
3. Definition of significant schedule changes and any narrowly bounded routine updates that may be automatic when explicitly enabled.
4. Exact hard/soft constraint schema, duration uncertainty, and feasibility tolerances.
5. Persistent model for task/session splitting, remaining effort, progress events, and schedule versions.
6. Exact revision adaptation formula for Easy/Partial/Difficult recall.
7. Undo semantics and version-history retention policy.
8. Initial chart set, metric formulas, ranges, and minimum data requirements.

Resolve these incrementally. Avoid asking the user to settle every low-level constant before a working prototype exists.

## 22. First implementation checkpoint

Before feature development:

1. Inspect the repository and summarize its framework, routes, components, data/state model, persistence, and tests.
2. Decide whether existing code should be extended or a migration is justified. Do not assume a framework migration.
3. Design and test the canonical roadmap schema with representative examples.
4. Implement import validation and both planning modes.
5. Demonstrate this end-to-end path:

   **Import sample roadmap → validate it → generate or preserve schedule by mode → open plan workspace → complete a task → reload without losing progress.**

This milestone proves the core of Skedra. Add advanced features only after this path is dependable.
