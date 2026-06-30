# Review Workflow — Daily Commit

This document defines how implementation pull requests are reviewed, how review decisions are handled, and how CEO/CTO hand off the next approved step to the Lead Orchestrator after each approved PR.

## Purpose

The review workflow keeps implementation aligned with:

- the approved Product Vision;
- the approved Technical Strategy;
- the accepted Delivery Breakdown;
- the PEOS delivery model.

## Review roles

### CEO / Product Owner

The CEO / Product Owner reviews for product fit and delivery discipline.

Primary review focus:

- product intent;
- MVP boundaries;
- user-facing behavior;
- scope versus explicit non-s
- cope;
- whether the PR still feels like Daily Commit rather than a broader productivity tool.

### CTO

The CTO reviews for technical fit and delivery quality.

Primary review focus:

- architecture alignment;
- technical risk;
- tests and validation quality;
- maintainability;
- scope control;
- whether the PR stays inside the approved delivery sequence.

### Lead Orchestrator

The Lead Orchestrator prepares the PR for review, gathers validation evidence, keeps scope tight, surfaces tradeoffs, and translates review outcomes into the next delivery step.

The Lead Orchestrator does not replace CEO or CTO approval and does not own merge authority.

## Review inputs for each implementation PR

Every implementation PR should give CEO and CTO enough context to review quickly.

Expected PR content:

- summary;
- scope;
- explicit non-scope;
- validation performed;
- review focus;
- known risks or tradeoffs.

## Review decisions

### Approved

If CEO and CTO approve the PR:

- the PR may be marked ready if still draft;
- the authorized owner may merge it;
- the Lead Orchestrator records the approval outcome when needed;
- the next approved PR in sequence becomes the active delivery unit after CEO/CTO handoff.

### Request changes

If CEO or CTO requests changes:

- the PR stays the active delivery unit;
- the Lead Orchestrator addresses the requested changes within the same PR unless the requested change materially alters scope;
- validation is rerun after the changes;
- the PR returns to review with the updated evidence and a short summary of what changed.

### Scope or risk escalation

If requested changes reveal material scope change, sequencing conflict, or unexpected technical/product risk:

- the Lead Orchestrator pauses progression;
- the changed risk or scope is made explicit;
- CEO and CTO realign on whether the PR should continue, split, or be deferred.

## Approval handling rules

- No implementation PR advances the milestone sequence until the current PR is approved and merged.
- Internal specialist work does not replace CEO / CTO review of the external PR.
- A request-changes decision is resolved inside the same PR unless CEO or CTO explicitly changes the delivery unit.
- Merge confirms completion of the current approved PR, not automatic approval of the next one.

## Transition prompts after approved PRs

After an implementation PR is approved and merged, CEO/CTO provide a short transition prompt to the Lead Orchestrator for the next approved PR.

The transition prompt should be brief and operational. It should include:

- the PR that was approved and merged;
- the next approved PR name and goal;
- exact scope;
- explicit non-scope;
- required validation;
- CEO review focus;
- CTO review focus;
- any special risks or handoff notes.

## Short transition prompt template

```text
Previous PR merged:
- PR N — <merged PR title>

Next approved PR:
- PR N+1 — <next PR title>

Goal:
- <one-sentence goal>

Scope:
- <approved scope summary>

Explicit non-scope:
- <approved non-scope summary>

Required validation:
- <validation contract>

CEO review focus:
- <product focus>

CTO review focus:
- <technical focus>

Special notes:
- <handoff, risk, or sequencing note if needed>
```

## Relationship to other delivery docs

- `docs/04-delivery/delivery-breakdown.md` defines the approved PR sequence, gates, scope, non-scope, and review focus.
- This document defines how those PRs move through CEO / CTO review and how the next step is handed off after approval.
