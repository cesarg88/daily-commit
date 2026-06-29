# Implementation Plan — Daily Commit

This document defines a proposed implementation sequence for the MVP.

The plan should be executed through small, reviewable pull requests.

The detailed delivery breakdown for the approved Technical Strategy is documented in:

- `docs/04-delivery/delivery-breakdown.md`

Implementation remains blocked until the Delivery Breakdown is approved by the CEO and CTO.

---

## Implementation principles

- Build product behavior before UI polish.
- Keep PRs small.
- Validate domain rules with tests.
- Do not introduce integrations in MVP.
- Do not introduce offline-first complexity in MVP.
- Keep documentation updated when decisions change.

---

## Phase 0 — Technical foundation

### Goal

Choose and document the technical foundation.

### Deliverables

- Technical Strategy proposal.
- Frontend framework decision ADR.
- Persistence, hosting, and authentication ADR.
- Midnight auto-close ADR.
- Domain architecture and testing ADR.
- Approved first implementation PR sequence.

### Notes

No product feature implementation or project scaffold should start until the Delivery Breakdown is approved by the CEO and CTO.

After approval, create the minimal scaffold in a separate PR.

The scaffold PR must include tooling, validation commands, and a placeholder route only. It must not include domain models, scoring rules, persistence, authentication flows, product screens, or product feature implementation.

---

## Phase 0.5 — Delivery breakdown

### Goal

Translate the approved Technical Strategy into a PR-sized delivery plan.

### Deliverables

- Delivery milestones.
- PR sequence.
- Scope and explicit non-scope for each PR.
- Expected files or areas touched.
- Required tests.
- Acceptance criteria.
- CEO and CTO review focus.
- Risks and mitigations.
- Dependencies between PRs.
- Definition of done for each milestone.
- Clear gate before moving from one milestone to the next.

### Notes

This phase is documentation-only.

No product feature implementation, app scaffold, runtime dependencies, Supabase migrations, UI screens, or product code should be added in the Delivery Breakdown PR.

---

## Phase 1 — Scaffold and validation

### Goal

Create the minimal technical surface required for implementation PRs.

### Deliverables

- Minimal Next.js TypeScript app.
- Lint, format, typecheck, test, build, and validate commands.
- Placeholder route only.
- Initial CI validation if practical.

### Notes

This phase maps to PR 1 in the Delivery Breakdown.

It must not include domain models, scoring rules, persistence, authentication flows, product screens, or product features.

---

## Phase 2 — Domain model and scoring

### Goal

Implement the core rules without UI complexity.

### Deliverables

- Objective model.
- Day model.
- Daily objective model.
- Score calculation.
- Day activation validation.
- Day closure policy.
- Weekly summary calculation.
- Unit tests for core behavior.

### Notes

This phase maps to PRs 2, 3, and 4 in the Delivery Breakdown.

---

## Phase 3 — Persistence and authentication foundation

### Goal

Add durable storage and secure founder access before product feature UI.

### Deliverables

- Supabase migrations.
- Repository interfaces.
- Supabase repository implementations.
- Row Level Security policies.
- Closed-day score snapshots.
- Unauthorized-access validation evidence.
- Supabase Auth email/password shell.
- One allowlisted founder account.
- Protected app routes.

### Notes

This phase maps to PRs 5 and 6 in the Delivery Breakdown.

---

## Phase 4 — Objective management

### Goal

Allow the user to manage reusable objectives.

### Deliverables

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.
- Persist objective catalog.

### Notes

This phase maps to PR 7 in the Delivery Breakdown.

---

## Phase 5 — Day configuration

### Goal

Allow the user to configure and activate a valid day.

### Deliverables

- Select objectives for a day.
- Mark objectives as base or bonus.
- Assign weights.
- Validate base total equals 100%.
- Validate at least 3 base objectives.
- Activate day.
- Mark day as excluded.

### Notes

This phase maps to PR 8 in the Delivery Breakdown.

---

## Phase 6 — Today execution

### Goal

Make the Today screen useful for daily execution.

### Deliverables

- Show active day.
- Show final score.
- Show base score and bonus contribution.
- Update binary objectives.
- Update numeric objectives.
- Recalculate score immediately.
- Keep incomplete base objectives visible.

### Notes

This phase maps to PR 9 in the Delivery Breakdown.

---

## Phase 7 — Day closure orchestration

### Goal

Finalize day outcomes automatically.

### Deliverables

- Auto-close when all base objectives are complete.
- Auto-close at midnight.
- Protected Vercel Cron endpoint.
- Idempotent closure.
- Store final score.
- Store base score and bonus score.
- Prevent auto-close only because bonus raises final score to 100%.

### Notes

This phase maps to PR 10 in the Delivery Breakdown.

---

## Phase 8 — Weekly review

### Goal

Review weekly performance honestly while showing consistency separately.

### Deliverables

- Monday-to-Sunday weekly view.
- Weekly performance from scored days only.
- Weekly consistency summary.
- Daily state list.
- Daily score list.

### Notes

This phase maps to PR 11 in the Delivery Breakdown.

---

## Phase 9 — MVP hardening

### Goal

Prepare the MVP for real daily use.

### Deliverables

- Mobile usability pass.
- Empty states.
- Basic error states.
- Data persistence validation.
- Documentation review.
- Founder dogfooding checklist.

### Notes

This phase maps to PR 12 in the Delivery Breakdown.

---

## Review cadence

Each PR should include:

- summary;
- product behavior changed;
- validation performed;
- screenshots when UI changes;
- known limitations.

For the Technical Strategy proposal PR, explicitly confirm that no product implementation was started.

For the Delivery Breakdown PR, explicitly confirm that no product implementation, scaffold, dependencies, migrations, UI, or product code were added.
