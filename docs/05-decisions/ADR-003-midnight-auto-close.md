# ADR-003 — Use idempotent lazy and scheduled closure for midnight auto-close

## Status

Proposed

## Date

2026-06-29

## Context

The MVP requires automatic day closure at midnight and automatic closure when all base objectives are complete.

The product should not introduce offline-first background sync or fragile device-local scheduling. The founder is based in Madrid, and weeks start on Monday.

## Decision

Implement day closure as an idempotent domain policy called by server-side orchestration.

Use two midnight closure triggers:

- lazy closure when the app loads or a relevant server action runs;
- scheduled closure via Vercel Cron calling a protected endpoint.

For the MVP, hard-code the product timezone to `Europe/Madrid` and evaluate midnight closure by closing active days whose local date is earlier than the current local date.

## Rationale

Lazy closure makes the product resilient when the scheduled job is delayed or unavailable. Scheduled closure keeps persisted day state current even if the founder does not open the app immediately after midnight.

Comparing local calendar dates avoids hard-coding a UTC offset and reduces daylight saving risk.

## Consequences

### Positive

- Reliable enough for MVP without offline-first complexity.
- Idempotent behavior can be safely retried.
- Domain rules remain testable without Vercel or Supabase dependencies.

### Negative

- Closure may run shortly after midnight rather than exactly at midnight.
- Requires a protected server endpoint and scheduled job configuration.

### Neutral / operational

- Store `closedAt` and final score when closure happens.
- Store closed-day `finalScore`, `baseScore`, and `bonusScore`.
- Do not close based only on final score reaching 100% through bonus compensation.
- Keep base-completion closure separate from midnight closure.

## Alternatives considered

### Browser timer only

Not selected because it only works when the app is open and active.

### Database-only scheduled job

Not selected for MVP because it would move product closure rules closer to infrastructure and duplicate domain logic.

### Full offline-first closure

Not selected because offline-first behavior is out of MVP scope.

## Follow-up actions

- Add `DayClosurePolicy` domain tests before wiring any endpoint.
- Add a protected cron route after persistence exists.
- Document that `Europe/Madrid` is hard-coded for the MVP.

## Related documents

- `docs/03-architecture/technical-strategy-proposal.md`
- `docs/03-architecture/offline-strategy.md`
- `docs/01-requirements/acceptance-criteria.md`
