# Milestones — Daily Commit

This document defines product delivery milestones.

Detailed implementation gates and PR-sized steps are documented in:

- `docs/04-delivery/delivery-breakdown.md`

---

## Milestone 0 — Product foundation

### Goal

Create enough product documentation to guide implementation.

### Status

Complete.

### Completion criteria

- Product discovery canvas exists.
- Core product decisions exist.
- Product principles exist.
- MVP scope exists.
- User flows exist.
- User stories exist.
- Acceptance criteria exist.
- Conceptual model exists.
- Initial implementation plan exists.

---

## Milestone 1 — Technical foundation

### Goal

Prepare the repository for implementation.

### Completion criteria

- Technical stack selected.
- Persistence strategy selected.
- Hosting strategy selected.
- Authentication decision recorded.
- Midnight auto-close strategy recorded.
- Domain architecture recorded.
- Testing strategy recorded.
- Local development workflow proposed.
- CI / validation strategy proposed.
- First implementation PR sequence proposed.

Project scaffold, test framework configuration, and first CI implementation belong in the first post-approval implementation PR.

That scaffold PR must include tooling and a placeholder route only, with no domain or product feature implementation.

---

## Milestone 2 — Delivery breakdown

### Goal

Prepare the approved Technical Strategy for implementation through a PR-sized delivery plan.

### Completion criteria

- Delivery milestones are defined.
- Implementation PR sequence is defined.
- Each implementation PR has scope, non-scope, expected files or areas touched, required tests, acceptance criteria, review focus, risks, mitigations, and dependencies.
- Definitions of done and gates are defined for each milestone.
- CEO and CTO approval requirements are explicit.
- Documentation confirms that implementation remains blocked until approval.

---

## Milestone 3 — Scaffold and validation

### Goal

Create the minimal project scaffold and validation workflow.

### Completion criteria

- Minimal Next.js TypeScript app implemented.
- Lint, format, typecheck, test, build, and validate commands configured.
- Placeholder route implemented.
- Validation passes on a clean checkout.
- No domain models, scoring rules, persistence, auth flows, product screens, or product features are included.

---

## Milestone 4 — Domain rules

### Goal

Implement core product behavior without relying on UI.

### Completion criteria

- Objective domain model implemented.
- Day domain model implemented.
- Daily objective model implemented.
- Score calculator implemented.
- Day activation validator implemented.
- Day closure policy implemented.
- Weekly summary calculator implemented.
- Domain tests cover scoring, validation, closure, and weekly rules.
- Domain code remains independent from React, Next.js, Supabase, browser APIs, and environment variables.

---

## Milestone 5 — Persistence and authentication

### Goal

Add durable storage and secure founder access.

### Completion criteria

- Supabase schema migrations implemented.
- Repository interfaces implemented.
- Supabase repository implementations added.
- RLS policies protect founder-owned data.
- Unauthorized-access attempts are validated.
- Closed-day score snapshots store final, base, and bonus scores.
- Supabase Auth email/password shell implemented.
- One allowlisted founder account can access protected routes.

---

## Milestone 6 — Objective catalog

### Goal

Allow the user to manage reusable objectives.

### Completion criteria

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.
- Persist objectives.

---

## Milestone 7 — Day configuration

### Goal

Allow the user to build and activate a daily commitment.

### Completion criteria

- Select objectives for a day.
- Mark objectives as base or bonus.
- Assign weights.
- Validate base total.
- Validate minimum base objective count.
- Activate day.
- Mark day as excluded.
- Edit active day with commitment-change warning.

---

## Milestone 8 — Today execution

### Goal

Make Daily Commit usable during the day.

### Completion criteria

- Today screen shows active day.
- Binary objectives can be completed.
- Numeric objectives can be updated.
- Score updates immediately.
- Bonus and base scores are distinguishable.
- Pending base objectives remain visible.

---

## Milestone 9 — Day closure orchestration

### Goal

Close days automatically according to product rules.

### Completion criteria

- Auto-close on base completion.
- Auto-close at midnight.
- Protected Vercel Cron endpoint implemented.
- Final score stored.
- Base score and bonus score stored for closed days.
- Bonus score alone does not trigger semantic closure.
- Closure operation is idempotent.

---

## Milestone 10 — Weekly review

### Goal

Show weekly performance and consistency.

### Completion criteria

- Monday-first week.
- Scored days listed.
- Excluded days listed.
- Unconfigured days listed.
- Weekly performance calculated.
- Weekly consistency displayed separately.

---

## Milestone 11 — MVP dogfooding

### Goal

Use the app in real daily life.

### Completion criteria

- Mobile usability pass complete.
- Empty states complete.
- Error states complete.
- Copy reviewed.
- Persistence validated.
- Founder uses Daily Commit for two consecutive weeks.
- Product issues are captured.
- Friction points are identified.
- MVP readiness is reviewed.
