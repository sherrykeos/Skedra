# Agent Entry Point

Before changing Skedra, read both files in this order:

1. [`context.md`](./context.md) — product source of truth: vision, features, confirmed decisions, roadmap modes, architecture direction, and open questions.
2. [`AGENTS.md`](./AGENTS.md) — repository-level coding rules: audit process, incremental workflow, architecture boundaries, safety constraints, testing, and definition of done.
3. [`PRD.md`](./PRD.md), when present — detailed product requirements and screen-specific UI/UX design decisions. Keep this separate from `context.md`; it is the detailed experience specification and design baseline.

Treat `AGENTS.md` as the canonical coding-agent instruction file. This `agent.md` exists as a convenient entry point for tools or workflows that look for the lowercase filename. Keep engineering rules centralized in `AGENTS.md` to avoid conflicting copies.

The user-provided `docs/design-references/Nixtio.jpg` is a preferred visual reference as documented in `PRD.md`; detailed visual decisions are not yet specified in `context.md`. Prior generated Skedra mockups were rejected. Do not assume a feature is implemented just because it is documented. Inspect the repository and tests first. Preserve user changes. Build incrementally. Never violate Skedra's confirmed product invariants.
