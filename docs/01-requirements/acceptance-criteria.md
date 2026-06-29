# Acceptance Criteria — Daily Commit

This document defines MVP-level acceptance criteria.

Detailed implementation tickets may later refine these into more granular checks.

---

## Objective management

- The user can create a binary objective.
- The user can create a numeric objective with target value and unit.
- The user can edit an existing objective.
- The user can deactivate an objective.
- Deactivated objectives are not shown as default candidates during day configuration.

---

## Day configuration

- The user can configure a day manually.
- The user can select reusable objectives for a day.
- The user can mark selected objectives as base or bonus.
- Base objective weights must sum to exactly 100% before activation.
- At least 3 base objectives are required before activation.
- Invalid configurations cannot be activated.
- The user can mark a day as excluded.
- An excluded day does not count toward weekly performance.

---

## Today execution

- The Today screen shows the active day if one exists.
- The Today screen allows marking binary objectives as completed.
- The Today screen allows updating numeric objective progress.
- Score recalculates immediately after an update.
- Incomplete base objectives remain visible even when final score reaches 100% through bonus compensation.
- Bonus contribution is visually distinct from base score.

---

## Score calculation

- Binary objectives contribute either 0 or their full weight.
- Numeric objectives contribute proportionally based on current value and target value.
- Objective contribution cannot exceed its configured weight.
- Base score is the sum of base objective contributions.
- Bonus score is the sum of bonus objective contributions.
- Final score is capped at 100%.

```text
finalScore = min(baseScore + bonusScore, 100)
```

---

## Day closure

- A day closes automatically when all base objectives are fully completed.
- A day closes automatically at midnight if still active.
- A day does not close automatically only because bonus compensation raises final score to 100%.
- A closed day stores final score.

---

## Weekly review

- Weeks start on Monday.
- Weekly performance is calculated using scored days only.
- Unconfigured days do not count toward weekly performance.
- Excluded days do not count toward weekly performance.
- Weekly review shows scored days, excluded days, and unconfigured days separately.

---

## MVP exclusions

- The MVP does not include day templates.
- The MVP does not include automatic integrations.
- The MVP does not include offline-first behavior.
- The MVP does not include streak rules.
- The MVP does not include change history for active-day edits.
