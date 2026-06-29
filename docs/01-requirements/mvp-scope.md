# MVP Scope — Daily Commit

This document defines the MVP boundaries for Daily Commit.

The MVP should validate the core loop before introducing advanced automation, integrations, or analytics.

---

## MVP goal

Allow the founder to replace the physical whiteboard with a mobile-friendly daily commitment board that supports manual day configuration, direct progress updates, daily scoring, and weekly review.

---

## Core loop

1. Create reusable objectives.
2. Configure today's commitment manually.
3. Activate the day.
4. Update progress during the day.
5. See score changes immediately.
6. Let the day close automatically.
7. Review weekly performance and consistency.

---

## In scope

### Objectives

- Create objectives.
- Edit objectives.
- Deactivate objectives.
- Support binary objectives.
- Support numeric objectives.
- Store target value and unit for numeric objectives.

### Day configuration

- Configure a day manually.
- Select objectives for the day.
- Mark selected objectives as base or bonus.
- Assign weights to base objectives.
- Validate base objective total equals 100%.
- Require at least 3 base objectives before activation.
- Allow explicit excluded days.

### Execution

- Show an actionable Today screen.
- Mark binary objectives as completed.
- Update numeric objective progress.
- Recalculate score immediately after updates.
- Show pending base objectives clearly.
- Show bonus contribution separately from final score.

### Scoring

- Calculate base score.
- Calculate bonus score.
- Calculate final score capped at 100%.
- Let bonus objectives compensate globally.
- Do not auto-close a day only because bonus brings final score to 100%.

### Day closure

- Auto-close when all base objectives are complete.
- Auto-close at midnight.
- Store final daily score.

### Weekly review

- Show weekly performance.
- Show scored days.
- Show excluded days.
- Show unconfigured days.
- Use Monday as the first day of the week.

### Platform

- Mobile-friendly web app.
- Reliable persistence.

---

## Out of scope for MVP

- AI features.
- Social features.
- Sharing progress.
- Multiple user profiles.
- Public templates.
- Predefined day templates.
- Automatic integrations.
- Apple Health integration.
- Apple Watch integration.
- Yazio integration.
- Offline-first behavior.
- Complex analytics.
- Advanced streak rules.
- Mandatory daily reflection.
- Change history for active-day edits.
- Objective-specific bonus compensation rules.

---

## MVP success criteria

The MVP is successful if the founder can use it for at least two consecutive weeks instead of the physical board and answer these questions every day:

- What did I commit to today?
- How is my day going?
- What remains pending?
- What is my score?
- How consistent was my week?

---

## Non-goals

The MVP should not attempt to be a complete habit platform.

It should stay focused on the daily commitment board experience.
