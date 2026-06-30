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

## GitHub publishing identity

The Lead Orchestrator must publish repository changes through the `Cesar-IA-Agent` GitHub App, not through the personal `cesarg88` GitHub account.

Required app details:

- repo: `cesarg88/daily-commit`;
- app name: `Cesar-IA-Agent`;
- app ID: `4181617`;
- installation ID: `143494849`;
- local private key path: `/Users/cesargonzalez/Documents/cesar-ia-agent.2026-06-30.private-key.pem`;
- expected PR author: `cesar-ia-agent[bot]`;
- expected commit author email: `298223085+cesar-ia-agent[bot]@users.noreply.github.com`.

Publishing rules:

- Generate a GitHub App JWT with app ID `4181617` and the local private key.
- Exchange the JWT for an installation access token with `POST /app/installations/143494849/access_tokens`.
- Use that installation access token for branch creation, commits, pushes, and pull request creation.
- Do not use `gh auth token`, the GitHub connector authenticated as `cesarg88`, personal SSH credentials, or any personal GitHub token for publishing changes.
- Never print the private key, JWT, or installation token in logs, comments, pull requests, or documentation.
- Verify `GET /app` returns `name: Cesar-IA-Agent` and `slug: cesar-ia-agent` before publishing.
- After opening a PR, verify the PR author is `cesar-ia-agent[bot]`.

If local git commits are required before pushing, set the commit identity explicitly:

```text
GIT_AUTHOR_NAME=cesar-ia-agent[bot]
GIT_AUTHOR_EMAIL=298223085+cesar-ia-agent[bot]@users.noreply.github.com
GIT_COMMITTER_NAME=cesar-ia-agent[bot]
GIT_COMMITTER_EMAIL=298223085+cesar-ia-agent[bot]@users.noreply.github.com
```

Reference validation:

- PR: `https://github.com/cesarg88/daily-commit/pull/10`
- commit: `0dda69fef273f76773a10ed5816a5ce405dc23fd`
- confirmed actor: `cesar-ia-agent[bot]`

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
