# Milestones — Daily Commit

This document defines product delivery milestones.

---

## Milestone 0 — Product foundation

### Goal

Create enough product documentation to guide implementation.

### Status

In progress.

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
- Project scaffold created.
- Test framework configured.
- First CI or validation command documented.

---

## Milestone 2 — Domain rules

### Goal

Implement core product behavior without relying on UI.

### Completion criteria

- Objective domain model implemented.
- Day domain model implemented.
- Daily objective model implemented.
- Score calculator implemented.
- Day activation validator implemented.
- Weekly summary calculator implemented.
- Domain tests cover scoring and validation rules.

---

## Milestone 3 — Objective catalog

### Goal

Allow the user to manage reusable objectives.

### Completion criteria

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.
- Persist objectives.

---

## Milestone 4 — Day configuration

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

---

## Milestone 5 — Today execution

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

## Milestone 6 — Day closure

### Goal

Close days automatically according to product rules.

### Completion criteria

- Auto-close on base completion.
- Auto-close at midnight.
- Final score stored.
- Bonus score alone does not trigger semantic closure.

---

## Milestone 7 — Weekly review

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

## Milestone 8 — MVP dogfooding

### Goal

Use the app in real daily life.

### Completion criteria

- Founder uses Daily Commit for two consecutive weeks.
- Product issues are captured.
- Friction points are identified.
- MVP readiness is reviewed.
