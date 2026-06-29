# Backlog — Daily Commit

This document captures the initial product backlog.

It is organized by delivery area, not by sprint.

---

## Product foundation

- Review Product Discovery Canvas.
- Review Core Product Decisions.
- Review MVP Scope.
- Approve product foundation PR.

---

## Technical foundation

- Select frontend framework.
- Select persistence strategy.
- Select hosting strategy.
- Decide whether MVP requires authentication.
- Decide midnight auto-close strategy.
- Decide domain architecture.
- Decide testing strategy.
- Decide local development workflow.
- Decide CI / validation strategy.
- Approve Technical Strategy proposal.
- Create project scaffold.
- Configure test framework.
- Configure linting or formatting.
- Document local development commands.

---

## Domain model

- Implement Objective model.
- Implement Day model.
- Implement DailyObjective model.
- Implement day states.
- Implement objective types.
- Implement base and bonus objective classification.

---

## Scoring

- Implement binary objective contribution.
- Implement numeric objective contribution.
- Implement base score calculation.
- Implement bonus score calculation.
- Implement final score cap at 100%.
- Ensure bonus compensation does not hide incomplete base objectives.
- Add scoring tests.

---

## Day configuration

- Build Configure Day screen.
- Select objectives for day.
- Assign base objective weights.
- Add bonus objectives.
- Validate base total equals 100%.
- Validate at least 3 base objectives.
- Activate day.
- Mark day as excluded.
- Edit active day with warning copy.

---

## Objective catalog

- Build Objectives screen.
- Create binary objective.
- Create numeric objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.

---

## Today execution

- Build Today screen.
- Show active day.
- Show final score.
- Show base score.
- Show bonus contribution.
- Mark binary objective complete.
- Update numeric objective progress.
- Show pending base objectives.
- Show score impact after updates.

---

## Day closure

- Detect all base objectives complete.
- Close day on base completion.
- Close active day at midnight.
- Persist final score.
- Prevent closure based only on bonus compensation.

---

## Weekly review

- Build Week screen.
- Use Monday-first week.
- Show scored days.
- Show excluded days.
- Show unconfigured days.
- Calculate weekly performance.
- Show weekly consistency separately.

---

## MVP hardening

- Add empty states.
- Add basic error states.
- Review mobile usability.
- Review copy clarity.
- Validate persistence.
- Dogfood for two weeks.
- Capture issues from real usage.
