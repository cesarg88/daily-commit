# UX Notes — Daily Commit

This document captures product UX guidance for the MVP.

---

## UX goal

The app should feel faster and more useful than the physical whiteboard.

The user should be able to open the app, understand the day, update progress, and leave quickly.

---

## Core UX requirements

### Fast status reading

The Today screen should make the current state obvious:

- final score;
- base score;
- bonus contribution;
- pending base objectives;
- completed objectives;
- whether the day is active, closed, excluded, or unconfigured.

### Direct manipulation

Progress should be updated directly from Today.

Avoid forcing the user into a separate detail screen for common updates.

### Visible commitment

Base objectives should remain visible until complete.

If bonus compensation raises the final score, incomplete base objectives should still be visible.

### Honest flexibility

Editing an active day is allowed in MVP, but the UI should make clear that the original commitment is changing.

### Low configuration friction

Configuration should be explicit but lightweight.

The user should not need to fight the product to activate the day.

---

## Score presentation

The score should not be reduced to a single number when bonus objectives are involved.

Recommended display:

```text
Final score: 90%
Base: 70 / 100
Bonus applied: +20
Pending base: Gym, Fruit
```

If base score is already complete and bonus was also earned:

```text
Final score: 100%
Base: 100 / 100
Bonus earned: +10
```

---

## Configuration validation copy

Validation should be clear and corrective.

Examples:

```text
Base objectives must add up to 100%.
```

```text
Select at least 3 base objectives before activating the day.
```

```text
This day will be excluded from weekly performance.
```

```text
You are editing an active day. This changes the original commitment.
```

---

## Empty states

### Today without active day

The user should see two clear actions:

- Configure today.
- Mark today as excluded.

### No objectives yet

The user should be guided to create the first objective.

### Week without scored days

The user should see that weekly performance is not available yet, while weekly consistency can still be shown.

---

## Mobile-first interaction notes

- Tap targets should be large enough for quick updates.
- Numeric updates should support quick increments and manual editing.
- Today should require minimal scrolling for common objective counts.
- The primary score should be visible near the top.
- Pending high-impact objectives should be easy to identify.
