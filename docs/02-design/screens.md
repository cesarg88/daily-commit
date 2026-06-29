# Screens — Daily Commit

This document defines initial MVP screen responsibilities.

It is not a visual design specification. It describes what each screen must communicate and enable.

---

## Today

### Role

Main daily execution screen.

### Must show

- Current date.
- Day state.
- Final score.
- Base score.
- Bonus applied or earned.
- Base objective list.
- Bonus objective list.
- Pending base objectives.

### Must allow

- Toggle binary objectives.
- Update numeric objectives.
- Navigate to active day configuration.

### Design notes

The user should understand the day status within a few seconds.

---

## Configure Day

### Role

Manual daily commitment builder.

### Must show

- Selected date.
- Active reusable objectives.
- Selected base objectives.
- Selected bonus objectives.
- Base total.
- Validation errors.

### Must allow

- Select objective.
- Remove objective from day.
- Set objective as base or bonus.
- Edit weight.
- Activate day.
- Mark day as excluded.

### Design notes

The main validation states are:

- base total below 100%;
- base total above 100%;
- fewer than 3 base objectives;
- valid configuration.

---

## Objectives

### Role

Reusable objective catalog.

### Must show

- Objective name.
- Objective type.
- Target and unit for numeric objectives.
- Active or inactive state.

### Must allow

- Create objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.

---

## Week

### Role

Weekly performance and consistency review.

### Must show

- Week range.
- Performance score.
- Scored days count.
- Excluded days count.
- Unconfigured days count.
- Daily state for each Monday-to-Sunday day.
- Daily score for scored days.

### Design notes

Performance and consistency must not be collapsed into a single number.

---

## Empty states

### No active day

The Today screen should guide the user to configure the day or mark it as excluded.

### No objectives

The Configure Day screen should guide the user to create the first objective.

### No scored days this week

The Week screen should show that no weekly performance exists yet and should still show consistency information.
