# ADR-002 — Use Supabase Postgres, Supabase Auth, and Vercel hosting

## Status

Proposed

## Date

2026-06-29

## Context

Daily Commit needs reliable persistence and cross-device access for a single founder user. The MVP should not introduce offline-first synchronization or a custom backend unless required.

The app will store personal daily routine, health-adjacent, and discipline data, so remote persistence requires authentication and authorization even for a single-user product.

## Decision

Use:

- Supabase Postgres as the source of truth;
- Supabase Auth for one allowlisted founder account;
- Row Level Security from the first persistence migration;
- Vercel to host the Next.js app.

## Rationale

Supabase provides a real Postgres database, built-in auth, and RLS. Vercel is a low-friction hosting path for Next.js and supports preview deployments and cron-triggered functions.

This combination keeps infrastructure simple while preserving future portability through a clean application/domain/data boundary.

## Consequences

### Positive

- Supports cross-device usage.
- Avoids browser-only data loss risk.
- Keeps the data model relational and inspectable.
- Provides a straightforward auth path for a single-user MVP.
- Supports future multi-user generalization without adding multi-user UX now.

### Negative

- Adds hosted-service dependencies.
- Requires careful environment and secret management.
- RLS mistakes could expose personal data if not tested.

### Neutral / operational

- Tables should include `user_id` even though only one account is allowed.
- Service-role keys must only be used server-side.
- Preview deployments need a deliberate database strategy.

## Alternatives considered

### Browser-only localStorage or IndexedDB

Not selected because cross-device usage is a core need and the MVP needs reliable persistence.

### Firebase

Not selected because the product model is relational and benefits from Postgres constraints and SQL inspection.

### Custom backend

Not selected because the MVP does not yet need custom backend complexity.

### No authentication

Not selected because the app stores personal data in a remote database.

## Follow-up actions

- Define the initial Supabase schema after approval.
- Add RLS policies with the first persistence migration.
- Add `.env.example` during scaffold or persistence setup.
- Decide whether preview deployments use a separate Supabase project.

## Related documents

- `docs/03-architecture/technical-strategy-proposal.md`
- `docs/03-architecture/data-model.md`
- `docs/03-architecture/offline-strategy.md`
