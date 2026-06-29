# Information Architecture — Daily Commit

This document defines the initial product structure for the MVP.

---

## Primary navigation

The MVP should have four main areas:

1. Today
2. Configure Day
3. Objectives
4. Week

---

## Today

Primary execution surface.

### Purpose

Help the user understand and update the current day quickly.

### Key content

- Date.
- Day state.
- Final score.
- Base score.
- Bonus contribution.
- Base objectives.
- Bonus objectives.
- Pending high-impact objectives.
- Auto-close status when relevant.

### Primary actions

- Mark binary objective completed.
- Update numeric objective progress.
- Open active day configuration.

---

## Configure Day

Manual planning surface.

### Purpose

Let the user build or adjust the daily commitment.

### Key content

- Selected date.
- Available objectives.
- Selected objectives.
- Base or bonus classification.
- Weight configuration.
- Base total validation.
- Minimum base objective validation.
- Exclude day action.

### Primary actions

- Select objectives.
- Set weights.
- Mark objective as base or bonus.
- Activate day.
- Mark day as excluded.

---

## Objectives

Reusable objective management.

### Purpose

Let the user manage the objective catalog.

### Key content

- Active objectives.
- Inactive objectives.
- Objective type.
- Target and unit for numeric objectives.
- Suggested weight if supported.

### Primary actions

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.

---

## Week

Review surface.

### Purpose

Help the user understand weekly performance and consistency.

### Key content

- Monday-to-Sunday week.
- Performance score.
- Scored days count.
- Excluded days count.
- Unconfigured days count.
- Daily score and state.

### Primary actions

- Review day details.
- Navigate to current day.

---

## Navigation principle

The product should optimize for opening the app and landing on Today.

Configuration and review are secondary to daily execution.
