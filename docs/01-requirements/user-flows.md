# User Flows — Daily Commit

This document describes the main product flows for the MVP.

---

## Flow 1 — Create an objective

### Goal

Create a reusable objective that can be selected when configuring a day.

### Steps

1. User opens Objectives.
2. User taps Create Objective.
3. User enters name.
4. User selects objective type: binary or numeric.
5. If numeric, user enters target value and unit.
6. User optionally enters suggested weight.
7. User saves the objective.

### Outcome

The objective is available for future day configuration.

---

## Flow 2 — Configure a day

### Goal

Build the commitment for a specific day.

### Steps

1. User opens Configure Day.
2. User selects objectives for the day.
3. User marks each selected objective as base or bonus.
4. User assigns weights to base objectives.
5. System shows base total.
6. System validates that base total equals 100%.
7. System validates that at least 3 base objectives are selected.
8. User activates the day.

### Outcome

The day becomes active and executable.

---

## Flow 3 — Mark a day as excluded

### Goal

Intentionally exclude a day from scoring.

### Steps

1. User opens Configure Day.
2. User selects Mark as Excluded.
3. System confirms that the day will not count toward weekly performance.
4. User confirms.

### Outcome

The day is marked as excluded and remains visible in the weekly review.

---

## Flow 4 — Execute the day

### Goal

Update progress during the day with minimal friction.

### Steps

1. User opens Today.
2. User sees current final score, base score, and bonus contribution.
3. User updates one or more objectives.
4. System recalculates score immediately.
5. System keeps incomplete base objectives visible.

### Outcome

The user understands current progress and what remains pending.

---

## Flow 5 — Complete all base objectives

### Goal

Automatically close the day when the base commitment is complete.

### Steps

1. User updates the last incomplete base objective.
2. System detects all base objectives are fully completed.
3. System closes the day automatically.
4. System stores final score.

### Outcome

The day is closed because the base commitment was fulfilled.

---

## Flow 6 — Midnight auto-close

### Goal

Close the day automatically when the date changes.

### Steps

1. Active day reaches midnight.
2. System calculates current base score, bonus score, and final score.
3. System closes the day.
4. System stores final score.

### Outcome

The day has a final score even if it was imperfect.

---

## Flow 7 — Edit an active day

### Goal

Allow correction or adjustment of an active day while preserving awareness that the commitment changes.

### Steps

1. User opens active day configuration.
2. System warns that editing changes the original commitment.
3. User edits objectives or weights.
4. System validates the resulting configuration.
5. User saves changes.

### Outcome

The active commitment is changed. MVP does not keep change history.

---

## Flow 8 — Review the week

### Goal

Understand weekly performance and consistency.

### Steps

1. User opens Week.
2. System shows Monday-to-Sunday week.
3. System shows scored days, excluded days, and unconfigured days.
4. System calculates weekly performance from scored days only.
5. System shows weekly consistency separately.

### Outcome

The user understands both quality and consistency of the week.
