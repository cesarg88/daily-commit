# Delivery Breakdown — Daily Commit

## Status

Accepted by CEO and CTO.

PR #5 was merged on 2026-06-29. Implementation may proceed through the approved PR sequence.

## Date

2026-06-29

## Purpose

This document translates the approved Technical Strategy into a practical MVP delivery plan.

It defines small, reviewable implementation milestones and PR-sized steps for Daily Commit while preserving the PEOS approval gates.

## Implementation status

No product implementation was added in the Delivery Breakdown PR.

The Delivery Breakdown PR did not add an application scaffold, runtime dependencies, Supabase migrations, UI screens, product code, auth flows, persistence code, or domain implementation.

## Delivery principles

- Keep every implementation PR reviewable on its own.
- Ship rules before UI screens when the rule affects scoring, validation, closure, or weekly summaries.
- Keep product rules in pure TypeScript domain modules.
- Keep persistence and Supabase concerns outside the domain layer.
- Add tests in the same PR as the behavior they protect.
- Preserve the single-user founder MVP.
- Preserve the explicit MVP exclusions: no AI, no integrations, no offline-first behavior, no templates, no social features, and no multi-profile UX.
- Keep the Lead Orchestrator accountable for scope control, non-scope control, handoff quality, validation expectations, PR clarity, risk visibility, and readiness for CEO/CTO review.
- Treat internal agent allocation as an orchestration detail unless it changes approved scope, creates material risk, or affects reviewability.

## Lead Orchestrator execution model

The Lead Orchestrator owns delivery coordination for approved work.

For each approved milestone or implementation PR, the Lead Orchestrator decides the execution model based on:

- complexity: how many layers, files, flows, or systems are affected;
- risk: whether the work can break product invariants, data privacy, persistence integrity, auth boundaries, closure timing, or review clarity;
- required expertise: whether the work needs focused domain, persistence, auth, UI, operations, or testing expertise;
- reviewability: whether the work can remain understandable as one external PR, or needs internal specialist handoffs while preserving a small public review unit.

The Lead Orchestrator does not own product decisions, architecture decisions, approval gates, merge authority, or final CEO/CTO acceptance.

### Execution model options

| Model | When to use it | Lead Orchestrator accountability |
| --- | --- | --- |
| Implement directly | Low complexity, low risk, narrow file surface, straightforward validation. | Keep the PR small, document scope/non-scope, run validation, and prepare the PR for CEO/CTO review. |
| Delegate to one specialized agent | A PR needs focused expertise but remains one coherent review unit. | Provide a precise handoff, constrain scope, review output, ensure tests/docs are updated, and own final PR clarity. |
| Split internal work across specialized agents | A PR has multiple independent internal workstreams but should remain one external delivery unit. | Coordinate handoffs, reconcile outputs, prevent overlap, verify integration, and keep review surface coherent. |
| Request focused specialist review | The implementation is done or nearly done, but a high-risk area needs expert scrutiny. | Define review questions, capture tradeoffs, decide follow-up actions, and ensure readiness for CEO/CTO review. |

### Breakdown and delegation rules

- The external delivery unit remains the approved milestone or pull request.
- Internal delegation must not expand scope beyond the approved PR.
- Any delegated task must include explicit scope, explicit non-scope, expected files or areas touched, required tests, validation evidence, risks, and handoff notes.
- A specialized agent may implement narrowly scoped work, but does not own product decisions, architecture decisions, approval gates, orchestration decisions, or merge authority.
- The Lead Orchestrator reviews delegated output before it reaches CEO/CTO review.
- If delegation creates material risk, changes scope, or makes review harder, the Lead Orchestrator must surface that tradeoff and adjust the delivery plan before proceeding.

### Initial execution model by implementation PR

| PR | External delivery unit | Execution model | Why this model | Expected delegation or review |
| --- | --- | --- | --- | --- |
| 1 | Scaffold & Tooling | Implement directly with CTO review focus. | Narrow setup work; low product risk; reviewability depends on keeping the scaffold minimal. | Request CTO review on scripts, CI shape, env docs, and absence of product code. |
| 2 | Domain Scoring Rules | Delegate to one domain rules specialist, then Lead Orchestrator review. | Scoring is core product behavior and benefits from focused test design. | Handoff includes binary, numeric, base, bonus, and capped final score cases. |
| 3 | Day Validation & Closure Rules | Delegate to one domain rules specialist with focused CTO review. | Activation and closure rules carry product-invariant and date-handling risk. | Handoff includes base total, minimum base count, numeric validation, base-completion closure, midnight eligibility, and bonus non-closure. |
| 4 | Weekly Summary Rules | Implement directly or delegate to the same domain rules specialist depending on PR 2-3 continuity. | Pure domain work with clear tests; continuity with previous domain rules may reduce risk. | Request focused CEO review on performance vs consistency semantics. |
| 5 | Persistence Foundation | Delegate to one persistence/RLS specialist and request focused CTO security review. | RLS, ownership policies, migrations, and unauthorized-access evidence are high-risk technical areas. | Handoff must include schema, repository interfaces, RLS checks, and service-role boundary validation. |
| 6 | Authentication Shell | Delegate to one auth specialist or pair with persistence specialist. | Auth depends on Supabase/RLS boundaries and route protection; product UX must stay minimal. | Request CTO review on allowlist, protected routes, server/client Supabase usage, and non-allowlisted access. |
| 7 | Objective Catalog | Delegate to one product UI/application specialist. | The PR crosses UI, forms, use cases, and persistence but remains a coherent product slice. | Lead Orchestrator verifies MVP field limits and prevents generic task-manager expansion. |
| 8 | Day Configuration | Split internal work only if needed between form UX and application validation integration. | Highest form complexity in the MVP; must preserve deliberate commitment without duplicating domain validation. | Lead Orchestrator owns integration, warning copy, validation mapping, and review coherence. |
| 9 | Today Execution | Split internal work only if needed between interaction UI and score/update orchestration. | Today is the primary product surface and must keep score honest while staying low-friction. | Request CEO review on product feel and CTO review on reuse of domain scoring. |
| 10 | Day Closure Orchestration | Delegate to one closure/operations specialist and request focused CTO review. | Lazy closure, cron protection, idempotency, and score snapshots are operationally risky. | Handoff must include retry behavior, protected endpoint validation, and no duplicated scoring implementation. |
| 11 | Weekly Review | Implement directly or delegate to one product UI/application specialist. | Weekly review is user-facing but bounded by already-tested domain calculations. | Request CEO review on honest performance/consistency presentation. |
| 12 | MVP Hardening | Split internal work across focused specialists only for clearly separable checks. | Hardening touches mobile usability, empty states, error states, copy, persistence validation, and docs. | Lead Orchestrator consolidates findings and prevents hardening from becoming feature expansion. |

### Handoff checklist for delegated work

Every delegated implementation or review task must include:

- approved source documents to read;
- exact PR scope;
- explicit non-scope;
- expected files or areas touched;
- required tests and validation evidence;
- known risks and tradeoffs;
- expected handoff format;
- criteria for returning the work to the Lead Orchestrator.

### Specialist review triggers

The Lead Orchestrator should request focused specialist review when:

- a change affects scoring, activation, closure, or weekly calculation semantics;
- a change affects Supabase RLS, auth, service-role boundaries, or route protection;
- a change affects cron, idempotency, timezone behavior, or closed-day snapshots;
- a UI flow risks weakening the daily commitment model;
- a PR becomes large enough that CEO/CTO review clarity is at risk.

## Proposed delivery sequence

| Milestone | PRs | Gate |
| --- | --- | --- |
| M0 — Delivery Approval | This documentation PR | CEO and CTO approve this breakdown before implementation starts. |
| M1 — Scaffold & Validation | PR 1 | Tooling and validation commands pass on a clean checkout. |
| M2 — Domain Rules | PRs 2-4 | Scoring, activation, closure, and weekly rules are tested before product screens. |
| M3 — Persistence & Access | PRs 5-6 | Supabase schema, RLS, repositories, and founder auth are verified before feature UI. |
| M4 — Core Product Loop | PRs 7-9 | Founder can create objectives, configure a day, and execute Today. |
| M5 — Day Closure Orchestration | PR 10 | Days close correctly and closed-day score snapshots are stored. |
| M6 — Weekly Review | PR 11 | Weekly review separates performance from consistency. |
| M7 — MVP Hardening | PR 12 | MVP is ready for founder dogfooding. |

## Milestone gates

### M0 — Delivery Approval

Definition of done:

- Delivery milestones are documented.
- Implementation PR sequence is documented.
- Each implementation PR has scope, explicit non-scope, expected files or areas touched, required tests, acceptance criteria, review focus, risks, mitigations, and dependencies.
- Lead Orchestrator execution model, delegation criteria, and handoff expectations are documented.
- CEO and CTO review instructions are clear.
- The documentation confirms that implementation remains blocked.

Gate before M1:

- CEO approves that the delivery plan preserves product intent and MVP boundaries.
- CTO approves that the delivery plan follows the approved Technical Strategy.

### M1 — Scaffold & Validation

Definition of done:

- Minimal Next.js TypeScript app exists.
- Lint, format, typecheck, test, build, and validate commands exist.
- Placeholder route renders.
- No product behavior exists.

Gate before M2:

- `npm run validate` passes on a clean checkout.
- CTO confirms scaffold PR did not include domain models, persistence, auth flows, product screens, or product features.

### M2 — Domain Rules

Definition of done:

- Scoring, day activation, day closure, and weekly summary rules exist as pure TypeScript.
- Domain tests cover accepted MVP invariants.
- Domain code has no imports from React, Next.js, Supabase, browser APIs, or environment variables.

Gate before M3:

- Domain tests pass.
- CEO confirms product rules match accepted behavior.
- CTO confirms domain boundaries are clean.

### M3 — Persistence & Access

Definition of done:

- Supabase schema and migrations exist.
- Repository interfaces and Supabase implementations exist.
- RLS protects founder-owned data.
- Closed-day score snapshots store `finalScore`, `baseScore`, and `bonusScore`.
- Auth shell protects app routes for one allowlisted founder account.

Gate before M4:

- Unauthorized access attempts are validated.
- Service-role credentials are not exposed to client code.
- Founder can log in and out.
- CTO approves persistence and auth boundaries.

### M4 — Core Product Loop

Definition of done:

- Objective catalog works.
- Manual day configuration works.
- Active day editing includes commitment-change warning.
- Today execution allows binary and numeric progress updates.
- Scores recalculate immediately.
- Incomplete base objectives remain visible even when bonus compensation reaches 100%.

Gate before M5:

- Founder can complete the create objective -> configure day -> activate day -> update Today loop in a preview environment.
- CEO confirms the loop still feels like a daily commitment board, not a generic task tracker.

### M5 — Day Closure Orchestration

Definition of done:

- Day closes when all base objectives are complete.
- Day closes lazily after midnight when eligible.
- Protected Vercel Cron endpoint exists.
- Closure behavior is idempotent.
- Closed-day score snapshots store `finalScore`, `baseScore`, and `bonusScore`.

Gate before M6:

- Base-completion and midnight closure paths are validated.
- CTO confirms cron protection and closure orchestration.

### M6 — Weekly Review

Definition of done:

- Weekly review uses Monday-first weeks.
- Weekly performance is calculated from scored days only.
- Weekly consistency is shown separately.
- Scored, excluded, and unconfigured day states are visible.

Gate before M7:

- Weekly review clearly distinguishes scored, excluded, and unconfigured days.
- CEO confirms weekly review gives an honest read of quality and consistency.

### M7 — MVP Hardening

Definition of done:

- Mobile usability pass complete.
- Empty and error states are present for MVP flows.
- Copy supports the daily commitment model.
- Persistence validation is complete.
- Dogfooding checklist is ready.

Gate before dogfooding:

- CEO approves MVP usability for two-week founder dogfooding.
- CTO approves production-readiness for the limited single-user MVP.

## Implementation PR plan

### PR 1 — `chore: scaffold web app`

Scope:

- Create minimal Next.js App Router application with TypeScript.
- Add Tailwind CSS if selected during scaffold.
- Add lint, format, typecheck, test, build, and validate commands.
- Add initial test runner configuration.
- Add placeholder route only.
- Add `.env.example` with documented variable names and no secrets.
- Add initial CI validation if practical in the scaffold PR.

Explicit non-scope:

- No domain models.
- No scoring rules.
- No day validation or closure rules.
- No weekly summary logic.
- No Supabase migrations.
- No persistence repositories.
- No auth flows.
- No product screens.
- No product feature implementation.

Expected files or areas touched:

- `package.json`
- lockfile
- framework configuration files
- `src/app/`
- test configuration
- CI workflow if included
- `README.md` or setup docs for commands

Required tests and validation:

- Placeholder test passes.
- Lint passes.
- Typecheck passes.
- Production build passes.
- `npm run validate` passes.

Acceptance criteria:

- A clean checkout can install dependencies and run validation commands.
- Placeholder route renders without product functionality.
- No product behavior or data model is introduced.

CEO review focus:

- Confirm no product UX or feature scope was introduced early.

CTO review focus:

- Confirm tooling, scripts, CI shape, environment documentation, and project boundaries are suitable for small PRs.

Risks and mitigations:

- Risk: scaffold grows into product implementation.
- Mitigation: enforce placeholder-only route and no domain/data/auth files in this PR.

Dependencies:

- Depends on M0 approval.

### PR 2 — `feat: add domain scoring rules`

Scope:

- Add pure TypeScript domain models needed for scoring.
- Add score calculator for binary objectives.
- Add score calculator for numeric objectives.
- Calculate base score.
- Calculate bonus score.
- Calculate capped final score.

Explicit non-scope:

- No day activation validator.
- No day closure policy.
- No weekly summary calculator.
- No persistence.
- No Supabase.
- No UI.

Expected files or areas touched:

- `src/domain/objective/`
- `src/domain/day/`
- `src/domain/scoring/`
- `src/test/fixtures/` or `src/test/builders/`

Required tests:

- Binary objective contributes 0 or full weight.
- Numeric objective contributes proportionally.
- Numeric contribution is capped at objective weight.
- Base score sums base objective contributions.
- Bonus score sums bonus objective contributions.
- Final score is `min(baseScore + bonusScore, 100)`.

Acceptance criteria:

- Scoring rules match accepted product criteria.
- Bonus score can compensate globally but final score never exceeds 100.
- Domain code remains framework-independent.

CEO review focus:

- Confirm scoring behavior matches the physical board intent and accepted MVP scope.

CTO review focus:

- Confirm domain purity, numeric edge cases, test readability, and absence of UI/persistence coupling.

Risks and mitigations:

- Risk: decimal or rounding behavior becomes ambiguous.
- Mitigation: document the chosen precision in tests before UI renders scores.

Dependencies:

- Depends on PR 1.

### PR 3 — `feat: add day validation and closure rules`

Scope:

- Add day activation validator.
- Enforce base objective total equals 100%.
- Enforce at least 3 base objectives.
- Validate positive weights and required numeric target/unit fields.
- Add day closure policy.
- Distinguish base-completion closure from midnight eligibility.

Explicit non-scope:

- No weekly calculator.
- No persistence writes.
- No cron endpoint.
- No UI warnings.
- No active-day edit flow.

Expected files or areas touched:

- `src/domain/day/`
- `src/domain/scoring/`
- domain test builders

Required tests:

- Invalid activation when base total is below or above 100%.
- Invalid activation with fewer than 3 base objectives.
- Valid activation with at least 3 base objectives and total base weight of 100%.
- Invalid numeric objective when target value or unit is missing.
- Closure when all base objectives are complete.
- Midnight closure eligibility when active day date is before current local date.
- No closure only because bonus compensation raises final score to 100%.

Acceptance criteria:

- Invalid days cannot activate.
- Bonus objectives do not complete the semantic base commitment.
- Closure policy is idempotent and independent from infrastructure.
- MVP timezone behavior is compatible with `Europe/Madrid`.

CEO review focus:

- Confirm validation protects the commitment model without overcomplicating MVP flexibility.

CTO review focus:

- Confirm date handling, closure idempotency, and domain boundaries.

Risks and mitigations:

- Risk: midnight closure relies on fixed UTC offsets.
- Mitigation: compare local calendar dates in `Europe/Madrid`.

Dependencies:

- Depends on PR 2.

### PR 4 — `feat: add weekly summary domain rules`

Scope:

- Add weekly performance calculator.
- Add weekly consistency calculator.
- Use Monday as the first day of the week.
- Model scored, excluded, and unconfigured days for weekly summary.

Explicit non-scope:

- No Week UI.
- No persistence queries.
- No calendar visualization.
- No streak rules.

Expected files or areas touched:

- `src/domain/week/`
- `src/domain/day/`
- domain test builders

Required tests:

- Weekly performance averages scored days only.
- Excluded days do not count toward performance.
- Unconfigured days do not count toward performance.
- Weekly consistency reports scored, excluded, and unconfigured days separately.
- Week range starts on Monday.

Acceptance criteria:

- Weekly performance and consistency are separate outputs.
- A high score based on few scored days cannot be represented as full weekly consistency.

CEO review focus:

- Confirm the weekly model remains honest and not misleading.

CTO review focus:

- Confirm calculation edge cases and test coverage before persistence integration.

Risks and mitigations:

- Risk: consistency semantics drift into streak logic.
- Mitigation: explicitly exclude streak rules from this PR.

Dependencies:

- Depends on PR 3.

### PR 5 — `feat: add persistence foundation`

Scope:

- Add Supabase schema migrations.
- Add tables for objectives, days, daily objectives, and closed-day score snapshots.
- Include `user_id` ownership model.
- Enable RLS on all founder-data tables.
- Add repository interfaces.
- Add Supabase repository implementations.
- Store closed-day score snapshots with `finalScore`, `baseScore`, and `bonusScore`.
- Add validation evidence for unauthorized access attempts.

Explicit non-scope:

- No login/logout UI.
- No product screens.
- No day configuration UI.
- No Today UI.
- No cron endpoint.
- No production data seeding.

Expected files or areas touched:

- `supabase/migrations/`
- `src/application/ports/`
- `src/data/supabase/`
- `src/data/repositories/`
- environment documentation
- persistence tests or SQL validation docs

Required tests and validation:

- Migration applies cleanly.
- Repository tests cover create/read/update paths for owned data.
- Anonymous access to founder data is denied.
- Authenticated users cannot read, create, update, or delete rows owned by another user.
- Insert and update policies prevent writing another `user_id`.
- Service-role key is not available to browser/client code.

Acceptance criteria:

- Supabase schema matches the approved data model.
- RLS protects every table containing founder data.
- Closed-day snapshots preserve final, base, and bonus scores.
- Persistence stores domain-calculated scores and does not reimplement scoring rules in SQL.

CEO review focus:

- Confirm persistence supports the MVP data the founder expects to keep.

CTO review focus:

- Confirm schema, migrations, RLS, repository boundaries, secrets handling, and unauthorized-access evidence.

Risks and mitigations:

- Risk: RLS is misconfigured.
- Mitigation: require explicit unauthorized-access validation before merging.

Dependencies:

- Depends on PR 4.

### PR 6 — `feat: add authentication shell`

Scope:

- Add Supabase Auth email/password login.
- Add logout.
- Add founder email allowlist.
- Protect app routes.
- Add minimal authenticated shell.
- Add route-level handling for unauthenticated users.

Explicit non-scope:

- No objective catalog.
- No day configuration.
- No Today screen.
- No weekly review.
- No social login.
- No public sign-up.
- No multi-profile UX.

Expected files or areas touched:

- `src/app/(auth)/`
- `src/app/(app)/`
- `src/application/`
- `src/data/supabase/`
- auth middleware or route protection
- environment documentation

Required tests and validation:

- Unauthenticated users cannot access protected app routes.
- Allowed founder account can log in.
- Non-allowlisted account cannot enter the app.
- Logout clears access to protected routes.
- Server-only Supabase client is used where privileged access is required.

Acceptance criteria:

- The app has a minimal secure shell for one founder account.
- Auth is connected to the RLS ownership model.
- Product UX remains minimal and does not introduce full feature screens.

CEO review focus:

- Confirm login flow is sufficient for daily founder use.

CTO review focus:

- Confirm auth, route protection, allowlist, and client/server Supabase usage.

Risks and mitigations:

- Risk: auth scope expands into multi-user product design.
- Mitigation: keep one founder allowlist and defer multi-profile UX.

Dependencies:

- Depends on PR 5.

### PR 7 — `feat: add objective catalog`

Scope:

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.
- Persist objective catalog.
- Support binary and numeric objective fields.

Explicit non-scope:

- No day configuration.
- No scoring UI.
- No Today execution.
- No objective statistics.
- No public templates.

Expected files or areas touched:

- `src/app/(app)/objectives/`
- `src/presentation/components/`
- `src/presentation/forms/`
- `src/application/use-cases/`
- objective repository usage
- tests for objective flows

Required tests:

- Create binary objective.
- Create numeric objective with target value and unit.
- Edit objective fields.
- Deactivate objective.
- Reactivate objective.
- Deactivated objectives remain historically available but are not default candidates for day configuration.

Acceptance criteria:

- Founder can manage reusable objectives.
- Numeric objective validation is enforced.
- Catalog persistence survives page reload.

CEO review focus:

- Confirm objective management is fast enough and not a generic task manager.

CTO review focus:

- Confirm application use cases, repository usage, form validation, and tests.

Risks and mitigations:

- Risk: objective management becomes too configurable.
- Mitigation: keep only MVP fields from the data model.

Dependencies:

- Depends on PR 6.

### PR 8 — `feat: add day configuration`

Scope:

- Manual day configuration.
- Select objectives.
- Base vs bonus classification.
- Weight assignment.
- Validate base total equals 100%.
- Validate at least 3 base objectives.
- Activate day.
- Mark day as excluded.
- Edit active day with commitment-change warning.

Explicit non-scope:

- No Today progress updates.
- No weekly review.
- No templates.
- No recurring schedule.
- No active-day change history.

Expected files or areas touched:

- `src/app/(app)/day/` or equivalent route
- `src/presentation/forms/`
- `src/application/use-cases/`
- day repository usage
- day validation integration
- tests for configuration flows

Required tests:

- Invalid base total blocks activation.
- Fewer than 3 base objectives blocks activation.
- Valid day can activate.
- Bonus objectives do not affect base total.
- Excluded day is persisted and does not count as scored.
- Editing an active day requires acknowledgement of commitment-change warning.

Acceptance criteria:

- Founder can configure today's commitment manually.
- UI shows current base total.
- Activation is blocked until domain validation passes.
- Excluded day is distinct from unconfigured day.

CEO review focus:

- Confirm configuration preserves deliberate commitment without becoming heavy.

CTO review focus:

- Confirm domain validator is reused rather than duplicated in presentation code.

Risks and mitigations:

- Risk: form complexity slows daily use.
- Mitigation: keep flow narrow and use direct validation feedback.

Dependencies:

- Depends on PR 7.

### PR 9 — `feat: add today execution`

Scope:

- Build actionable Today screen.
- Show final score, base score, and bonus score.
- Update binary objectives.
- Update numeric objectives.
- Recalculate score immediately.
- Keep incomplete base objectives visible even when bonus reaches 100%.

Explicit non-scope:

- No weekly review.
- No cron endpoint.
- No advanced analytics.
- No reminders.
- No integrations.

Expected files or areas touched:

- `src/app/(app)/today/`
- `src/presentation/components/`
- `src/presentation/view-models/`
- `src/application/use-cases/`
- scoring integration
- day repository usage
- tests for Today behavior

Required tests:

- Binary objective update changes score.
- Numeric objective update changes score proportionally.
- Final score updates immediately after progress change.
- Base score and bonus score are displayed separately.
- Incomplete base objectives remain visible at capped final score of 100%.
- Day auto-closes when the last base objective is completed.

Acceptance criteria:

- Today is the main execution surface.
- Founder can update progress with low friction.
- Score remains honest and actionable.

CEO review focus:

- Confirm Today helps the founder win the day rather than merely record history.

CTO review focus:

- Confirm score calculation is reused from domain and writes are persisted safely.

Risks and mitigations:

- Risk: UI hides remaining base work once final score is capped.
- Mitigation: add explicit test and review checklist item for incomplete base visibility.

Dependencies:

- Depends on PR 8.

### PR 10 — `feat: add day closure orchestration`

Scope:

- Add lazy closure orchestration.
- Add protected Vercel Cron endpoint.
- Close active days after midnight eligibility.
- Ensure closure operations are idempotent.
- Store closed-day score snapshots.

Explicit non-scope:

- No weekly review.
- No streaks.
- No calendar heatmap.
- No daily reflection.
- No manual reminders.
- No offline closure handling.

Expected files or areas touched:

- `src/app/api/`
- `src/application/use-cases/`
- day and score repository usage
- Vercel cron configuration
- tests for closure orchestration

Required tests and validation:

- Base-complete day closes with score snapshot.
- Midnight-eligible day closes lazily.
- Cron endpoint rejects unauthorized calls.
- Closure operation is idempotent.

Acceptance criteria:

- Closed days store `finalScore`, `baseScore`, and `bonusScore`.
- Day closure follows the accepted policy.
- Closure can be safely retried by both lazy and scheduled triggers.

CEO review focus:

- Confirm automatic closure preserves the meaning of the daily commitment.

CTO review focus:

- Confirm cron protection, idempotency, snapshot storage, and no duplicated scoring implementation.

Risks and mitigations:

- Risk: scheduled closure silently fails.
- Mitigation: keep lazy closure as the fallback and make cron endpoint idempotent.

Dependencies:

- Depends on PR 9.

### PR 11 — `feat: add weekly review`

Scope:

- Add Monday-first weekly review.
- Calculate weekly performance from scored days only.
- Show weekly consistency separately.
- Show scored, excluded, and unconfigured day states.
- Read closed-day score snapshots for scored days.

Explicit non-scope:

- No closure orchestration.
- No cron endpoint.
- No streaks.
- No calendar heatmap.
- No daily reflection.
- No advanced analytics.

Expected files or areas touched:

- `src/app/(app)/week/`
- `src/application/use-cases/`
- `src/domain/week/`
- day and score repository usage
- tests for weekly summary and weekly review behavior

Required tests and validation:

- Weekly performance uses scored days only.
- Excluded days do not count toward weekly performance.
- Unconfigured days do not count toward weekly performance.
- Weekly consistency shows scored, excluded, and unconfigured day states separately.
- Monday-first week range is used.

Acceptance criteria:

- Weekly review distinguishes performance from consistency.
- Scored, excluded, and unconfigured days are visibly distinct.
- A high weekly score cannot imply full consistency when few days were scored.

CEO review focus:

- Confirm weekly review gives an honest read of quality and consistency.

CTO review focus:

- Confirm weekly review reuses domain weekly summary rules and closed-day snapshots.

Risks and mitigations:

- Risk: weekly review becomes analytics-heavy.
- Mitigation: keep the PR limited to MVP performance, consistency, and day-state visibility.

Dependencies:

- Depends on PR 10.

### PR 12 — `chore: harden MVP for dogfooding`

Scope:

- Mobile usability pass.
- Empty states.
- Error states.
- Copy review.
- Persistence validation.
- Founder dogfooding checklist.
- Small accessibility checks for core flows.
- Documentation updates for MVP usage and known limitations.

Explicit non-scope:

- No new product categories.
- No AI.
- No integrations.
- No offline-first support.
- No templates.
- No advanced analytics.

Expected files or areas touched:

- core app routes and components
- docs for usage and dogfooding
- tests for hardened states where practical

Required tests and validation:

- `npm run validate` passes.
- Core flows pass manually on mobile viewport.
- Empty states render for no objectives, no active day, and no scored week.
- Error states render for persistence failures or invalid operations.
- Persistence survives reload and cross-device verification where practical.

Acceptance criteria:

- Founder can start two-week dogfooding.
- Known MVP limitations are documented.
- The app remains focused on the daily commitment loop.

CEO review focus:

- Confirm MVP is usable enough for real daily use.

CTO review focus:

- Confirm validation coverage, error handling, and production-readiness for a limited single-user MVP.

Risks and mitigations:

- Risk: hardening turns into feature expansion.
- Mitigation: restrict PR to usability, resilience, copy, validation, and documentation.

Dependencies:

- Depends on PR 11.

## Cross-PR dependency map

```text
M0 Delivery Approval
  -> PR 1 Scaffold & Tooling
    -> PR 2 Scoring Rules
      -> PR 3 Day Validation & Closure Rules
        -> PR 4 Weekly Summary Rules
          -> PR 5 Persistence Foundation
            -> PR 6 Authentication Shell
              -> PR 7 Objective Catalog
                -> PR 8 Day Configuration
                  -> PR 9 Today Execution
                    -> PR 10 Day Closure Orchestration
                      -> PR 11 Weekly Review
                        -> PR 12 MVP Hardening
```

## Cross-cutting risks

### Risk: delivery starts before approval

Mitigation:

- Keep this PR documentation-only.
- Require CEO and CTO approval before PR 1.

### Risk: product rules are duplicated across domain, UI, and persistence

Mitigation:

- Domain modules own scoring, validation, closure, and weekly calculations.
- UI and persistence call domain/application services instead of reimplementing formulas.

### Risk: small PRs still become hard to review

Mitigation:

- Each PR has explicit non-scope.
- Defer adjacent behavior to the next sequenced PR.
- Include targeted tests and focused review instructions.

### Risk: Supabase RLS mistakes expose personal data

Mitigation:

- Enable RLS in the first persistence migration.
- Require unauthorized-access validation before merging persistence.
- Keep service-role credentials server-only.

### Risk: midnight closure has timezone bugs

Mitigation:

- Compare calendar dates in `Europe/Madrid`.
- Keep closure idempotent.
- Use lazy closure as fallback for missed cron runs.

### Risk: UI work makes the product feel like a generic task manager

Mitigation:

- CEO reviews Objective Catalog, Day Configuration, Today, and Week against the daily commitment board principle.
- Defer templates, reminders, analytics, streaks, and integrations.

### Risk: hardening expands scope

Mitigation:

- Hardening is limited to mobile usability, empty states, error states, copy, persistence validation, accessibility basics, and dogfooding readiness.

## Review instructions

### CEO review

Review for product fit:

- Does the sequence protect the daily commitment board concept?
- Are MVP exclusions preserved?
- Are Today, scoring, and weekly review sequenced in a way that validates real founder use?
- Does the delegation plan preserve clear accountability while keeping user-facing outcomes reviewable?
- Are gates strict enough to prevent feature implementation before approval?

### CTO review

Review for technical fit:

- Does the sequence follow the approved Technical Strategy?
- Are domain rules implemented before UI and persistence coupling?
- Are tests required at the right layer?
- Are Supabase, RLS, auth, cron, and environment concerns isolated to the correct PRs?
- Is each PR small enough to review independently?
- Does the proposed execution model assign specialist attention to the right risk areas without blurring architecture ownership?

## Approval checklist

- CEO approves the delivery milestones, product gates, and non-scope boundaries.
- CTO approves the technical sequence, tests, dependencies, and risk mitigations.
- CEO/CTO approval is recorded and PR #5 is merged.
