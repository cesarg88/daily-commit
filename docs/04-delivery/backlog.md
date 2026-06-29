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

## Delivery breakdown

- Define delivery milestones.
- Define implementation PR sequence.
- Define scope and explicit non-scope for each PR.
- Define expected files or areas touched for each PR.
- Define required tests for each PR.
- Define acceptance criteria for each PR.
- Define CEO and CTO review focus for each PR.
- Define risks and mitigations for each PR.
- Define dependencies between PRs.
- Define milestone definitions of done.
- Define milestone gates.
- Approve Delivery Breakdown before implementation starts.

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

## Day validation and closure rules

- Implement day activation validator.
- Validate base total equals 100%.
- Validate at least 3 base objectives.
- Validate required numeric objective fields.
- Detect all base objectives complete.
- Determine midnight closure eligibility.
- Prevent closure based only on bonus compensation.
- Add day validation and closure tests.

---

## Weekly summary rules

- Implement Monday-first week calculation.
- Calculate weekly performance from scored days only.
- Count scored days.
- Count excluded days.
- Count unconfigured days.
- Show weekly consistency separately from performance.
- Add weekly summary tests.

---

## Persistence foundation

- Add Supabase schema migrations.
- Add repository interfaces.
- Add Supabase repository implementations.
- Add `user_id` ownership model.
- Enable Row Level Security on founder-data tables.
- Store closed-day `finalScore`, `baseScore`, and `bonusScore` snapshots.
- Validate anonymous access denial.
- Validate owner-only read/write access.
- Validate insert and update ownership policies.

---

## Authentication shell

- Add Supabase Auth email/password login.
- Add logout.
- Add founder account allowlist.
- Protect app routes.
- Keep product UX minimal.
- Validate non-allowlisted users cannot enter the app.

---

## Objective catalog

- Build Objectives screen.
- Create binary objective.
- Create numeric objective.
- Edit objective.
- Deactivate objective.
- Reactivate objective.

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
