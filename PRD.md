# Skedra — Product Requirements Document (PRD)

> **Status:** Draft for implementation planning. Product behavior should remain consistent with `context.md`. Visual tokens and detailed interactions in this document are the proposed design baseline derived from the user's preferred Nixtio reference; refine them against real screens and accessibility checks rather than treating every token as immutable.
>
> **Design reference:** `docs/design-references/Nixtio.jpg` — use as inspiration for its calm canvas, compact dark application chrome, rounded light work areas, soft pastel task surfaces, generous spacing, and clear visual hierarchy. Do not copy its branding, exact layout, terminology, or content.

## 1. Purpose of this document

This PRD defines how Skedra should be experienced: user journeys, information architecture, screen requirements, visual direction, interactions, responsive behavior, chart requirements, accessibility expectations, and acceptance criteria.

It does not replace `context.md`, which remains the product and engineering source of truth for the vision, domain behavior, roadmap modes, scheduler invariants, architecture direction, and confirmed product decisions. If a screen idea conflicts with a product invariant, the invariant wins and the conflict must be resolved before implementation.

### Requirement language

- **MUST** — required for the first useful release or required to protect a confirmed product invariant.
- **SHOULD** — recommended default; a deviation needs a concrete reason.
- **LATER** — intentionally outside the first useful release.
- **PROPOSED TOKEN** — a starting design-system value to validate in the implemented UI.

## 2. Product experience goals

### Primary goal

Help users turn one or more imported roadmaps into manageable, realistic work and understand what to do next without learning a complicated planning system.

### Experience goals

1. **Plan-first:** users enter through their Plans workspace. A plan is the main unit of organization.
2. **Quietly capable:** complex scheduling is hidden until a decision needs to be made.
3. **Warm, not toy-like:** use rounded shapes and restrained pastels without childish decoration, excessive gradients, or gamified clutter.
4. **Useful visual progress:** charts answer specific questions and support decisions; they are not decoration.
5. **Visible control:** users can inspect a plan, understand schedule warnings, preview consequential changes, and decline changes.
6. **Recoverable:** normal use should never require users to think about saving; export and restore remain discoverable.
7. **Responsive:** desktop is the first design target, but key workflows work intentionally on mobile rather than being squeezed into a desktop layout.

### Non-goals for UI v1

- Showing every metric, configuration option, and subsystem on one dashboard.
- A complex command center with multiple global navigation systems.
- A mandatory onboarding tour before users can import a plan.
- Copying the supplied reference screen's exact composition.
- A full design system page or elaborate marketing landing page before the core product workflow works.
- Making dark mode, animation, or decorative 3D imagery a prerequisite for launch.

## 3. User model and key jobs

Skedra is domain-agnostic. Its initial users may organize exam preparation, DSA/interviews, courses, long-term learning, or projects. The imported roadmap supplies domain-specific terms and structure.

### Main jobs to be done

- **Create a plan:** import a roadmap, validate it, set availability, review the proposed or supplied schedule, and confirm.
- **Understand a plan:** quickly see its goal, deadline, completion, next step, workload, and important risks.
- **Execute work:** start a session, pause/finish it, record completion or partial progress, and continue.
- **Navigate the roadmap:** understand topic/task hierarchy and prerequisites without facing a dense dependency diagram by default.
- **Inspect progress:** know what has been completed, how much time was invested, whether planned effort matches actual effort, and where attention may be needed.
- **Handle a problem:** understand an invalid import, infeasible schedule, missed session, or proposed change and choose what happens next.
- **Protect data:** export a plan or recover from a validated backup.

## 4. Information architecture

### Global navigation

Use a small, stable global navigation structure:

1. **Plans** — the home/workspace and the default app entry point.
2. **Today** — a shortcut to the combined agenda for active plans. It is not the primary organizing unit.
3. **Settings** — cross-plan preferences, notifications, appearance, and data/backup management.

Search may be provided in the Plans workspace when there are enough plans to warrant it. Avoid separate global destinations for every task, calendar, revision, or analytics feature in v1.

### Plan workspace

Opening a plan enters a plan-specific workspace with the plan name and a compact local navigation:

- **Overview** — overall plan status and next action.
- **Schedule** — day, week, month, and agenda perspectives.
- **Roadmap** — hierarchical roadmap/task browser.
- **Revisions** — optional regular and serious revision policies and review queues.
- **Progress** — charts and measured insights.
- **Plan settings** — mode, target date, plan-specific constraints, revision policy, and overrides.

Task details should generally open as a contextual page, drawer, or panel from the roadmap or schedule. They should not become a new global navigation destination.

### Navigation rules

- The current plan name must remain visible within its workspace.
- A clear route back to Plans must always be available.
- The app must distinguish global settings from plan-specific settings.
- If a plan overrides a global default, show that fact near the setting.
- Navigation labels use plain language; use technical terms only when the domain genuinely requires them.
- Route structure should support direct links to a plan and its main tabs where compatible with the existing app architecture.

## 5. Visual direction

### Reference interpretation

The Nixtio reference suggests a useful visual language for Skedra:

- A compact, near-black top bar that anchors the interface.
- A light, nearly white work surface surrounded by a subtle cool background.
- Rounded white panels with soft boundaries rather than heavy elevation.
- Pastel colors used to distinguish a few meaningful task/session types.
- Clear, readable typography and distinct hierarchy between page title, task title, metadata, and actions.
- Small, coherent iconography and compact contextual controls.
- A workspace that feels composed and focused, not like a generic enterprise dashboard.

Apply those qualities to Skedra's own plan-first structure. The reference is a visual-direction source, not a screen blueprint.

### Proposed color tokens

These are proposed first-pass tokens, not yet contrast-audited in a live UI.

| Token | Proposed value | Intended use |
|---|---|---|
| `app-canvas` | `#EEF7F7` | Very subtle cool outer background, used sparingly |
| `surface` | `#FFFFFF` | Main pages, panels, drawers, forms |
| `surface-subtle` | `#F7F9FA` | Nested sections and inactive surfaces |
| `chrome` | `#111315` | Compact top navigation / app chrome |
| `text-primary` | `#15191D` | Main text and high-priority labels |
| `text-secondary` | `#59636E` | Supporting copy and metadata |
| `text-muted` | `#747E88` | Low-emphasis metadata only when contrast remains sufficient |
| `border` | `#DCE3E6` | Dividers, card outlines, input borders |
| `accent` | `#7156E8` | Primary action, selected navigation, focus indicators where appropriate |
| `accent-hover` | `#5E43D3` | Hover/pressed action state |
| `accent-soft` | `#EEE9FF` | Selected states and subtle accent background |
| `pastel-mint` | `#DDF5E8` | One session category or positive state surface |
| `pastel-lavender` | `#F0E3FA` | One session category or secondary emphasis |
| `pastel-sky` | `#DDF2F8` | One session category or information emphasis |
| `pastel-peach` | `#FFF0D8` | One session category or neutral warm emphasis |
| `success` | `#1F805D` | Success text/icon and status indicator |
| `warning` | `#9B6200` | Warning text/icon; pair with a clear label |
| `danger` | `#B4232F` | Errors/destructive actions; pair with an icon and explanatory text |

Color rules:

- Use the near-black chrome and light workspace as the default visual contrast.
- Use pastels as low-intensity fills, not as the sole status signal. Pair color with a text label, icon, or shape.
- Reserve the main purple accent for primary actions and selection; don't make every button purple.
- Do not assign colors arbitrarily to decorative tags. Establish consistent semantic/category mapping when categories are finalized.
- Verify all foreground/background combinations in the actual UI against WCAG 2.2 AA contrast guidance. Dark text placed on pastel surfaces must remain readable.
- Avoid using red/green alone to express outcomes.

### Typography

**Proposed typeface:** Inter, with a system sans-serif fallback. If the existing project already has a consistent, legible sans-serif that performs well, do not introduce a font dependency without benefit.

| Token | Desktop size | Weight | Use |
|---|---:|---:|---|
| `display` | 30–32 px | 600–700 | Rare top-level welcome or empty-state heading, not every page |
| `page-title` | 26–28 px | 600–700 | Main page title |
| `section-title` | 19–22 px | 600 | Major content sections |
| `card-title` | 15–17 px | 600 | Plan cards and task/session titles |
| `body` | 14–16 px | 400 | Main interface copy and controls |
| `body-strong` | 14–16 px | 500–600 | Emphasized labels or task names |
| `metadata` | 12–13 px | 400–500 | Dates, duration, supporting metadata; never critical long-form instructions |
| `micro-label` | 11–12 px | 500 | Short uppercase or compact utility labels only when still legible |

Type rules:

- Use consistent type styles and line heights rather than many arbitrary sizes.
- Long instructions, warnings, and validation messages should normally be 14 px or larger.
- Do not use pale gray for important text.
- Use tabular numerals for durations, percentages, and times where supported.
- Reserve all-caps for very short metadata, not for navigation or explanatory text.

### Spacing, geometry, and elevation

Proposed spacing scale: `4, 8, 12, 16, 20, 24, 32, 40, 48` px.

- Main page gutters: approximately 24–32 px on desktop; reduce thoughtfully on narrow windows.
- Card padding: usually 16–20 px; dense data rows can use 12–16 px.
- Space between distinct sections: 24–32 px.
- Common card radius: 14–18 px.
- Inputs and buttons: 9–12 px radius.
- Main action height: 40–44 px on desktop; use comfortable touch targets on mobile.
- Use borders and subtle surface differences before adding shadows. Avoid the appearance of floating cards everywhere.
- Maintain consistent alignment between titles, body content, charts, and actions.

### Icons and imagery

- Use one consistent line-icon family, preferably the existing project's icon library if appropriate.
- Icons must have a clear semantic purpose and accessible labels when not accompanied by text.
- Avoid decorative illustrations in routine task views.
- Use scenic/hero imagery only if it supports a specific empty/onboarding context; it must not compete with task content.
- The primary interface should be functional and data-led, with the reference's visual softness rather than copying its medical-learning visuals.

## 6. App shell and layout behavior

### Desktop shell

- Compact top app bar with Skedra mark/wordmark, current context or breadcrumbs where useful, and a small utility area.
- A restrained global navigation element for Plans, Today, and Settings.
- When inside a plan, show plan-local navigation clearly without duplicating the global nav labels excessively.
- Main content occupies the largest area and follows a consistent maximum-width/layout grid.
- Optional contextual drawer may present task details or schedule-change details without losing the user's place.
- Persistent global header must not consume excessive vertical space.

The exact side rail versus top-level global navigation arrangement remains a design choice to validate with the Plans home and plan workspace. Avoid implementing two competing navigation systems. Prefer one coherent pattern and test it across all screens.

### Responsive behavior

Desktop is the first design target. Responsive behavior is a requirement from the beginning, not a future rewrite.

- At medium widths, collapse secondary navigation labels when necessary but keep tooltips/accessible names and visible active state.
- At mobile widths, use a compact bottom navigation or another single clear global pattern for Plans, Today, and Settings.
- Inside a plan, use a compact horizontal tab strip or a plan menu rather than squeezing a desktop sidebar into the viewport.
- Task/session cards stack vertically.
- Multi-column layouts collapse to a single main column.
- Charts stack, preserve readable labels, and allow direct tap inspection of values.
- Calendar views switch to an agenda/day representation when a month/week grid becomes too dense.
- Settings use one column with collapsible groups; don't use small multi-column forms on mobile.
- No core interaction may depend exclusively on hover.
- Test at narrow mobile widths, typical phone widths, tablet widths, and common desktop sizes. Use existing project breakpoints if present rather than adding conflicting breakpoint systems.

## 7. Screen requirements

## 7.1 Plans home — default entry point

### Purpose

Help users find a plan, understand its state at a glance, and create/import a new plan.

### Layout

- Page title: **Your plans** or **Plans**.
- One obvious primary action: **New plan**.
- Search and simple filters: All, Active, Completed, Archived. Do not show every filter as a permanent toolbar if it creates clutter.
- Plan list/grid with a consistent information hierarchy.
- Optional sorting: recently opened, deadline, progress; add only if simple and useful.

### Plan card content

Each card should show:

- Plan name and optional short goal description.
- Status such as Active, Completed, or Archived.
- Deadline or a clear “No deadline” state.
- Overall progress with percentage and completed/total task count if meaningful.
- One useful next item or next scheduled session, when one exists.
- A subtle mode label only when it helps the user understand that the schedule is supplied versus generated.

Cards must not become mini dashboards. Do not include every metric, calendar preview, and chart in each card.

### Interactions

- Selecting a card opens that plan's Overview.
- The primary action begins the create/import flow.
- Archive/restore and destructive actions live in a contextual menu and require appropriate confirmation.
- Search and filters must work on keyboard and mobile.

### States

- **First-use empty:** explain that a plan starts from an imported roadmap; provide one main Create/Import action and a link to the template/instructions when available.
- **No filter matches:** explain the empty result and offer to clear filters.
- **Loading:** use restrained skeletons matching final card geometry.
- **Error:** show a concise reason and retry option.

## 7.2 Create plan / import wizard

### Goal

Make import reliable without making every user configure all the advanced scheduling rules.

### Flow

1. **Import roadmap**
2. **Availability and preferences**
3. **Review plan/schedule**

Use a simple step indicator. Users should understand how many steps remain and be able to go back without losing valid inputs.

### Step 1 — Import

- Accept the documented roadmap file format (JSON initially unless the current implementation specifies another supported format).
- Provide file chooser and drag/drop on compatible desktop browsers; file chooser remains available.
- Show selected filename and size where useful.
- Explain supported format and provide access to the canonical template/instructions when available.
- Do not silently convert an unknown or unsupported file.

### Validation result state

Group issues by severity and keep the error attached to its task/node when possible:

- Blocking errors: the roadmap cannot be imported yet.
- Warnings: the roadmap is structurally valid but needs attention (for example, a likely feasibility conflict).
- Informational notes: explain accepted defaults or preserved properties.

Every issue must say what is wrong, where it occurs, and what the user can do next. Suggested repairs must show the proposed change and its consequence. Require explicit approval before applying a repair, then validate again. Preserve the original upload.

### Step 2 — Availability and preferences

Ask only for essentials not already safely provided by the roadmap:

- Available days.
- Daily workload budget.
- Time windows if exact clock-time scheduling is desired.
- Target date confirmation if relevant.
- Optional buffer/break/session preferences with sensible defaults.

Place less common options under **Customize schedule**. Clearly distinguish defaults from hard constraints. Do not silently override conflicting roadmap constraints.

### Step 3 — Review schedule

For `roadmap_only`, show the proposed schedule summary. For `pre_scheduled`, show the imported schedule summary and explicitly indicate it will be preserved.

The review must show:

- Estimated total workload/duration where computable.
- Planned average daily/weekly load.
- Available capacity comparison.
- Deadline and feasibility status.
- Unscheduled required work or constraint conflicts.
- A small workload distribution chart if it materially aids understanding.
- Optional revision setup, clearly disabled unless selected.

If infeasible, do not present a green “ready” state. Explain the gap and available choices. Require a user decision for changes to scope, deadlines, or hard constraints. The final action should state what it will do: e.g. **Create plan** or **Use supplied schedule**.

## 7.3 Plan Overview

### Purpose

Answer four questions quickly: What is this plan? Where am I? What happens next? Is anything at risk?

### Required content

- Plan name, goal/description, planning mode (only where useful), and target date.
- Primary progress indicator with completed/total work or another clearly defined measure.
- Next scheduled session with a prominent action to continue/start.
- Upcoming milestone or next meaningful topic.
- Workload/feasibility notice when there is a current unresolved issue.
- Small recent-activity section only if it helps orientation.

### Rules

- Do not turn Overview into a wall of metric cards.
- Avoid duplicating all information from Schedule and Progress.
- Keep the main action tied to the current plan state: Continue, Review proposal, Resolve issue, or View schedule.
- If no schedule exists yet, guide the user to generate/review it (Roadmap Only) or address validation (Pre-scheduled).

## 7.4 Schedule

### Purpose

Help users understand when work is planned and what they must do next.

### Views

- **Day:** detailed session list and available capacity.
- **Week:** primary schedule view for workload distribution and timing.
- **Month:** deadline/milestone overview; dense task detail may be omitted.
- **Agenda:** accessible chronological list, essential on mobile.

The default view should be selected after testing with representative data. Do not force a dense weekly calendar if a task agenda explains the work more clearly.

### Session card

Each session should show only useful information:

- Task/session title.
- Plan/topic context where the user could otherwise lose it.
- Start/end time or planned duration, depending on scheduling granularity.
- Work type if relevant (learning, practice, regular revision, serious revision).
- Status and one primary action.

Color may softly distinguish session types, but text labels and/or icons must always identify them. Keep labels consistent across Schedule, Today, and Task Detail.

### Schedule interaction

- Selecting a session opens task detail or a contextual panel.
- In Roadmap Only mode, schedule edits go through the agreed rules. Significant changes display a preview and require approval.
- In Pre-scheduled mode, do not silently change supplied allocations; explicit user intent/approval is required before modifications.
- Unavailable capacity, break time, or buffer time should be represented without pretending it is scheduled work.
- Drag/drop, if implemented, must have a keyboard-accessible alternative and must not bypass constraint checking or approval.

### States

Include empty-day, no-schedule-yet, overdue/missed, conflict, and unscheduled-work states. Explanations must distinguish an empty day from an accidental missing schedule.

## 7.5 Roadmap browser

### Purpose

Let users inspect the full work structure without forcing a graph view as the default.

### Layout

- Hierarchical expandable/collapsible groups and topics.
- Executable tasks visually distinguished from organizational topic/group rows.
- Progress summary for groups/topics where computable.
- Small status/effort indicators only when useful.
- Clear indication when a task is blocked by a prerequisite; show prerequisite names on demand.
- Search/filter may be introduced when roadmap size demands it.

### Interaction

- Expand/collapse hierarchy.
- Open task detail.
- Mark task progress where permitted.
- Edit roadmap content only through an explicit editing flow.
- Before editing a generated roadmap, preview schedule impact and require appropriate confirmation before regeneration.
- Do not expose all dependency edges as a dense visual graph unless the user explicitly enters a dedicated dependency-inspection view.

## 7.6 Task detail

### Purpose

Give one task all the context needed to act, without presenting the full roadmap model.

### Required content

- Task title, parent topic/plan breadcrumb, and status.
- Description/instructions and resources, if supplied.
- Estimated duration, actual time, and remaining effort as distinct values.
- Prerequisites/dependent tasks when relevant.
- Subtasks/checklist where applicable.
- Relevant planned session(s).
- Optional mastery/confidence field only when enabled.

### Actions

- Start/resume session.
- Mark completed or partially completed.
- Mark blocked and optionally provide a reason.
- Update progress/actual effort.
- Open prerequisite or parent topic.

Completed work must not be accidentally reset when schedule allocations change.

## 7.7 Focus/session view

### Purpose

Help the user do one piece of work with minimal distraction.

### Requirements

- Task title and why it belongs to the current plan.
- Planned duration or time window.
- Timer/progress indicator if time tracking is enabled.
- Start, pause/resume, and finish controls.
- A simple finish flow: completed, partially completed, blocked, or stop without completing.
- Record actual duration and preserve partial progress.
- Optional short note or mastery/recall prompt where relevant.

Do not force a fixed Pomodoro duration. Use the user's configured session duration. Avoid unnecessary animations, background scenes, streak pressure, or celebration that distracts from the task.

If the user closes or navigates away during a session, preserve recorded state as safely as the platform permits and clearly handle a resumable session.

## 7.8 Revisions

### Purpose

Let users inspect and configure revision without making it a mandatory layer for every plan.

### Structure

Separate, clearly labelled areas for:

- **Regular revision:** spaced reviews for long-term retention.
- **Serious revision:** comprehensive deadline-oriented preparation.

Show due/upcoming reviews and the related topic. Make it easy to see which revision policy created a session.

### Configuration

- Each revision type can be independently enabled/disabled.
- Use presets as starting points; expose detailed customization only on request.
- Support interval sequences, review count, preferred days/windows, active recall, duration bounds, adaptive behavior, and the serious-revision start window as applicable.
- Show when a plan uses global defaults versus plan-specific overrides.

### Recall action

Use a compact Easy / Partial / Difficult / Skip control. Explain briefly that Skip records no recall judgment. Never treat Skip as failed recall.

### Missed review

When a review is missed, offer the approved choices: reschedule, skip, or reset the revision sequence. Do not silently discard it. If capacity conflicts arise, explain the choices rather than silently overloading the schedule.

## 7.9 Progress and analytics

### Purpose

Help the user understand real progress, workload patterns, and areas needing attention. Charts are meaningful product functionality, not decoration.

### Recommended initial chart set

Start with a small number of charts that can be supported by reliable data:

1. **Plan completion:** completed executable work versus total defined work; label the denominator and clarify how partial completion is counted.
2. **Planned vs actual time:** trend over a selected period, using consistent units and a clear explanation of actual-time collection.
3. **Work completed over time:** daily or weekly completed work; avoid confusing completed task count with hours.
4. **Completion by topic/group:** compare progress across roadmap sections.
5. **Estimated vs actual duration:** only after enough comparable completed sessions exist.

Recall/mastery trend and consistency/streak charts may be added when a plan has enough relevant data and the user has enabled those measurements.

### Page composition

- A small summary row (at most 3–4 high-value measures) may precede charts.
- Two clearly named chart sections are better than a dense grid of tiny charts.
- A time-range selector should offer a few meaningful options, not dozens.
- Topic filtering should be available when it answers a real question.
- Each chart includes title, metric definition/context, labels, units, and direct inspection of values.
- Use a short insight summary only when it follows from data; do not make unsupported predictive or causal claims.

### Data integrity

- State how partial completion is counted.
- Distinguish estimated from actual time.
- Do not present zero/no data as 0% progress when the denominator is unknown.
- Avoid making comparisons across periods where the definitions have changed without indicating that.
- Provide useful empty states when there is insufficient data.

### Mobile charts

- Stack chart cards vertically.
- Keep labels legible; do not shrink charts into unreadable thumbnails.
- Support tap-to-inspect values, not hover-only tooltips.
- Use concise legends and direct labels where helpful.
- Allow horizontal scrolling only when the chart truly requires it and its affordance is clear.

## 7.10 Global Today view

### Purpose

Provide a convenient agenda across all active plans without displacing the plan-first model.

### Required content

- Today's sessions grouped chronologically.
- Plan/topic name for cross-plan context.
- Progress and remaining planned time.
- Clear start/resume action per session.
- Completed sessions visually distinct from pending, missed, and blocked items.
- A compact path to open the owning plan.

If no sessions exist today, distinguish “nothing scheduled” from “a schedule is missing.” Do not create work automatically to fill an empty day.

## 7.11 Settings

### Global settings groups

- General and appearance.
- Default availability and capacity.
- Scheduling defaults and change/approval behavior.
- Default revision strategy/presets.
- Notifications.
- Data, export, backup, and restore.

### Plan settings groups

- Goal/metadata and target date.
- Planning mode (protect mode semantics; switching modes must be an explicit operation with preview and validation).
- Plan-specific availability/constraints.
- Revision choices.
- Overrides and history.

Settings requirements:

- Use sensible defaults and progressive disclosure.
- Explain important settings in plain language.
- Show when a plan override differs from a global default.
- Do not hide hard constraints among vague “preferences.”
- Save explicitly where accidental edits would have a large impact; for low-risk settings, automatic save may be used if feedback is clear and consistent.

## 7.12 Change proposal and feasibility surfaces

These are contextual surfaces/dialogs rather than permanent navigation destinations.

### Change proposal

Must show:

- Why the change is proposed.
- Summary of affected tasks/dates and workload.
- Before/after comparison, including any important deadline impact.
- What will not change (especially completed work and protected allocations).
- Approve and Reject actions.

Rejecting must leave the current schedule unchanged. Undo should be available for supported applied changes.

### Feasibility warning

Use clear language with quantities: “Required work exceeds available capacity by about 30 hours.” Show the calculation basis and assumptions. Offer options, explain consequences, and require explicit choice before changing scope, capacity, or hard deadlines.

Do not use a reassuring green status or claim “all set” when required work remains unscheduled.

## 7.13 Data and backup surfaces

- Keep export and restore discoverable from global Settings.
- Explain the difference between a roadmap file and a full recovery backup.
- Before restoring, show the backup timestamp, version, and plans/progress it contains.
- Warn when a backup may be older than local state.
- Validate before replacing current state and retain current data until restore succeeds.
- Where optional browser file access is available, explain the permission request and provide a manual alternative.

## 8. Shared component requirements

Use a small set of consistent components. Names below are conceptual; follow the existing code conventions when implementing.

| Component | Responsibility | Key states/requirements |
|---|---|---|
| App shell | Global navigation and app context | Responsive, low visual weight |
| Global navigation | Plans, Today, Settings | Clear active state; keyboard accessible |
| Plan card | Plan identity, progress, deadline, next step | Active/completed/archived, no data, menu open |
| Progress bar | Show a clearly defined completion ratio | Label/accessible value; not color-only |
| Session card | Show scheduled work | Pending, active, complete, partial, missed, blocked |
| Status pill | Concise task/plan/session status | Text plus semantics; restrained color |
| Roadmap tree row | Hierarchical navigation | Expanded/collapsed, group/task, selected, blocked |
| Chart card | A specific metric and visual | Loading, ready, empty, error, selected point |
| Stepper | Import/configuration/review flow | Current step, completed step, navigation/back |
| Upload dropzone | Accept supported roadmap file | Drag, browse, selected file, parse progress, error |
| Validation summary | Explain import issues | Error/warning/info grouping; item-level links |
| Feasibility banner | Explain capacity gap or conflict | Severity, quantitative context, next action |
| Change preview | Compare current and proposed schedule | Approve/reject, clear impact summary |
| Recall selector | Easy/Partial/Difficult/Skip | Accessible, one choice, skip explicitly neutral |
| Empty state | Explain no content and next action | Task-specific and actionable, not decorative |
| Confirmation dialog | Confirm risky/destructive action | Consequences, cancel, confirm |
| Toast/inline feedback | Confirm small updates or errors | Non-blocking; important errors persist in context |

Avoid creating a separate component for every tiny variant. Build reusable components after the actual screens establish the repeated pattern.

## 9. Interaction and state requirements

Every primary workflow must define the following relevant states:

- Initial/empty.
- Loading or processing.
- Success/ready.
- Validation error.
- Blocking conflict.
- Non-blocking warning.
- No data yet.
- Disabled action with understandable reason.
- Confirmation for destructive or consequential action.
- Failure/retry where recovery is possible.

### Feedback rules

- Use inline feedback near the affected item for validation and form errors.
- Use toast notifications for transient non-critical confirmations; don't use a toast as the only evidence of a blocking error.
- Keep important warnings visible until resolved or explicitly dismissed.
- Prevent double submission while an operation is processing.
- Preserve user-entered values when validation fails where safe.
- For long operations, indicate progress and allow cancellation when safe.
- Don't use modal dialogs for ordinary information that could be shown inline.

## 10. Accessibility and usability requirements

Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) for core interactions and content. Verify actual combinations and component behavior rather than assuming the chosen palette is accessible.

- Normal text contrast must meet the applicable WCAG AA requirement; large text and non-text UI controls must meet their applicable contrast requirements.
- All core actions must be reachable by keyboard with a visible focus state.
- Every icon-only control needs an accessible name.
- Form controls need programmatic labels and clear validation messages.
- Charts need text labels/summary or a data alternative; don't make chart comprehension depend on color alone.
- Do not rely solely on color, hover, shape, or position to communicate status.
- Use comfortable touch targets on mobile, with extra care for closely packed icon controls.
- Respect reduced-motion preferences if motion is introduced.
- Avoid flashing, progress animations that run indefinitely, or distracting effects in Focus mode.
- Use plain language for warnings and avoid blame-oriented wording when users miss sessions.

## 11. Responsive acceptance

The product must be evaluated at desktop, tablet, and mobile sizes. Desktop is implemented first, but mobile requirements are part of feature acceptance.

| Area | Desktop | Mobile |
|---|---|---|
| Global nav | Compact top/side pattern selected during design iteration | Bottom nav or compact global menu; choose one coherent pattern |
| Plan tabs | Local plan navigation, potentially horizontal or side-mounted | Horizontal scroll/tab menu with clear selected state |
| Plans | Grid or list based on available space | Single-column cards/list |
| Schedule | Week/day/month plus agenda | Agenda/day-first; no unreadable dense week grid |
| Roadmap | Expandable hierarchy with contextual detail | Nested list with details in a separate view/panel |
| Task detail | Context drawer or page | Full-height page or bottom sheet; never a narrow drawer |
| Charts | Two-column layout when readable | One column, tap-interactive, legible labels |
| Settings | Sections in a compact side navigation/content layout if useful | Single column and collapsible groups |
| Change preview | Side-by-side or structured before/after | Stacked before/after sections |

## 12. Content and terminology

Use stable user-facing terms throughout:

- **Plan** — the user's imported roadmap plus its execution/progress state.
- **Roadmap** — the hierarchy and scope of work inside a plan.
- **Schedule** — when work is allocated.
- **Session** — one scheduled instance of work.
- **Regular revision** — spacing-based review for retention.
- **Serious revision** — deadline-oriented comprehensive preparation.
- **Progress** — measured completion/effort/performance, with metrics defined.
- **Backup** — recoverable full application state; not synonymous with a roadmap file.

Avoid exposing internal terminology such as graph traversal, optimizer, scheduling score, schema validator, or storage repository in routine user workflows. Technical details may be shown in a developer/debug view, not the primary interface.

## 13. Design quality bar

Before accepting a screen, answer yes to the relevant questions:

- Is the screen's primary purpose obvious within a few seconds?
- Is there one clear primary action?
- Are secondary controls visually subordinate?
- Does every metric or chart provide a meaningful answer?
- Does the user understand the consequence of a consequential action before committing?
- Are errors actionable and attached to the relevant object?
- Does the screen use the same hierarchy, typography, spacing, and status semantics as adjacent screens?
- Is the screen calm and focused rather than decorated with redundant badges, metrics, and cards?
- Does it remain useful with little data and on mobile?
- Does it preserve all product invariants in `context.md`?

## 14. Design and implementation sequence

1. **Create the app shell and Plans home.** Validate the plan-first information architecture without implementing every subsystem.
2. **Design and implement the import wizard.** This is the highest-impact onboarding workflow and exercises the roadmap contract.
3. **Build Plan Overview and Roadmap views.** Users must be able to inspect a real imported plan.
4. **Build Schedule and session execution.** Connect the UI to tested scheduling and progress logic.
5. **Add Progress charts.** Use actual event data and metric definitions, not placeholder values disguised as real results.
6. **Add revisions and safe adaptation flows.** Keep the two revision modes separate and optional.
7. **Add settings, export/restore, and the remaining states.** Test recovery and responsive behavior.

For each step, implement one coherent vertical slice. Do not generate every screen in a single prompt or treat a static mockup as completion.

## 15. Acceptance criteria

### Plans home

- A user can find an existing plan and open it.
- The card surfaces goal, status, progress, and deadline without becoming a dashboard.
- Empty, filtered-empty, loading, and error states are implemented.
- A user can create/import a plan from one obvious entry point.

### Import wizard

- Supported roadmap files can be selected and parsed.
- Errors distinguish blocking issues from warnings and point to affected items.
- Suggested repairs are reviewed and approved before use, then revalidated.
- Roadmap Only produces a proposed schedule for review.
- Pre-scheduled preserves the supplied schedule and states that behavior clearly.
- Infeasible schedules never appear fully feasible.

### Plan workspace

- Users can navigate between Overview, Schedule, Roadmap, Revisions, Progress, and Plan settings without losing plan context.
- Task details preserve task identity and actual progress.
- The main action on Overview reflects the actual plan state.

### Schedule and sessions

- Users can inspect sessions in appropriate desktop and mobile views.
- Users can start/update/finish a session and record completed or partial work.
- The UI never silently changes a protected pre-scheduled allocation.
- Significant schedule proposals show impacts and allow rejection without changing the current schedule.

### Progress charts

- Every displayed metric has a defined denominator/unit/time range.
- Charts include labels, useful legends where required, and a non-color alternative for meaning.
- Loading, insufficient data, and failure states are implemented.
- Actual time, estimated time, and completion are not conflated.
- Interactions work with pointer, keyboard where applicable, and mobile touch.

### Responsive and accessible use

- Core workflows operate on desktop and mobile without horizontal overflow in normal use.
- Navigation is operable with a keyboard and communicates current location.
- Controls have accessible names and visible focus states.
- Critical text/control contrast is verified.
- No core interaction requires hover.

## 16. Open design decisions

The following should be resolved during iterative screen design and repository inspection; they are not reasons to block the PRD:

1. Exact desktop shell arrangement: slim dark top app bar plus global navigation rail versus another single coherent navigation arrangement.
2. Whether a Plan Overview opens by default on plan selection or restores the last visited local tab.
3. Which three or four summary metrics belong on Plan Overview versus Progress.
4. Default Schedule view (week vs agenda/day) based on real task density.
5. Final pastel-to-session-category mapping and the final contrast-tested token values.
6. Exact charting library based on the existing stack and required interaction behavior.
7. Whether session timer runs elapsed time, remaining time, or both; the session UX should follow actual tracking requirements and not impose a focus technique.
8. Exact breakpoints based on the actual app shell and content widths.

Make decisions with working prototypes and usability checks. Record durable decisions in this PRD. Do not duplicate scheduling domain rules here; refer to `context.md`.

## 17. Reference and implementation notes

- Preferred visual reference: `docs/design-references/Nixtio.jpg`.
- The reference is directional inspiration for the app's visual character, not permission to reuse its brand or reproduce the exact screen.
- Prior generated Skedra mockups were rejected; they are not approved references.
- `context.md` remains authoritative for product behavior and architecture direction.
- `AGENTS.md` remains authoritative for coding-agent process and engineering rules.
- Before implementing UI, inspect the repository and use existing working components/conventions where appropriate.
- Use realistic sample data during design, but clearly distinguish fixtures from real user data.
- Do not label placeholder metrics as actual analytics.
