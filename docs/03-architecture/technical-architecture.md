# Technical Architecture — Daily Commit

This document defines the initial technical direction for Daily Commit.

It should be treated as a proposal-level foundation, not a final implementation blueprint.

The approved technical strategy is documented in:

- `docs/03-architecture/technical-strategy-proposal.md`

Implementation may proceed through the accepted Delivery Breakdown PR sequence.

---

## Architecture goals

- Keep the MVP simple.
- Prioritize product behavior over technical sophistication.
- Keep domain logic testable.
- Avoid premature offline-first complexity.
- Avoid coupling scoring rules directly to UI components.
- Keep future sync and offline support possible.

---

## Suggested application shape

Daily Commit should use a layered structure:

```text
Presentation
Domain
Data
```

---

## Presentation layer

Responsible for:

- screens;
- user interaction;
- form validation feedback;
- view state;
- navigation.

The Presentation layer should not own scoring rules.

---

## Domain layer

Responsible for product behavior and business rules.

Examples:

- validate day configuration;
- calculate binary objective contribution;
- calculate numeric objective contribution;
- calculate base score;
- calculate bonus score;
- calculate final score;
- determine whether all base objectives are complete;
- determine whether a day can activate;
- determine whether a day should close.

Domain logic should be easy to unit test.

---

## Data layer

Responsible for:

- persistence;
- repository implementations;
- serialization;
- migration concerns;
- future sync boundaries.

The Data layer should expose product-oriented repositories to the rest of the app.

---

## Suggested repositories

```text
ObjectiveRepository
DayRepository
ScoreRepository
```

### ObjectiveRepository

Manages reusable objectives.

### DayRepository

Manages days and daily objectives.

### ScoreRepository

May calculate scores on demand or retrieve stored closed-day snapshots.

This repository may remain implicit if score calculation stays purely domain-driven in the MVP.

---

## Domain services

Suggested domain services:

```text
DayConfigurationValidator
ScoreCalculator
DayClosurePolicy
WeeklySummaryCalculator
```

### DayConfigurationValidator

Checks whether a draft day can be activated.

### ScoreCalculator

Calculates objective contribution, base score, bonus score, and final score.

### DayClosurePolicy

Determines whether an active day should close.

### WeeklySummaryCalculator

Calculates weekly performance and consistency.

---

## MVP persistence direction

The MVP needs reliable persistence, but does not require offline-first sync.

The approved Technical Strategy uses Supabase Postgres as the MVP source of truth, with Supabase Auth and Vercel hosting.

Earlier acceptable options included:

- local browser storage for a very early prototype;
- a lightweight backend database for cross-device usage;
- a hosted BaaS if it reduces implementation overhead.

The chosen option should be documented in an ADR before implementation.

---

## Testing strategy

The highest-value tests are domain tests:

- scoring rules;
- base objective validation;
- bonus compensation;
- day activation validation;
- auto-close rules;
- weekly performance calculation;
- weekly consistency calculation.

UI tests can wait until behavior stabilizes.

---

## Technical constraints

- Documentation must remain in English.
- Product behavior must be implemented in small PRs.
- Product implementation should proceed through the accepted Delivery Breakdown PR sequence.
- Architecture should support future offline evaluation without making offline an MVP blocker.

---

## Accepted technical decisions

The following decisions are accepted in `docs/03-architecture/technical-strategy-proposal.md` and recorded as ADRs:

- Frontend framework: Next.js, React, TypeScript, and Tailwind CSS.
- Persistence strategy: Supabase Postgres.
- Hosting strategy: Vercel.
- Authentication: Supabase Auth email/password with one allowlisted founder account.
- Cross-device sync: supported through hosted persistence, not offline-first sync.
- Midnight closure: idempotent lazy closure plus Vercel Cron.
- Preview environment: dedicated Supabase preview project with disposable data.
- MVP timezone: hard-coded `Europe/Madrid`.
- Closed-day snapshots: store `finalScore`, `baseScore`, and `bonusScore`.
