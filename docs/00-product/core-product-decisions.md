# Core Product Decisions — Daily Commit

This document captures the accepted product decisions for Daily Commit.

It is intended to be a concise source of truth for product, design, and implementation work. The Product Discovery Canvas explains the broader reasoning; this document records the decisions that should guide delivery.

---

## Decision status

Each decision can have one of the following statuses:

- **Accepted** — current product direction.
- **Proposed** — likely direction, not final.
- **Deferred** — intentionally postponed.
- **Rejected** — considered and not selected.

---

## D001 — The day is the primary product unit

**Status:** Accepted

Daily Commit is organized around the day.

The main product question is not "What habits exist?" but:

> What did I commit to today, and how well am I fulfilling that commitment?

### Implications

- The Today screen is the primary experience.
- Weekly and future monthly views are aggregations of daily outcomes.
- Objectives are reusable, but they only become actionable when assigned to a day.

---

## D002 — The app is a daily commitment board, not a generic habit tracker

**Status:** Accepted

The product should behave like a portable, score-based version of a physical daily whiteboard.

It should not become a generic habit tracker, task manager, project management tool, or passive logging app.

### Implications

- Product copy and UX should emphasize daily commitment, visibility, and scoring.
- Avoid generic productivity features unless they support the daily commitment loop.
- The product should help the user win the day, not merely record history.

---

## D003 — Days are configured manually in the MVP

**Status:** Accepted

The user manually configures each day.

Day templates are intentionally excluded from the MVP.

### Rationale

The initial product is for one user. Manual configuration keeps the MVP simple and avoids premature abstraction.

### Implications

- No recurring day templates in the MVP.
- No automatic schedule generation in the MVP.
- The user chooses which objectives apply to each day.

---

## D004 — Objectives are configurable and reusable

**Status:** Accepted

The product must allow the user to create, edit, and deactivate reusable objectives.

Examples:

- Gym strength training.
- Spinning.
- 160 g protein.
- Track food in Yazio.
- Close Apple Watch rings.
- Work standing for 3 hours.
- Drink 2 liters of water.
- Eat 2 pieces of fruit.

### Implications

- Objective configuration is separate from daily execution.
- A reusable objective can be active or inactive.
- A reusable objective may have defaults such as type, unit, target value, and suggested weight.

---

## D005 — A day can be explicitly excluded

**Status:** Accepted

The user can explicitly mark a day as excluded from scoring.

A common example is a rest day.

### Implications

- Excluded days do not count toward weekly performance.
- Excluded days should still be visible in the weekly review.
- Excluded days are different from unconfigured days.

---

## D006 — Unconfigured days and excluded days are different

**Status:** Accepted

An unconfigured day means the day never entered the system.

An excluded day means the user intentionally decided that the day should not be scored.

### Implications

- Both states are excluded from weekly performance.
- They should be visually distinct.
- This distinction is important for weekly consistency and future streak behavior.

---

## D007 — Weekly performance is based only on scored days

**Status:** Accepted

Weekly performance is calculated as the average score of scored days only.

Unconfigured days and excluded days do not count toward the weekly performance average.

### Example

| Day | State | Score | Counts toward performance |
| --- | --- | ---: | --- |
| Monday | Closed | 80% | Yes |
| Tuesday | Closed | 100% | Yes |
| Wednesday | Unconfigured | — | No |
| Thursday | Excluded | — | No |
| Friday | Closed | 60% | Yes |
| Saturday | Closed | 90% | Yes |
| Sunday | Excluded | — | No |

```text
weeklyPerformance = (80 + 100 + 60 + 90) / 4 = 82.5%
```

### Implications

- Weekly performance alone can be misleading.
- Weekly consistency must be shown separately.

---

## D008 — Weekly consistency is separate from weekly performance

**Status:** Accepted

Weekly consistency shows how many days entered the system.

It should be shown separately from weekly performance.

### Example

```text
Performance: 82.5%
Scored days: 4 / 7
Excluded days: 2
Unconfigured days: 1
```

### Implications

- A high performance score based on few scored days should not look like a fully successful week.
- The product should make it easy to distinguish quality from consistency.

---

## D009 — Base objectives define the core daily commitment

**Status:** Accepted

Each configured day has base objectives.

Base objectives represent the core commitment for that day.

### Implications

- Base objectives are the source of the base score.
- Base objectives determine whether the day has been fully completed.
- Bonus objectives cannot replace the semantic importance of base objectives, even if they can compensate score.

---

## D010 — Base objectives must sum to 100%

**Status:** Accepted

When configuring a day, the weights of all base objectives must sum to exactly 100%.

### Rationale

A daily score should be easy to understand. The base commitment represents the full day.

### Implications

- The day cannot be activated until base objective weights equal 100%.
- The UI should show the current base total while configuring the day.
- Validation should block invalid configurations.

---

## D011 — Bonus objectives are allowed

**Status:** Accepted

A day may include optional bonus objectives.

Bonus objectives are not part of the base 100%, but they can contribute additional score.

### Rationale

Bonus objectives give the user flexibility and can help improve imperfect days without changing the original commitment.

### Implications

- A configured day can have a total available score greater than 100%.
- Bonus objectives should be clearly labeled.
- Bonus objectives should not hide incomplete base objectives.

---

## D012 — The final daily score is capped at 100%

**Status:** Accepted

Bonus objectives can compensate for missed base points, but the main daily score never exceeds 100%.

### Formula

```text
finalScore = min(baseScore + bonusScore, 100)
```

### Implications

- Extra work can be recognized separately.
- The main score remains easy to interpret.
- A day cannot display a primary score such as 110%.

---

## D013 — Bonus earned may be shown separately

**Status:** Accepted

When bonus objectives are completed, the product may show bonus earned separately from the final daily score.

### Example

```text
Base: 100 / 100
Bonus earned: +10
Final score: 100%
```

### Implications

- The product can recognize extra effort without distorting the primary score.
- Future analytics may distinguish base performance from bonus behavior.

---

## D014 — Bonus can compensate score but does not complete the day

**Status:** Accepted

Bonus objectives can improve the score, but they do not cause the day to be considered fully completed if base objectives remain incomplete.

### Example

```text
Base: 80 / 100
Bonus: +25
Final score: 100%
```

The score is 100%, but the day is not semantically complete if at least one base objective remains incomplete.

### Implications

- The UI should still show incomplete base objectives.
- Auto-close must not trigger only because bonus brings the score to 100%.

---

## D015 — Binary objectives are all-or-nothing

**Status:** Accepted

A binary objective is either completed or not completed.

### Formula

```text
contribution = completed ? weight : 0
```

### Examples

- Gym.
- Track food in Yazio.
- Close Apple Watch rings.

---

## D016 — Numeric objectives contribute proportionally

**Status:** Accepted

Numeric objectives can be partially completed.

### Formula

```text
contribution = min(currentValue / targetValue, 1) * weight
```

### Example

```text
Target: 160 g protein
Current: 120 g protein
Weight: 20
Contribution: 15
```

### Implications

- Partial progress matters.
- Numeric objectives require a target value, current value, and unit.
- Progress cannot contribute more than the objective weight.

---

## D017 — The Today screen is actionable

**Status:** Accepted

The Today screen must allow the user to update progress directly.

It is not only a dashboard.

### Implications

- Binary objectives should be markable from Today.
- Numeric objectives should be updatable from Today.
- Current score should update immediately after changes.
- The screen should make pending high-impact objectives visible.

---

## D018 — The day closes automatically when all base objectives are completed

**Status:** Accepted

If all base objectives are fully completed, the day closes automatically.

### Implications

- Bonus completion is not required for this auto-close condition.
- Bonus may still be visible as earned before close if completed.
- The product should clearly communicate that the base commitment has been fulfilled.

---

## D019 — The day closes automatically at midnight

**Status:** Accepted

If the day is still active at midnight, it closes automatically with the current score.

### Implications

- The product does not require manual day closure in the MVP.
- The final score should reflect completed, partially completed, and missed objectives at the end of the day.
- Midnight closure creates a final daily result even when the day was imperfect.

---

## D020 — The day must not auto-close just because final score reaches 100% via bonus

**Status:** Accepted

A day can reach 100% final score because of bonus compensation while still having incomplete base objectives.

That condition must not auto-close the day.

### Rationale

The score and the original commitment are related but not identical.

### Implications

- Auto-close should check base objective completion, not final score alone.
- The UI should distinguish score completion from base commitment completion.

---

## D021 — Offline support is not a hard MVP requirement

**Status:** Accepted

Offline support is useful, but it is not required for the MVP.

### Rationale

Offline support introduces product and technical complexity around local persistence, synchronization, and conflict handling.

### Implications

- The MVP should prioritize reliable online usage.
- The architecture should not intentionally block future offline support.
- Offline support should be revisited after validating the core loop.

---

## D022 — Mobile web experience is mandatory

**Status:** Accepted

The product should work well from a mobile browser.

### Rationale

The main value proposition depends on quick access during the day.

### Implications

- The initial product should be responsive.
- Objective updates must be low-friction on mobile.
- Desktop support is useful but secondary to mobile usability.

---

## D023 — The initial product is single-user

**Status:** Accepted

The initial product is built for one user.

### Rationale

The founder is the first user and the product is being built to solve a real personal problem.

### Implications

- Avoid multi-user complexity in the MVP unless needed for authentication or deployment.
- Avoid social features.
- Avoid generic onboarding for multiple personas.
- Future expansion should be possible but should not drive the first implementation.

---

## D024 — Documentation must be written in English

**Status:** Accepted

All repository documentation should be written in English.

### Rationale

English documentation makes the project easier to share, review, and evolve into a real product or portfolio artifact.

---

## D025 — Implementation should happen in small, reviewable increments

**Status:** Accepted

The Founding Engineer should implement the product through small branches and pull requests.

### Implications

- Each implementation task should have a clear scope.
- PRs should be reviewable without excessive context switching.
- Product behavior should be validated before visual polish.

---

## D026 — Active days can be edited in the MVP

**Status:** Accepted

An active day can be edited after activation.

However, editing an active day should be presented as changing the original commitment, not as a neutral progress update.

### Implications

- The UI should warn or clearly signal that the commitment is being changed.
- The resulting configuration must still be valid.
- The MVP does not need to keep a change history.

---

## D027 — A day requires at least 3 base objectives before activation

**Status:** Accepted

A configured day must have at least 3 base objectives before it can be activated.

### Rationale

This prevents weak configurations where one small objective can represent the entire day.

### Implications

- The day configuration screen must validate the minimum count.
- Invalid configurations cannot be activated.

---

## D028 — Bonus objectives compensate globally in the MVP

**Status:** Accepted

Bonus objectives apply to the daily score as a whole.

They do not compensate specific base objectives in the MVP.

### Implications

- Objective-specific bonus compensation rules are out of scope.
- Incomplete base objectives remain visible even when bonus compensation improves the final score.

---

## D029 — Weeks start on Monday

**Status:** Accepted

Weekly views and weekly calculations use Monday as the first day of the week.

### Rationale

The founder is based in Spain, where Monday-first weekly rhythm is expected.

---

## Deferred decisions

The following decisions are intentionally deferred.

### Streak rules

**Status:** Deferred

Open questions:

- Should unconfigured days break streaks?
- Should excluded days pause streaks?
- What score threshold counts as a good day?

### Day templates

**Status:** Deferred

Templates may be useful later, but they are not part of the MVP.

### Offline-first architecture

**Status:** Deferred

Offline support may be evaluated after the core loop is validated.

### Integrations

**Status:** Deferred

Apple Health, Apple Watch, Yazio, and other integrations are outside MVP scope.

### Score thresholds

**Status:** Deferred

The product still needs to define thresholds for labels such as poor, acceptable, good, and excellent day.

### Bonus limits

**Status:** Deferred

The MVP does not define a maximum recommended or enforced weight for bonus objectives.

### Non-compensable base objectives

**Status:** Deferred

The MVP does not define base objectives that cannot be compensated by bonus objectives.

---

## Rejected decisions

### Final daily score above 100%

**Status:** Rejected

The product will not use a primary daily score above 100%.

### Day auto-close based only on final score reaching 100%

**Status:** Rejected

The day will not auto-close merely because final score reaches 100% through bonus compensation.

### Day templates in MVP

**Status:** Rejected for MVP

Templates are intentionally excluded from the first MVP scope.
