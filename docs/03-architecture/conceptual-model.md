# Conceptual Model — Daily Commit

This document defines the core product concepts and their relationships.

It is intentionally implementation-agnostic.

---

## Core concepts

### Objective

A reusable commitment definition.

Examples:

- Gym strength training.
- 160 g protein.
- 2 liters of water.
- Track food in Yazio.

An objective is not scored by itself. It only becomes scoreable when attached to a specific day.

---

### Day

The primary product unit.

A day represents a concrete commitment for one calendar date.

A day can be:

- unconfigured;
- draft;
- active;
- closed;
- excluded.

---

### Daily Objective

A daily objective is an objective selected for a specific day.

It includes day-specific information:

- objective reference;
- base or bonus classification;
- weight;
- current progress;
- completion state;
- target value and unit when numeric.

---

### Score

A score is the calculated result of daily objective progress.

Daily Commit uses three score concepts:

- base score;
- bonus score;
- final score.

```text
finalScore = min(baseScore + bonusScore, 100)
```

---

### Week

A Monday-to-Sunday review period.

A week aggregates day states and scores.

It separates:

- weekly performance;
- weekly consistency.

---

## Relationships

```text
Objective
  └─ can be selected as many Daily Objectives

Day
  └─ has many Daily Objectives
  └─ has one Day State
  └─ has calculated Scores

Week
  └─ contains seven Days
  └─ calculates Weekly Performance from scored Days
  └─ calculates Weekly Consistency from Day states
```

---

## Day state model

### Unconfigured

The day has not entered the system.

### Draft

The day is being configured and cannot be executed yet.

### Active

The day has a valid configuration and can be updated during execution.

### Closed

The day has ended with a final score.

### Excluded

The day intentionally does not count toward weekly performance.

---

## Objective type model

### Binary

A binary objective contributes either 0 or full weight.

```text
contribution = completed ? weight : 0
```

### Numeric

A numeric objective contributes proportionally.

```text
contribution = min(currentValue / targetValue, 1) * weight
```

---

## Base and bonus model

### Base objective

A base objective belongs to the core daily commitment.

Base objectives must sum to 100%.

### Bonus objective

A bonus objective is optional.

In the MVP, bonus objectives compensate globally and can improve final score, but final score is capped at 100%.

Bonus objectives do not complete the semantic base commitment.

---

## Weekly model

### Weekly performance

Average score of scored days only.

Excluded and unconfigured days are ignored.

### Weekly consistency

How many days entered the system.

Example:

```text
Scored days: 4 / 7
Excluded days: 2
Unconfigured days: 1
```

---

## Conceptual invariants

- A day is the main unit of commitment.
- Base objective weights must sum to 100% before activation.
- A day requires at least 3 base objectives before activation.
- Final score cannot exceed 100%.
- Bonus can improve score but cannot hide incomplete base objectives.
- Weekly performance and weekly consistency are different concepts.
