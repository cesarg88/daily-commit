# ADR-004 — Keep product rules in a framework-independent domain layer

## Status

Accepted

## Date

2026-06-29

## Context

Daily Commit's MVP value depends on a small set of rules being correct and easy to change:

- day activation validation;
- base and bonus scoring;
- final score cap;
- day closure;
- weekly performance;
- weekly consistency.

These rules should not be coupled to UI components, database clients, or hosting infrastructure.

## Decision

Use a layered architecture:

```text
Presentation
Application
Domain
Data
```

Keep domain code in pure TypeScript. Domain code must not import React, Next.js, Supabase, browser APIs, or environment variables.

Prioritize domain unit tests before UI implementation.

## Rationale

The domain rules are the most important and highest-risk part of the product. Keeping them independent makes them easy to test, review, and reuse across server actions, cron closure, and UI flows.

## Consequences

### Positive

- Scoring and validation can be tested without UI setup.
- Implementation PRs can ship behavior before screens.
- Future persistence or hosting changes are less likely to rewrite product rules.

### Negative

- Requires discipline around folder boundaries.
- Adds small upfront structure before feature screens exist.

### Neutral / operational

- Application use cases coordinate repositories and domain services.
- Data adapters translate database rows to application/domain DTOs.
- Presentation components receive view models and call application actions.

## Alternatives considered

### Put logic directly in React components

Not selected because it would make scoring and validation harder to test and easier to regress.

### Put logic directly in SQL

Not selected because UI flows, server actions, and tests all need the same product behavior.

### Build a large domain framework

Not selected because the MVP needs simple modules, not enterprise architecture.

## Follow-up actions

- Add domain modules before product screens.
- Add unit tests for every scoring, validation, closure, and weekly calculation rule.
- Review imports during PRs to keep domain code dependency-free.

## Related documents

- `docs/03-architecture/technical-strategy-proposal.md`
- `docs/03-architecture/technical-architecture.md`
- `docs/03-architecture/conceptual-model.md`
