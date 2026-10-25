# AGENTS.md — Skedra Repository Instructions

These instructions govern how coding agents should work in this repository. Read `context.md` first for the product specification, then follow this file for implementation workflow and engineering constraints. If `PRD.md` exists, read it before making UI/UX, interaction, responsive-layout, chart-presentation, or visual-design changes.

Document responsibilities:
- `context.md`: product vision, behavior, features, domain rules, architecture direction, and engineering constraints.
- `AGENTS.md`: operating rules for coding agents.
- `PRD.md`: detailed product requirements and current UI/UX design baseline; check requirement status before treating proposed tokens as final.

If `context.md` is absent, check for `skedra-context.md`. Do not create a replacement specification without first checking existing project documentation. Do not expand `context.md` into a detailed screen-design spec; keep detailed UI decisions in `PRD.md`. When UI changes are requested, read both and use the Nixtio reference only as directional inspiration—not a layout to copy.

## 1. Instruction priority and truthfulness

1. Follow the user's latest explicit request.
2. Treat confirmed decisions and non-negotiable principles in `context.md` as product requirements.
3. Treat items labelled **Recommended**, **Proposed**, or **Open** as provisional; verify them before locking them into contracts or architecture.
4. Inspect the actual repository to determine what exists. Product documentation describes intended behavior, not proof of implementation.
5. When sources conflict or a requirement is ambiguous, do not silently invent a product rule. Choose the safest reversible path, record the assumption, and ask only when the ambiguity blocks meaningful progress.
6. Never claim a feature, test, type check, build, migration, or manual verification succeeded unless it actually did.

## 2. First action: repository audit

Before making substantial changes, inspect:

- Current working directory and Git status.
- Project file tree and package manager.
- Framework, routes, scripts, dependencies, and build configuration.
- Existing components, design tokens, styles, and responsive behavior.
- Existing domain types, roadmap structures, scheduling logic, persistence, and migrations.
- Test setup, test coverage, linting, and type checking.
- Existing documentation (`README`, `context.md`, this file, and relevant feature docs).

Summarize the current state and identify the smallest safe implementation milestone. Do not assume the repo is empty or that it uses a particular framework.

## 3. Protect existing work

- Check `git status` before editing. Preserve user changes and untracked files.
- Never use destructive commands such as `git reset --hard`, `git clean -fd`, or broad deletion to make work easier unless the user explicitly authorizes the exact destructive action.
- Do not overwrite existing files or replace working architecture before understanding them.
- Do not migrate frameworks, rewrite major modules, or add a backend merely because a preferred stack is listed in `context.md`.
- Avoid dependency additions unless a clear benefit justifies the maintenance cost. Explain significant new dependencies.
- Do not commit, push, deploy, or publish unless the user asks. You may recommend a Git checkpoint after verified milestones.
- Never expose secrets, API keys, tokens, private data, or local environment values in logs, code, reports, or commits.

## 4. Work incrementally

For each meaningful task:

1. Identify the relevant product requirement and the smallest useful change.
2. Write a short implementation plan for multi-step work.
3. Implement one coherent vertical slice; avoid unrelated cleanup.
4. Add or update tests alongside behavior changes.
5. Run the narrowest relevant tests first, then type checking, linting, and build checks where configured and practical.
6. Inspect the diff for unintended changes, regressions, unsafe data mutations, and unused code.
7. Report files changed, actual checks performed and results, assumptions, known limitations, and the next milestone.

Do not build the entire application in one unreviewable pass. Do not leave placeholder implementations while describing the feature as complete.

## 5. Skedra product invariants

The following must not be violated to simplify implementation:

- Skedra is **plan-first**. Plans/roadmaps are the main organizing unit; Today is a convenient global agenda.
- The product should feel simple even though the engine is sophisticated. Use progressive disclosure and sensible defaults.
- Two planning modes exist: `roadmap_only` and `pre_scheduled`.
- `roadmap_only` defines the work and allows Skedra to generate a schedule.
- `pre_scheduled` supplies the complete schedule. Preserve it as supplied; never automatically regenerate, rearrange, reallocate, or split its scheduled work.
- Imported roadmap data must be validated before use. Proposed repairs require user approval and revalidation.
- Never silently create, remove, or drop required tasks to make a schedule look feasible.
- Never claim a plan is feasible if required work cannot fit within its constraints.
- Hard constraints and prerequisites outrank priority scores.
- Conflicting constraints must be explained and resolved through explicit user choice; never silently override them.
- Missed sessions must not be blindly piled onto the next day.
- Preserve task identity, completed work, partial progress, actual time, and remaining effort through supported schedule changes.
- Significant schedule changes require a before/after preview and user approval. Rejecting a proposal must leave the current schedule unchanged.
- Performance learning may improve estimates but must not silently lower goals or remove required work.
- Regular revision and serious revision are distinct, optional policies. Neither should be silently enabled contrary to user settings.
- A skipped recall assessment does not mean poor recall.
- Notifications are off until the user enables them.
- V1 is local-first. Do not introduce mandatory accounts, cloud sync, or a backend without explicit product approval.
- Manual export/restore must remain available even if optional browser file-handle backup is implemented.

See `context.md` for the full definitions and edge-case intent.

## 6. Architecture boundaries

### Core domain and scheduler

- Keep scheduling, dependency validation, feasibility evaluation, revision policies, and schedule-diff logic in testable domain modules.
- The scheduler should be pure TypeScript wherever practical. It must not depend directly on React, browser storage, browser-only APIs, or network calls.
- Keep feasibility validation separate from priority ranking.
- Pass inputs explicitly; avoid hidden mutable global state and time-dependent behavior without an explicit injected clock/reference date.
- Use deterministic sorting and tie-breakers. Same inputs, state, and scheduler version should yield the same result.
- Return diagnostics alongside proposed allocations so the UI can explain unscheduled tasks and constraint conflicts.

### Roadmap contract

- The roadmap is an external, versioned data contract, not an informal UI object.
- Use JSON Schema as the canonical runtime contract if compatible with the existing repository; use Ajv if adopted.
- Keep TypeScript types aligned with the schema and add fixtures for valid, invalid, and edge-case roadmaps.
- Preserve custom metadata where the contract permits it, but validate scheduler-critical fields strictly.
- Make validation mode-aware.
- Treat the conceptual entity list in `context.md` as design guidance, not a finalized database schema.

### UI and UX

- Inspect existing design conventions before adding visual primitives.
- Keep the plan-first information architecture. Avoid separate global destinations for every subsystem in the initial version.
- Do not copy prior generated UI mockups; the user rejected them.
- The user-supplied visual reference should be available at `docs/design-references/Nixtio.jpg` and is described in `PRD.md`. Treat it as directional inspiration only; do not copy the source product's exact layout, branding, or content.
- Do not finalize colors, typography, spacing, screen layouts, or detailed component patterns from `context.md`. Follow `PRD.md` if it exists; until then, make only the UI changes needed for the current implementation milestone and avoid inventing a full design system.
- Do not produce generic dashboard clutter or expose every minor option at once.
- Use clear plain-language errors, labels, units, and explanations.
- Charts are required product functionality, but each chart needs a clear question, defined metric, accessible labeling, a useful empty state, and responsive behavior.
- Design mobile layouts intentionally: preserve core workflows, make tap targets usable, and avoid assuming hover-only interactions.
- Use color as a supporting signal, not the only way to distinguish states.
- Keep styling consistent with the current project; do not invent a full design system before the core flows are understood.

### Anti-AI-slop design and authentic product copy

The goal is a credible, intentionally designed product—not a generic AI-generated SaaS template. Treat these rules as implementation constraints whenever creating or modifying the website UI, landing pages, onboarding, product copy, charts, or sample content.

#### Design from the actual product

- Read the relevant `context.md` requirements and `PRD.md` screen specification before designing. Identify the screen's user, purpose, primary task, supporting information, and next action before choosing a layout.
- Use the plan-first information architecture and real Skedra workflows. Do not invent new screens, features, labels, metrics, or navigation just because a common SaaS template includes them.
- Use `docs/design-references/Nixtio.jpg` as directional inspiration for a compact dark app chrome, calm light workspace, subtle boundaries, rounded surfaces, restrained pastel task categories, and clear visual hierarchy. Do not reproduce its exact composition, medical-learning content, branding, or decorative elements.
- Prior generated Skedra mockups were rejected. They are not approved references. Do not recreate them, or generate/build a collage of many screens as a substitute for designing and implementing a real flow.
- Design one connected, usable screen or vertical workflow at a time. Confirm hierarchy and interactions before expanding the same pattern to other screens.
- Inspect existing components, styles, and tokens first. Reuse consistent components where appropriate, but do not force a pattern onto a screen where it does not serve the task.

#### Avoid generic AI-generated visual tropes

Do not add these by default; use them only when a specific product need justifies them:

- Purple/blue gradient backgrounds, glowing blobs, neon glows, glassmorphism, decorative mesh gradients, or gratuitous blur.
- A hero with oversized generic claims and floating fake application windows when the user needs a functional product workspace.
- Repeated rounded cards nested inside other rounded cards for every piece of content.
- Pills, status badges, icons, borders, shadows, dividers, and decorative labels on everything.
- A grid of statistic cards that repeats information or has no impact on the user's decision.
- Random icons or illustrations without semantic value.
- Arbitrary color assignment to categories, decorative progress bars that are not data-backed, or excessive motion.
- Fake product screenshots, fabricated testimonials, fabricated customer logos, invented ratings, or unearned marketing claims.

Minimal does not mean empty, monochrome by force, or visually unfinished. Use hierarchy, alignment, spacing, contrast, typography, and a few meaningful visual signals. Every visible element should help users understand context, make a decision, or complete an action.

#### Make the copy sound like a real product

- Write concise, specific, human interface copy tied to the actual behavior. Avoid generic AI phrases such as "Unlock your potential," "Transform your productivity," "Make today count," "Everything you need in one place," or repetitive motivational slogans unless the user explicitly asks for that tone.
- Prefer concrete labels and actions: name what will happen, what it affects, and what the user should do next.
- Do not use lorem ipsum, meaningless filler, duplicate descriptions, invented feature claims, fake social proof, or placeholder copy that accidentally ships.
- Avoid robotic headings, repetitive sentence patterns, excessive exclamation marks, vague CTA labels such as "Continue" when a more specific action is possible, and unnecessary explanatory text for obvious controls.
- Use Skedra's canonical terminology consistently: **Plan**, **Roadmap**, **Schedule**, **Session**, **Regular revision**, **Serious revision**, **Progress**, and **Backup**. Do not expose technical jargon like "dependency graph," "optimizer," or "schema validator" in routine user workflows.
- Empty states should tell the user what is missing and offer a relevant next action. Error states should explain what went wrong, which item is affected, and how to fix or review it. Success messages should state the actual result, not praise the user generically.
- Be precise about time, workload, progress, and feasibility. Never claim that a schedule is optimized, achievable, complete, scientifically optimal, or personalized unless the implementation and data justify that statement.
- Don't invent domain content to make a screen look full. Use realistic seeded/demo content only in clearly designated preview or development contexts. Label illustrative data as sample data, and ensure it cannot be mistaken for the user's actual progress.

#### Charts and data must be genuine

- Every chart must answer a clear user question and be backed by a defined metric and source data.
- Never ship fabricated numbers, arbitrary chart shapes, or random percentages as if they were real user data. If data is not available, show a useful empty state or a clearly labelled development fixture.
- Define what each percentage, duration, streak, completion count, and comparison means. Do not mix estimated effort, actual effort, remaining effort, and scheduled allocation.
- Use chart colors consistently and accessibly. Provide labels, units, legends where needed, and a text/data alternative; do not rely on color alone.
- Prefer a small number of useful charts over a dashboard full of visualizations. Include a chart because it helps a user understand progress or decide what to do—not merely because it makes the page look sophisticated.

#### Interaction quality matters more than screenshot polish

- Buttons, tabs, filters, menus, forms, and chart controls must perform their stated action. Do not present inert controls as finished features.
- Implement loading, empty, error, success, disabled, and confirmation states wherever the workflow requires them.
- Destructive or consequential actions need clear consequences, and important schedule changes must follow Skedra's preview/approval rules.
- Use real data flow and domain types rather than hard-coded display-only values. Clearly isolate fixtures used for development or visual tests.
- Ensure keyboard operation, visible focus, accessible names, readable contrast, appropriate touch targets, and no hover-only essential behavior.
- Check both the target desktop layout and mobile behavior when making shared components. Avoid shrinking a desktop layout until it barely fits; reflow it for the smaller screen and task.

#### Visual quality gate

Before calling UI work complete, inspect the actual running screen (or available screenshots) and ask:

1. Can a first-time user tell what this screen is for and what to do next within a few seconds?
2. Does the hierarchy follow the user's task, not a template's card grid?
3. Does each visible element have a real purpose? Can any decoration, card, label, icon, or metric be removed without loss?
4. Is the copy specific to Skedra and accurate about what the product actually does?
5. Are numbers and charts real or unmistakably labelled sample data?
6. Are the core interactions functional, including errors and empty states?
7. Does the screen feel consistent with `PRD.md` and the Nixtio-inspired direction without copying it?
8. Does it work at desktop and mobile widths, with accessible contrast and controls?

If the result looks like a generic AI-made landing page or dashboard, revise the design before reporting completion. Do not claim that a design is polished based only on source code or a generated mockup; perform visual verification when the environment supports it and state clearly if visual verification was not possible.

### Persistence and recovery

- Keep persistence behind a repository/storage boundary where practical.
- Treat estimated effort, actual effort, remaining effort, and scheduled allocation as different values.
- Maintain migrations or a versioning strategy for local data.
- Backup restore must validate and preview before replacing current state.
- Do not assume the browser can silently write to arbitrary files; filesystem access requires platform support and user permission.

## 7. Scheduling and validation test expectations

When modifying the roadmap contract or scheduler, add regression tests for relevant cases, including:

- Valid `roadmap_only` input.
- Valid `pre_scheduled` input preserved as supplied.
- Unknown schema version and missing required fields.
- Duplicate IDs and invalid dependency references.
- Circular dependency detection.
- Prerequisite ordering.
- Daily and time-window capacity limits.
- Breaks and buffer capacity.
- Deadline conflicts and unallocated required work.
- A concrete infeasibility case (for example, 100 hours required versus 70 hours available).
- Determinism for identical inputs.
- Completed/partial work preservation after rescheduling.
- No silent mutations in pre-scheduled mode.
- Repair preview/approval behavior where implemented.
- Restore rejection for invalid or stale data where applicable.

Do not encode arbitrary priority weights, revision formulas, or approval thresholds as settled without documenting them as provisional and testing representative scenarios.

## 8. Data, privacy, accessibility, and quality

- Keep v1 local-first; don't collect or transmit user roadmap/progress data without an explicit approved feature requiring it.
- Validate imported files defensively and handle malformed/large inputs gracefully.
- Avoid unsafe rendering of imported text or metadata; treat roadmap content as untrusted data.
- Support keyboard navigation and visible focus states.
- Use semantic controls and accessible labels.
- Do not rely exclusively on color or hover.
- Add loading, empty, success, validation-error, conflict, and failure states for core interactions.
- Make destructive or difficult-to-reverse operations explicit and confirm them where appropriate.

## 9. Definition of done

A task is complete only when:

- The intended behavior is implemented, not merely stubbed.
- Relevant tests are added or updated.
- Relevant tests actually ran and their results are reported honestly.
- Type checking, linting, or build checks have been run where available and practical; skipped checks are disclosed.
- The change does not violate product invariants or accidentally modify user work.
- Documentation is updated when contracts, commands, or user-visible behavior change.
- Remaining assumptions and limitations are identified.

## 10. Required final report after a coding task

Keep the report concise and factual:

1. **Implemented:** what changed and why.
2. **Files:** the main files changed.
3. **Verification:** commands actually run and pass/fail results.
4. **Limitations/assumptions:** anything not completed or any provisional rule used.
5. **Next step:** the smallest logical follow-up milestone.

Do not claim full project completion when only one milestone is implemented.
