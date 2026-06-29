# Data Model — Daily Commit

This document defines a product-level data model for the MVP.

It is not tied to a specific database yet.

---

## Objective

Reusable objective definition.

### Fields

```text
id: string
name: string
type: binary | numeric
isActive: boolean
defaultTargetValue?: number
defaultUnit?: string
defaultWeight?: number
createdAt: datetime
updatedAt: datetime
```

### Notes

- `defaultTargetValue` and `defaultUnit` are required for numeric objectives.
- Deactivated objectives should remain available historically.

---

## Day

Calendar-day commitment record.

### Fields

```text
id: string
date: date
state: unconfigured | draft | active | closed | excluded
closedAt?: datetime
createdAt: datetime
updatedAt: datetime
```

### Notes

- There should be at most one Day per calendar date.
- Unconfigured days may be represented implicitly or explicitly depending on implementation.

---

## DailyObjective

Objective selected for a specific day.

### Fields

```text
id: string
dayId: string
objectiveId: string
nameSnapshot: string
type: binary | numeric
kind: base | bonus
weight: number
targetValue?: number
currentValue?: number
unit?: string
isCompleted: boolean
createdAt: datetime
updatedAt: datetime
```

### Notes

- `nameSnapshot` preserves the name used for the day even if the reusable objective changes later.
- Numeric objectives require `targetValue`, `currentValue`, and `unit`.
- Binary objectives can use `isCompleted` only.

---

## ScoreSnapshot

Calculated score values for a day.

### Fields

```text
dayId: string
baseScore: number
bonusScore: number
finalScore: number
bonusEarned: number
calculatedAt: datetime
```

### Notes

Score can be calculated on demand, but storing snapshots may be useful for closed days.

---

## Derived calculations

### Binary objective contribution

```text
completed ? weight : 0
```

### Numeric objective contribution

```text
min(currentValue / targetValue, 1) * weight
```

### Base score

```text
sum(contributions where kind == base)
```

### Bonus score

```text
sum(contributions where kind == bonus)
```

### Final score

```text
min(baseScore + bonusScore, 100)
```

---

## Validation rules

### Day activation

A day can be activated only when:

- it has at least 3 base objectives;
- base objective weights sum to exactly 100%;
- each numeric objective has a target value and unit;
- each objective has a positive weight.

### Day closure

A day closes automatically when:

- all base objectives are fully complete; or
- midnight is reached while the day is active.

A day does not auto-close only because final score reaches 100% through bonus compensation.

---

## Future considerations

Potential future fields:

```text
changeHistory
streakMetadata
syncStatus
sourceIntegration
archivedAt
```

These are intentionally out of MVP scope.
