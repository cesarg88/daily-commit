# Implementation Plan — Daily Commit

This document defines a proposed implementation sequence for the MVP.

The plan should be executed through small, reviewable pull requests.

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

No product feature implementation or project scaffold should start until the Technical Strategy proposal is approved by the CEO and CTO.

After approval, create the minimal scaffold in a separate PR.

---

## Phase 1 — Domain model and scoring

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

---

## Phase 2 — Objective management

### Goal

Allow the user to manage reusable objectives.

### Deliverables

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.
- Persist objective catalog.

---

## Phase 3 — Day configuration

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

---

## Phase 4 — Today execution

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

---

## Phase 5 — Day closure

### Goal

Finalize day outcomes automatically.

### Deliverables

- Auto-close when all base objectives are complete.
- Auto-close at midnight.
- Store final score.
- Prevent auto-close only because bonus raises final score to 100%.

---

## Phase 6 — Weekly review

### Goal

Show weekly performance and consistency.

### Deliverables

- Monday-to-Sunday weekly view.
- Weekly performance from scored days only.
- Weekly consistency summary.
- Daily state list.
- Daily score list.

---

## Phase 7 — MVP hardening

### Goal

Prepare the MVP for real daily use.

### Deliverables

- Mobile usability pass.
- Empty states.
- Basic error states.
- Data persistence validation.
- Documentation review.
- Founder dogfooding checklist.

---

## Review cadence

Each PR should include:

- summary;
- product behavior changed;
- validation performed;
- screenshots when UI changes;
- known limitations.

For the Technical Strategy proposal PR, explicitly confirm that no product implementation was started.
