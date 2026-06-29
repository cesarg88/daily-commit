# Technical Strategy Proposal — Daily Commit

## Status

Approved by CEO and CTO.

Implementation remains blocked until the accepted Delivery Breakdown PR is marked ready and merged.

## Date

2026-06-29

## Purpose

This document proposes the technical foundation for the Daily Commit MVP.

The proposal resolves the open technical decisions from the product foundation while preserving the MVP constraints:

- single-user product first;
- mobile-friendly web app;
- reliable persistence;
- no AI features;
- no Apple Health, Apple Watch, Yazio, or other integrations;
- no offline-first complexity;
- domain logic independent from UI;
- small, reviewable implementation PRs.

## Implementation status

No product implementation was started in this proposal.

This proposal does not add an application scaffold, UI screens, runtime dependencies, database migrations, product feature code, AI features, or integration stubs.

## Executive recommendation

Build Daily Commit as a TypeScript Next.js web application hosted on Vercel, backed by Supabase Postgres and Supabase Auth for one allowlisted founder account.

Keep scoring, validation, day closure, and weekly calculations in a pure TypeScript domain layer. Use the web app as the delivery surface, not as the owner of product rules.

This choice optimizes for speed, cross-device access, reliable hosted persistence, and low operational overhead without committing the MVP to offline-first architecture or a custom backend.

## Recommended frontend stack

Use:

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS;
- Server Actions or route handlers for mutations that need trusted server execution;
- Vitest for domain tests;
- React Testing Library for component behavior once UI exists;
- Playwright for a small set of end-to-end smoke tests after the first real screens exist.

Rationale:

- Next.js gives the project one deployable web app with routing, server execution, and frontend rendering in one place.
- TypeScript helps make product invariants explicit.
- React is a natural fit for an actionable Today screen and form-heavy daily configuration flow.
- Tailwind CSS keeps styling local and fast for a small MVP without introducing a large component framework too early.
- The stack is familiar, broadly supported, and easy to host on Vercel.

Implementation guardrails:

- Do not put scoring or day closure rules inside React components.
- Keep client components focused on interaction and presentation.
- Prefer server-side mutations for persistence writes.
- Keep the first scaffold minimal: no marketing page, no design system package, no AI tooling, no integration stubs.

## Recommended persistence strategy

Use Supabase Postgres as the MVP source of truth.

Recommended data ownership:

- `objectives`;
- `days`;
- `daily_objectives`;
- closed-day score snapshots.

Recommended access pattern:

- Repository interfaces live at the application/domain boundary.
- Supabase-specific implementations live in the data layer.
- Database schema is managed by migrations.
- Row Level Security is enabled even though the MVP has one user.
- Tables include `user_id` from the start to support authorization and future generalization without changing the domain model.

Closed-day score snapshots:

- Store `finalScore`, `baseScore`, and `bonusScore` when a day closes.
- Treat the stored snapshot as the historical result for weekly review and future history screens.
- Continue to keep score calculation in the domain layer; persistence stores the result of domain calculation, not a separate scoring implementation.

RLS acceptance criteria for the first persistence PR:

- RLS is enabled on every table containing founder data.
- Founder-owned rows include a `user_id` or have an equivalent policy-enforced ownership path.
- Anonymous users cannot read, create, update, or delete founder data.
- Authenticated users can only read, create, update, or delete rows they own.
- Insert and update policies prevent writing rows for another `user_id`.
- Service-role credentials are never exposed to browser/client code.
- The PR includes validation evidence for unauthorized access attempts, either through automated tests or documented SQL checks.

Rationale:

- Cross-device sync is part of the product need, so browser-only storage is insufficient for the MVP.
- Postgres keeps the model relational and inspectable.
- Supabase reduces backend setup while still giving a real database and authentication path.
- RLS and `user_id` avoid painting the project into a corner if the product later grows beyond one user.

What this does not include:

- offline-first local sync;
- conflict resolution;
- background sync queues;
- realtime collaboration;
- external integrations.

## Recommended hosting strategy

Use Vercel for the web application.

Use Supabase hosted project for database and authentication.

Rationale:

- Vercel is the shortest path for a Next.js app with preview deployments.
- Preview deployments make small documentation and implementation PRs easier to review.
- Vercel Cron can call a protected endpoint for scheduled day closure.
- Supabase owns database availability, backups, and auth infrastructure for the MVP.

Operational expectations:

- Production environment variables are configured in Vercel.
- Supabase service-role credentials are only used server-side.
- Vercel preview deployments point to a dedicated Supabase preview project, not production.
- The preview Supabase project uses disposable seed data and may be reset during development.
- Local development may initially use the preview Supabase project, but production data must never be used for local or preview validation.
- The first implementation PR should document setup commands and required environment variables, but should not include secrets.

## Authentication decision for the MVP

Authentication is required for the MVP.

Use Supabase Auth email/password login for one allowlisted founder email.

Password login is the MVP auth method because it is predictable for daily use across browser sessions and does not require opening email during routine app access. Password reset may use Supabase's standard email recovery flow.

Rationale:

- The app stores personal health, discipline, and routine data.
- Cross-device access requires a remote database, so the product needs a user boundary.
- A single-user allowlist preserves the MVP scope while avoiding an anonymous public write surface.
- Supabase Auth integrates with RLS and keeps authorization close to the database.

Explicit non-goals:

- no multi-profile product UX;
- no teams;
- no social login requirement;
- no public sign-up;
- no sharing.

## Midnight auto-close strategy

Use an idempotent server-side closure policy with two triggers:

1. Lazy closure whenever the app loads or a protected server action runs.
2. Scheduled closure through Vercel Cron calling a protected endpoint.

The closure policy should close any active day whose local date is earlier than the current date in the hard-coded MVP timezone.

MVP timezone:

```text
Europe/Madrid
```

`Europe/Madrid` is hard-coded for the MVP. Timezone configuration is deferred until the product needs to support travel, relocation, or multiple users.

Rationale:

- The founder is based in Madrid.
- Checking "active day date is before local today" avoids fragile assumptions about daylight saving changes.
- Lazy closure protects the product if a scheduled job is delayed or missed.
- Scheduled closure protects weekly review and next-day use when the founder does not open the app immediately after midnight.

Implementation guardrails:

- The closure operation must be idempotent.
- Store `closedAt` and final score when a day closes.
- Do not close a day just because bonus points raise final score to 100%.
- Auto-close on all base objectives complete remains separate from midnight closure.
- Keep all closure rules in the domain layer and call them from server-side orchestration code.

## Domain architecture

Use a layered architecture:

```text
Presentation
Application
Domain
Data
```

### Presentation

Owns screens, interaction state, navigation, form rendering, and user-facing validation messages.

Presentation must not own scoring formulas, activation rules, closure rules, or weekly calculations.

### Application

Owns use cases and orchestration.

Examples:

- create objective;
- configure day;
- activate day;
- update progress;
- close eligible days;
- fetch weekly summary.

Application code depends on domain services and repository interfaces.

### Domain

Owns product rules.

Required domain modules:

- `DayConfigurationValidator`;
- `ScoreCalculator`;
- `DayClosurePolicy`;
- `WeeklySummaryCalculator`.

Domain code should be pure TypeScript with no React, Next.js, Supabase, or browser dependencies.

### Data

Owns Supabase clients, SQL mapping, migrations, repository implementations, and persistence errors.

Data code translates between database rows and domain/application DTOs.

## Project structure

Recommended initial structure after approval:

```text
src/
  app/
    (auth)/
    (app)/
    api/
  application/
    use-cases/
    ports/
  domain/
    day/
    objective/
    scoring/
    week/
  data/
    supabase/
    repositories/
  presentation/
    components/
    forms/
    view-models/
  test/
    fixtures/
    builders/
supabase/
  migrations/
docs/
```

Notes:

- `src/app` is the Next.js routing boundary.
- `src/domain` remains framework-independent.
- `src/application/ports` contains repository interfaces.
- `src/data` contains Supabase implementations.
- Test builders should make scoring and validation tests readable.

## Testing strategy

Prioritize domain tests before UI tests.

Required first test coverage:

- binary objective contribution;
- numeric objective contribution, including capped contribution;
- base score calculation;
- bonus score calculation;
- final score capped at 100%;
- invalid activation when base weights do not sum to 100%;
- invalid activation with fewer than 3 base objectives;
- valid activation with at least 3 base objectives and total base weight of 100%;
- no semantic day closure from bonus compensation alone;
- closure when all base objectives are complete;
- midnight closure eligibility;
- weekly performance from scored days only;
- weekly consistency split across scored, excluded, and unconfigured days.

Recommended test layers:

- Unit: domain rules with Vitest.
- Application: use cases with in-memory repositories.
- Data: repository tests against a local or test Supabase database after persistence is introduced.
- UI: component tests for critical forms after flows exist.
- End-to-end: one happy path after objective management, day configuration, Today, and Week exist.

## Local development workflow

Recommended commands after scaffold:

```text
npm install
npm run dev
npm run test
npm run lint
npm run typecheck
npm run validate
```

Recommended environment handling:

- commit `.env.example`;
- do not commit `.env.local`;
- document Supabase URL and anon key requirements;
- keep service-role key server-only;
- document how to run migrations;
- document how to seed local development data only after the first persistence PR exists.

The first implementation PR should add these commands and confirm they pass on a clean checkout.

## CI / validation strategy

Use GitHub Actions for pull request validation.

Initial validation:

- install dependencies with `npm ci`;
- run formatter check if configured;
- run lint;
- run typecheck;
- run unit tests;
- run production build.

Later validation:

- add database migration validation when Supabase migrations exist;
- add Playwright smoke tests once core screens exist;
- keep CI fast enough that small PRs remain easy to review.

## Delivery sequence for first implementation PRs

Implementation should begin only after CEO and CTO approval.

Recommended first PRs:

1. `chore: scaffold web app`
   - Create minimal Next.js TypeScript app.
   - Add lint, format, typecheck, test, and validate commands.
   - Add a placeholder route only.
   - Do not add domain models, scoring rules, persistence, authentication flows, product screens, or product feature implementation.

2. `feat: add domain scoring rules`
   - Add pure domain models and score calculator.
   - Add domain tests for binary, numeric, base, bonus, and capped final score.

3. `feat: add day validation and closure rules`
   - Add day activation validator.
   - Add day closure policy.
   - Add tests for base total, minimum base objectives, base completion closure, midnight eligibility, and bonus non-closure.

4. `feat: add weekly summary domain rules`
   - Add weekly performance and consistency calculator.
   - Add tests for scored, excluded, and unconfigured days.

5. `feat: add persistence foundation`
   - Add Supabase schema migrations.
   - Add repository interfaces and Supabase implementations.
   - Add RLS and single-user ownership model.
   - Acceptance requires RLS on founder data tables, owner-only policies, anonymous access denial, write ownership enforcement, server-only service-role usage, and validation evidence for unauthorized access attempts.

6. `feat: add authentication shell`
   - Add Supabase Auth email/password login/logout flow for the allowlisted founder account.
   - Protect app routes.
   - Keep product UX minimal.

7. `feat: add objective catalog`
   - Build objective create/edit/deactivate flow.
   - Persist objective catalog.

8. `feat: add day configuration`
   - Build manual day configuration and activation flow.
   - Enforce validation rules.

9. `feat: add today execution`
   - Build actionable Today screen.
   - Support binary and numeric updates.
   - Recalculate score immediately.

10. `feat: add day closure orchestration`
    - Add closure orchestration.
    - Add protected cron endpoint.
    - Store closed-day score snapshots.

11. `feat: add weekly review`
    - Add Monday-first weekly review.
    - Calculate weekly performance from scored days only.
    - Show weekly consistency separately.

12. `chore: harden MVP for dogfooding`
    - Add mobile usability, empty states, error states, copy review, persistence validation, and dogfooding readiness.

## Main technical risks and mitigations

### Risk: framework features leak into domain rules

Mitigation: keep domain code dependency-free and enforce this through folder boundaries, tests, and code review.

### Risk: Supabase RLS is misconfigured

Mitigation: enable RLS from the first persistence migration, add explicit ownership policies, and test unauthorized access paths before real use.

### Risk: midnight closure behaves incorrectly around timezone changes

Mitigation: evaluate closure by comparing local dates in `Europe/Madrid`, not by hard-coding a fixed UTC offset.

### Risk: the first scaffold grows into product implementation before delivery approval

Mitigation: do not scaffold before Delivery Breakdown approval. After approval, the scaffold PR must contain only tooling, project structure, validation commands, and a placeholder route.

### Risk: hosted services add operational dependency

Mitigation: choose common managed services, document environment setup, keep domain logic portable, and avoid provider-specific product rules.

### Risk: UI work starts before product rules are stable

Mitigation: ship domain scoring, validation, closure, and weekly calculations before product screens.

## Alternatives considered and rejected

### Browser-only localStorage or IndexedDB

Rejected for MVP because cross-device usage is a stated product need and browser-only storage increases data-loss and migration risk.

### Offline-first PWA from the start

Rejected because the MVP explicitly excludes offline-first behavior and the sync/conflict complexity would delay validation of the daily commitment loop.

### Custom backend with Express, Fastify, Rails, or Django

Rejected for MVP because the product does not yet need custom backend complexity. The domain can remain portable while Supabase and Next.js cover persistence and server orchestration.

### Firebase

Rejected because the product model is relational and benefits from Postgres constraints, SQL inspection, and RLS.

### Native iOS app first

Rejected because the MVP needs cross-device access and fast iteration. A mobile-friendly web app is the current platform decision.

### No authentication

Rejected because the MVP stores personal data in a remote database. Single-user scope does not remove the need for access control.

### Full multi-user architecture

Rejected because the MVP is for one real founder user. The proposal includes `user_id` and RLS as a low-cost future-proofing measure, but does not include product UX for multiple users.

## Closed pre-approval decisions

- MVP auth method: Supabase Auth email/password for one allowlisted founder email.
- Preview Supabase strategy: Vercel preview deployments use a dedicated Supabase preview project with disposable data, never production data.
- MVP timezone: hard-coded `Europe/Madrid`.
- Closed-day score snapshots: store `finalScore`, `baseScore`, and `bonusScore`.

## Approval checklist

- CEO confirms the proposal preserves the product intent and MVP boundaries.
- CTO confirms the stack, persistence, hosting, auth, closure, testing, and delivery sequence.
- Implementation remains blocked until the accepted Delivery Breakdown PR is marked ready and merged.

## External references

- Next.js documentation: https://nextjs.org/docs
- Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Supabase Database documentation: https://supabase.com/docs/guides/database/overview
- Vercel Cron Jobs documentation: https://vercel.com/docs/cron-jobs
