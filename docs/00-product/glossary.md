# Glossary — Daily Commit

This glossary defines the core terms used across Daily Commit documentation.

---

## Daily Commit

The product name. A personal, portable, score-based daily commitment board.

## Founder / Product Owner

The person who owns the problem, validates product usefulness, and decides product priorities.

## Fractional CTO / Head of Product Engineering

The role responsible for product direction, technical direction, trade-offs, documentation quality, and implementation guidance.

## Founding Engineer

The implementation agent responsible for building the product in small, reviewable increments.

## Objective

A reusable goal that can be selected for a specific day.

Examples: Gym, protein, water, fruit, Yazio, Apple Watch rings.

## Daily Objective

An objective selected for a specific day, with day-specific configuration such as weight, target, current progress, and base or bonus classification.

## Base Objective

An objective that belongs to the core daily commitment.

All base objectives for a day must sum to 100%.

## Bonus Objective

An optional objective that can improve the daily score but is not part of the base 100% commitment.

Bonus objectives can compensate globally in the MVP, but the final daily score is capped at 100%.

## Binary Objective

An objective that is either completed or not completed.

Examples: Gym, Yazio, Apple Watch rings.

## Numeric Objective

An objective with a target value, current value, and unit.

Examples: 160 g protein, 2 liters of water, 3 hours standing.

## Daily Score

The final score of a day.

```text
finalScore = min(baseScore + bonusScore, 100)
```

## Base Score

The sum of all base objective contributions.

## Bonus Score

The sum of all bonus objective contributions.

## Weekly Performance

The average score of scored days only.

Unconfigured and excluded days do not count toward weekly performance.

## Weekly Consistency

A representation of how many days entered the system during a week.

Example:

```text
Scored days: 4 / 7
Excluded days: 2
Unconfigured days: 1
```

## Unconfigured Day

A day that never entered the system.

It does not count toward weekly performance.

## Excluded Day

A day intentionally marked as not scored, such as a rest day.

It does not count toward weekly performance but should be visible in review.

## Active Day

A configured day currently in execution mode.

## Closed Day

A day with a final score.

A day closes when all base objectives are completed or at midnight.

## Core Loop

The minimum repeated product behavior:

1. Configure the day.
2. Execute and update progress.
3. See live score.
4. Close the day.
5. Review the week.
